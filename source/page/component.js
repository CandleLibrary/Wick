import { TransformTo } from "../animation/animation";
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
    getNamedElements(named_elements) {
        let children = this.ele.children;

        for (var i = 0; i < children.length; i++) {
            let child = children[i];

            if (child.dataset.transition) {
                named_elements[child.dataset.transition] = child;
            }
        }
    }

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

    constructor(element, presets, DOM, app_components) {

        super(element);

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

        const id = element.classList[0];



        if (id && app_components[id])
            return app_components[id];
        if (presets.custom_sources[id])
            presets.custom_sources[id].mount(this.ele, this);
        else {
            let template = DOM.getElementById(id);
            let url = element.getAttribute("url");
            if (template && template.tagName == "TEMPLATE") {
                (new SourcePackage(template, presets)).mount(this.ele, null, presets.options.USE_SHADOW, this);
            } else if (url) {
                (new WURL(url))
                .fetchText()
                    .then(text => {
                        (new SourcePackage(text, presets)).mount(this.ele, null, presets.options.USE_SHADOW, this);
                    });
            } else {
                (new SourcePackage(this.ele.innerHTML, presets)).mount(this.ele, null, presets.options.USE_SHADOW, this);
            }
        }


        app_components[id] = this;
    }

    /**
     * @override
     */
    transitionOut() {

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
    transitionIn() {

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

    /**
     * @override
     */
    getTransformTo(transitions) {
        if (transitions) {
            let own_elements = {};

            this.getNamedElements(own_elements);

            for (let name in own_elements) {
                transitions[name] = TransformTo(own_elements[name]);
            }
        }
    }

    /**
     * @override
     */
    setTransformTo(transitions) {
        if (transitions) {
            let own_elements = {};

            this.getNamedElements(own_elements);

            for (let name in own_elements) {
                let to, from = transitions[name];
                if ((to = own_elements[name]) && from) {
                    from(to, false);
                }
            }
        }
    }

    /**
     * @override
     */
    getNamedElements(named_elements) {
        if (this.bubbled_elements) {
            let t = this.bubbled_elements;

            for (let t in this.bubbled_elements)
                named_elements[t] = this.bubbled_elements[t];

            //this.bubbled_elements = null;

            return;
        }

        let children = this.ele.children;

        for (var i = 0; i < children.length; i++) {
            let child = children[i];

            if (child.dataset.transition) {
                named_elements[child.dataset.transition] = child;
            }
        }

        for (var i = 0; i < this.sources.length; i++) {
            // let component = this.components[i];
            // component.getNamedElements(named_elements);
        }
    }

    sourceLoaded() { this.handleUrlUpdate(); }

    /**
     * @override
     */
    handleUrlUpdate(wurl = new WURL("", true)) {

        let query_data = wurl.getData();

        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._update_(query_data, null, true);
    }
}

export { BaseComponent, CustomComponent, FailedComponent, Component }