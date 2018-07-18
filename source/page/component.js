import { TransformTo } from "../animation/animation"

import { SourceConstructor } from "../source/constructor"

import { SourceBase } from "../source/base"

import { Transitioner } from "../animation/transition/transitioner"

/**
 * The base class for all components
 * @param      {external:HTMLElement}  element  The DOM `<component>` element that the Component can append sub elements to. It may be replaced by a different type of element if necessary, is in the case with an ErrorComponent.
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
     * @param      {Object}  named_elements  Object to bind named elements to.
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
    handleUrlUpdate() {};

    /**
     * Called by the hosting Element when it is mounted to the active page. 
     * Allows the component to apply a transition in effect. 
     */
    transitionIn() {};

    /**
     * Called by the hosting Element before it is unmounted from the active page. 
     * Allows the component to apply a transition out effect. 
     * @override
     */
    transitionOut() {};
}

/**
 * The component class that can be extended by users to provide alternatives to the Wick template component implementation.
 * @memberof module:wick.core
 * @alias CustomComponent
 * @extends BaseComponent
 */
class CustomComponent extends BaseComponent {};


/**
 * Component attaches an error message to the `<component>`.  It allows JS errors to show in client space.
 * @param      {external:HTMLElement}  element        Ignored by this class
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
 * @param      {external:HTMLElement}  element                 The element
 * @param      {Presets}  presets                 The global Presets object
 * @param      {Object}  app_components          The application components
 * @param      {Object}  component_constructors  The component constructors
 * @param      {Object}  model_constructors      The model constructors
 * @param      {external:HTMLElement}  WORKING_DOM             The working dom
 * @memberof module:wick~internals.component
 * @alias Component
 * @return     {Component}  If this object is already cached in app_components, returns the existing cached object. 
 * @extends BaseComponent
 */
class Component extends BaseComponent {

    constructor(element, presets, app_components, WORKING_DOM) {

        super(element)

        /**
         * The {@link Model} the 
         */
        this._m = null;

        /**
         * All {@link Source}s bound to this component from a {@link SourcePackag}.
         */
        this.sources = [];

        /**
         *  Set to true by Element when the Element mounts the component to the document.
         */
        this.ACTIVE = false;

        const id = element.classList[0];

        if (app_components[id])
            return app_components[id];
        if (presets.custom_sources[id]) {
            presets.custom_sources[id].mount(this.ele, this)
        } else {
            SourceConstructor(this.ele, presets, WORKING_DOM).mount(this.ele, null, presets.USE_SHADOW, this)
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

        for (var i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            component.getNamedElements(named_elements);
        }
    }

    /**
     * @override
     */
    handleUrlUpdate(wurl) {
        return;
        let query_data = null;
        /* 
            This part of the function will import data into the model that is obtained from the query string 
        */
        if (wurl && this.data.import) {
            query_data = {};
            if (this.data.import == "null") {
                query_data = wurl.getClass();
            } else {
                var l = this.data.import.split(";")
                for (var i = 0; i < l.length; i++) {
                    let n = l[i].split(":");

                    let class_name = n[0];
                    let p = n[1].split("=>");
                    var key_name = p[0];
                    var import_name = p[1];
                    if (class_name == "root") class_name = null;
                    query_data[import_name] = wurl.get(class_name, key_name);
                }
            }
        }

        if (wurl && this.data.url) {

            let query_data = {};
            if (this.url_query) {
                var l = this.url_query.split(";")
                for (var i = 0; i < l.length; i++) {
                    let n = l[i].split(":");
                    let class_name = n[0];
                    let p = n[1].split("=>");
                    var key_name = p[0];
                    var import_name = p[1];
                    if (class_name == "root") class_name = null;
                    query_data[import_name] = wurl.get(class_name, key_name);
                }
            }

            this.____request____(query_data)
        }

        if (!this._m) {

            this._m = new this._m_constructor();


            if (this.getter)
                this.getter.setModel(this._m);

            this._m.addView(this);
        }

        if (query_data) {
            if (!this._m.add(query_data)) {
                this.update(this._m.get());
            }
        } else
            this.update(this._m.get());
    }
}

export { BaseComponent, CustomComponent, FailedComponent, Component }