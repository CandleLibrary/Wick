import { setLinks } from "./setlinks"

import { TransformTo } from "../../animation/animation"

import { SourceConstructor } from "../../source/source_constructor"

import { SourceBase } from "../../source/base"

import { Transitioneer } from "../../animation/transition/transitioneer"

/** @namespace Source */

/**
    Handles the transition of separate elements.
*/
class BasicSource extends SourceBase {

    constructor(element) {

        super(null, element, {}, {});

        this.anchor = null;
        this.LOADED = false;

        this.transitioneer = new Transitioneer();
        this.transitioneer.set(this.ele)
    }

    getNamedElements(named_elements) {

        let children = this.ele.children;

        for (var i = 0; i < children.length; i++) {
            let child = children[i];

            if (child.dataset.transition)
                named_elements[child.dataset.transition] = child;
        }
    }
}

/**
    This is a fallback component if constructing a CustomSource or normal Source throws an error.
*/

class FailedSource extends SourceBase {
    constructor(error_message, presets) {

        var div = document.createElement("div");
        div.innerHTML = `<h3> This Wick component has failed!</h3> <h4>Error Message:</h4><p>${error_message.stack}</p><p>Please contact the website maintainers to address the problem.</p> <p>${presets.error_contact}</p>`;
        super(null, div, {}, {});

        this.transitioneer = new Transitioneer();
        this.transitioneer.set(this.ele)
    }
}

/** @namespace Component */

/**
    The main container of Sources. Represents an area of interest on the DOM.
*/
export class Component {
    /**
     
     */
    constructor(element) {

        this.id = (element.classList) ? element.classList[0] : element.id;
        this.components = [];
        this.bubbled_elements = null;
        this.wraps = [];

        //The original element container.
        //this.parent_element = parent_element;

        //Content that is wrapped in an ele_wrap
        this.ele = element;
    }


    unloadComponents() {

        for (var i = 0; i < this.components.length; i++)
            this.components[i].LOADED = false;
    }

    transitionOut() {

        let t = 0;

        for (var i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            if (!component.LOADED) {

                component.parent = null;

                t = Math.max(component.transitionOut(), t);
            }
        };

        return t;
    }

    finalize() {

        for (var i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            if (!component.LOADED && component.parentElement) {
                component.finalizeTransitionOut();
                this.wraps[i].removeChild(component.ele);
            }

            component.LOADED = false;
        }
    }

    loadComponents(wurl) {

        for (let i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            component.parent = this;

            if (component.ele.parentElement)
                component.ele.parentElement.removeChild(component.ele);

            this.wraps[i].appendChild(component.ele);

            component.handleUrlUpdate(wurl);

            this.components[i].LOADED = true;
        };
    }

    transitionIn() {

        // This is to force a document repaint, which should cause all elements to report correct positioning hereafter

        let t = this.ele.style.top;

        this.ele.style.top = t;

        for (let i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            component.transitionIn();
        }
    }

    bubbleLink(link_url, child, trs_ele = {}) {

        this.bubbled_elements = trs_ele;

        history.pushState({}, "ignored title", link_url);

        window.onpopstate();
    }

    getTransformTo(transitions) {
        if (transitions) {
            let own_elements = {};

            this.getNamedElements(own_elements);

            for (let name in own_elements) {
                transitions[name] = TransformTo(own_elements[name]);
            }
        }
    }

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

    setComponents(App_Components, Model_Constructors, Component_Constructors, presets, DOM, wurl) {
        //if there is a component inside the element, register that component if it has not already been registered
        var components = Array.prototype.map.call(this.ele.getElementsByTagName("component"), (a) => a);

        setLinks(this.ele, (href, e) => {
            history.pushState({}, "ignored title", href);
            window.onpopstate();
            return true;
        })

        if (components.length < 1) {
            //Create a wrapped component for the elements inside the <element>
            let component = document.createElement("div");
            component.classList.add("comp_wrap");

            //Straight up string copy of the element's DOM.
            component.innerHTML = this.ele.innerHTML;
        }

        var templates = DOM.getElementsByTagName("template");


        for (var i = 0; i < components.length; i++) {
            let app_case = null;
            let component = components[i];

            try {
                /**
                    Replace the component with a component wrapper to help preserve DOM arrangement
                */

                let comp_wrap = document.createElement("div");
                comp_wrap.classList.add("comp_wrap");
                this.wraps.push(comp_wrap);
                component.parentElement.replaceChild(comp_wrap, component);

                var id = component.classList[0],
                    comp;
                /**
                  We must ensure that components act as template "landing spots". In order for that to happen we must check for:
                  (1) The component has, as it's first class name, an id that (2) matches the id of a template. If either of these prove to be not true, we should reject the adoption of the component as a Wick
                  component and instead treat it as a normal "pass through" element.
                */
                if (!id) {
                    /*setLinks(component, (href, e) => {
                        history.pushState({}, "ignored title", href);
                        window.onpopstate();
                        return true;
                    })*/

                    app_case = new BasicSource(component);

                } else {

                    if (!App_Components[id]) {
                        if (comp = Component_Constructors[id]) {

                            app_case = new comp.constructor(templates, presets, component, DOM);

                            if (comp.model_name && Model_Constructors[comp.model_name]) {
                                var model = Model_Constructors[comp.model_name];
                                if (model.getter)
                                    model.getter.get();
                                model.addView(app_case);
                            }

                            app_case.id = id;

                            App_Components[id] = app_case;
                        } else {
                            var template = templates[id];

                            if (template) {
                                app_case = SourceConstructor(template, presets, DOM)(); //new SourceComponent(template, presets, Model_Constructors, null, DOM);
                            } else {
                                let constructor = SourceConstructor(component, presets, DOM);

                                if (!constructor)
                                    constructor = SourceConstructor(component.children[0], presets, DOM);
                                if (!constructor)
                                    app_case = new BasicSource(component);
                                else
                                    app_case = constructor();
                            }
                        }

                        if (!app_case) {
                            console.warn("App Component not constructed");
                            /** TODO: If there is a fallback <no-script> section use that instead. */
                            app_case = new FailedSource();
                        } else {
                            App_Components[id] = app_case;
                        }
                    } else {
                        app_case = App_Components[id];
                    }

                    app_case.handleUrlUpdate(wurl);
                }
            } catch (e) {
                console.log(e)
                app_case = new FailedSource(e, presets);
            }

            this.components.push(app_case);
        }
    }
}