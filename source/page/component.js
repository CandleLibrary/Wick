import { WURL } from "../network/wurl";
import { SourcePackage } from "../source/package";

/**
 * The base class for all components
 * @param      {HTMLElement}  element  The DOM `<component>` element that the Component can append sub elements to. It may be replaced by a different type of element if necessary, is in the case with an ErrorComponent.
 * @memberof module:wick~internals.component
 * @alias BaseComponent
 */
class BaseComponent {

    constructor(element) {
        /**
         * The HTML element the component will append elements to. 
         */
        this.ele = element;

        /**
         * Set to `true` if the component's `ele` element is currently appended to the main document.
         */
        this.LOADED = false;
    }

    /**
     * Returns a list of all elements that have a name attribute.
     * @param      {Object}  named_elements  Object to _bind_ named elements to.
     */
    getNamedElements(named_elements) {}

    /**
     * Called by the hosting Element when it is mounted to the active page. 
     * Allows the component to react to changes observed in the URL of the website. 
     */
    handleUrlUpdate() {}

    /**
     * Called by the hosting Element when it is mounted to the active page. 
     * Allows the component to apply a transition in effect. 
     */
    transitionIn() {}

    /**
     * Called by the hosting Element before it is unmounted from the active page. 
     * Allows the component to apply a transition out effect. 
     * @override
     */
    transitionOut() {}

    finalizeMount(parent) {
        if (this.LOADED == false && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);
    }

    pendMount(obj, wrap_index, wurl) {
        this.LOADED = true;
        this.parent = obj;
        this.parent.wraps[wrap_index].appendChild(this.ele);
        this.handleUrlUpdate(wurl);
    }
}

/**
 * The component class that can be extended by users to provide alternatives to the Wick template component implementation.
 * @memberof module:wick.core
 * @alias CustomComponent
 * @extends BaseComponent
 */
class CustomComponent extends BaseComponent {}


/**
 * Component attaches an error message to the `<component>`.  It allows JS errors to show in client space.
 * @param      {HTMLElement}  element        Ignored by this class
 * @param      {(string | Error)}  error_message  The error message or object to display.
 * @param      {Presets}  presets        The global Presets object. 
 * @alias FailedComponent
 * @memberof module:wick~internals.component
 * @extends BaseComponent
 */
class FailedComponent extends BaseComponent {
    constructor(element, error_message, presets) {
        super(document.createElement("div"));
        this.ele.innerHTML = `<h3> This Wick component has failed!</h3> <h4>Error Message:</h4><p>${error_message.stack}</p><p>Please contact the website maintainers to address the problem.</p> <p>${presets.error_contact}</p>`;
    }
}

/**
 * Builds out a `<component>` trough the Wick templating system. 
 * @param      {HTMLElement}  element                 The element
 * @param      {Presets}  presets                 The global Presets object
 * @param      {Object}  app_components          The application components
 * @param      {Object}  component_constructors  The component constructors
 * @param      {Object}  model_constructors      The model constructors
 * @param      {HTMLElement}  WORKING_DOM             The working dom
 * @memberof module:wick~internals.component
 * @alias Component
 * @return     {Component}  If this object is already cached in app_components, returns the existing cached object. 
 * @extends BaseComponent
 */
class Component extends BaseComponent {

    constructor(element, presets, DOM, app_components, resolve_pending, wick_ele) {

        super(element);

        this.element = wick_ele;

        /**
         * The {@link Model} the 
         */
        this._model_ = null;

        /**
         * All {@link Source}s bound to this component from a {@link SourcePackag}.
         */
        this.sources = [];

        /**
         *  Set to true by Element when the Element mounts the component to the document.
         */
        this.ACTIVE = false;

        this._resolve_pending_ = resolve_pending;

        const id = element.classList[0];

        if (id && app_components && app_components[id]) {
            this.resolve();
            return app_components[id];
        }
        if (presets.custom_sources[id]) {
            presets.custom_sources[id].mount(this.ele, this);
            this.resolve();
        } else {
            let template = DOM.getElementById(id);
            let url = element.getAttribute("url");
            if (template && template.tagName == "TEMPLATE") {
                (new SourcePackage(template, presets, false, url)).mount(this.ele, null, presets.options.USE_SHADOW, this);
            } else if (url) {
                (new WURL(url))
                .fetchText()
                    .then(text => {
                        (new SourcePackage(text, presets, false, url)).mount(null, null, presets.options.USE_SHADOW, this);
                    });
            } else {
                (new SourcePackage(this.ele.innerHTML, presets, false, url)).mount(null, null, presets.options.USE_SHADOW, this);
            }
        }
        if (app_components)
            app_components[id] = this;
    }

    resolve() {
        if (this._resolve_pending_)
            this._resolve_pending_();
        this._resolve_pending_ = null;
    }

    /**
     * @override
     */
    transitionOut(transitioneer) {

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._transitionOut_({ trs_out: transitioneer });

        if (!this.LOADED || !this.ACTIVE) {
            this.ACTIVE = false;
            return 0;
        }

        this.ACTIVE = false;

        let t = 0;

        return t;
    }

    /**
     * @override
     */
    transitionIn(transitioneer) {

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._transitionIn_({ trs_in: transitioneer });


        if (!this.LOADED || this.ACTIVE) {
            this.ACTIVE = true;
            return 0;
        }

        this.ACTIVE = true;
    }

    /**
     * @override
     */
    bubbleLink(link_url, child, trs_ele = {}) {

        this.bubbled_elements = trs_ele;

        history.pushState({}, "ignored title", link_url);

        window.onpopstate();
    }

    sourceLoaded() {
        if (this.sources.length > 0) {


            let ele = this.sources[0].ele;

            if (ele !== this.ele) {
                if (this.ele.parentElement) {

                    this.ele.parentElement.insertBefore(ele, this.ele);
                    this.ele.parentElement.removeChild(this.ele);
                }
                this.ele = ele;
            }
        }

        this._resolve_pending_();

        this._resolve_pending_ = null;

        this.handleUrlUpdate();
    }

    /**
     * @override
     */
    handleUrlUpdate(wurl = new WURL("", true)) {

        let query_data = wurl.getData();

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._update_(query_data, null, true);


        if (this.wurl_store) {
            let wurl = this.wurl_store;
            this.wurl_store = null;
            this.handleUrlUpdate(wurl);
        }

        if (this.sources.length == 0)
            this.wurl_store = wurl;
    }

    _bubbleLink_() {

    }

    _upImport_(prop_name, data, meta, src) {
        let d = {};
        d[prop_name] = data;
        this.element.up(d, src);
    }

    down(data, src) {
        for (let i = 0, l = this.sources.length; i < l; i++)
            if (src !== this.sources[i]) this.sources[i]._down_(data);
    }
}

export { BaseComponent, CustomComponent, FailedComponent, Component };