import { Component, FailedComponent } from "./component";

/**
 * Class for element.
 *
 * @class      Element (name)
 * 
 * Elements are the root scope for a set of components. 
 * If two pages share the same element name, then the will remain mounted on the page as it transitions to the next. 
 * Elements are used to determine how one page transitions into another. 
 */
export class Element {
    /**
     * Constructs an Element.
     *
     * @param      {HTMLElement}  element  The HTMLElement that this Element will be bound to. 
     */
    constructor(element, page) {
        this.id = (element.classList) ? element.classList[0] : element.id;
        this.components = [];
        this.bubbled_elements = null;
        this.wraps = [];
        this.page = page;



        //The original element container.
        //this.parent_element = parent_element;

        //Content that is wrapped in an ele_wrap
        this.ele = element;

        if(element.dataset.unique)
            this.unique = !!element.dataset.unique;
        else
            this.unique = false;

        console.log(this.unique)
    }


    unloadComponents() {
        for (var i = 0; i < this.components.length; i++)
            this.components[i].LOADED = false;
    }

    transitionOut(transitioneer) {

        for (var i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            if (!component.LOADED) {

                component.parent = null;

                component.transitionOut(transitioneer);
            }
        }
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

    up(data, src){
        this.page.up(data, src);
    }

    down(data, src){
        for (var i = 0; i < this.components.length; i++)
            this.components[i].down(data, src);
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
        }
    }

    transitionIn(transitioneer) {

        // This is to force a document repaint, which should cause all elements to report correct positioning hereafter

        let t = this.ele.style.top;
        this.ele.style.top = t;

        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];

            component.transitionIn(transitioneer);
        }
    }

    bubbleLink(link_url, child, trs_ele = {}) {

        this.bubbled_elements = trs_ele;

        history.pushState({}, "ignored title", link_url);

        window.onpopstate();
    }

    setComponents(Model_Constructors, Component_Constructors, presets, DOM, wurl, add_pending, res_pending) {
        //if there is a component inside the element, register that component if it has not already been registered

        var components = Array.prototype.map.call(this.ele.getElementsByTagName("component"), (a) => a);

        if (components.length < 1) {
            //Create a wrapped component for the elements inside the <element>
            let component = document.createElement("div");

            component.classList.add("comp_wrap");

            //Straight up string copy of the element's DOM.
            component.innerHTML = this.ele.innerHTML;
        }

        for (var i = 0; i < components.length; i++) {
            let app_component = null,
                component = components[i],
                e;

            add_pending(1);

            try {

                /**
                    Replace the component with a component wrapper to help preserve DOM arrangement
                */
                //*
                let comp_wrap = document.createElement("div");
                comp_wrap.classList.add("comp_wrap");
                this.wraps.push(comp_wrap);
                component.parentElement.replaceChild(comp_wrap, component);
                //*/

                var id = component.dataset.class;
                /**
                  We must ensure that components act as template "landing spots". In order for that to happen we must check for:
                  (1) The component has, as it's first class name, an id that (2) matches the id of a template. If either of these prove to be not true, we should reject the adoption of the component as a Wick
                  component and instead treat it as a normal "pass through" element.
                */

                if (!id) {

                    app_component = new Component(component, presets, DOM, (this.unique) ? null : this.common_components, res_pending, this);

                    app_component.handleUrlUpdate(wurl);
                    
                } else {

                    let custom_component = presets.custom_components[id];

                    if (custom_component)
                        app_component = new custom_component(component, presets, DOM, res_pending);
                }
            } catch (error) { 
                app_component = new FailedComponent(component, error, presets);
                res_pending();
            }

            if (!app_component) {
                app_component = new FailedComponent(component, new Error("Could not create new component, no suitable build data found."), presets);
                res_pending();
            }

            this.components.push(app_component);
        }
    }
}