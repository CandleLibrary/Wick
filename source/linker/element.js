import {setLinks} from "./setlinks"
import {TransformTo} from "../animation/animation"

import {
    Component,
    CaseComponent,
    FailedComponent
} from "./component"

/**
    An area to hold data and UI components.
*/
class Element {
    /**

    */
    constructor(element) {
        this.id =  (element.classList) ? element.classList[0] : element.id;
        this.components = [];
        this.wraps = [];

        //The original element container.
        //this.parent_element = parent_element;

        //Content that is wrapped in an ele_wrap
        this.element = element;
    }

    transitionOut(transitions) {
        let t = 0;

        for (var i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            if (component.transitionOut) {
                t = Math.max(component.transitionOut(),t);
            }
        };

        return t;
    }

    transitionIn(transition_elements, query, IS_SAME_PAGE) {
        //if(!IS_SAME_PAGE && this.parent_element)
            //this.parent_element.appendChild(this.element);

        for (var i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            if (component) {

                if(!IS_SAME_PAGE) {
                    
                    if(component.element.parentElement)
                        component.element.parentElement.removeChild(component.element);

                    this.wraps[i].appendChild(component.element);
                }

                component.LOADED = true;

                component.transitionIn(transition_elements, query, IS_SAME_PAGE);
            }
        };

        /**
            This is to force a document repaint, which should cause all elements to report correct positioning hereafter
        */
        var t = this.element.style.top;        
    }

    getTransformTo(transitions){
         if(transitions){
            let own_elements = {};
            
            this.getNamedElements(own_elements);

            for(let name in own_elements){
                transitions[name] = TransformTo(own_elements[name]);
            }
        }
    }

    setTransformTo(transitions){
       if(transitions){
            let own_elements = {};
            this.getNamedElements(own_elements);

            for(let name in own_elements){
                let to, from = transitions[name];
                if((to = own_elements[name]) && from){
                    from(to, false);
                }
            }
        } 
    }

    finalize(){
        for (var i = 0; i < this.components.length; i++) {

            let component = this.components[i];

            if(!component.LOADED)
                this.wraps[i].removeChild(component.element);

            component.LOADED = false;
        }

        //if(this.parent_element && this.element.parentNode)
            //this.parent_element.removeChild(this.element);
    }

    getNamedElements(named_elements){
        let children = this.element.children;

        for(var i = 0; i < children.length; i++){
            let child = children[i];

            if (child.dataset.transform) {
                named_elements[child.dataset.transform] = child;
            }
        }

        for (var i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            component.getNamedElements(named_elements);
        }
    }

    setComponents(App_Components, Model_Constructors, Component_Constructors, presets, DOM){
        //if there is a component inside the element, register that component if it has not already been registered
        var components = Array.prototype.map.call(this.element.getElementsByTagName("component"),(a)=>a);

        setLinks(this.element, (href, e) => {
            history.pushState({}, "ignored title", href);
            window.onpopstate();
            return true;
        })

        if(components.length < 1){
            //Create a wrapped component for the elements inside the <element>
            let component = document.createElement("div");
            component.classList.add("comp_wrap");

            //Straight up string copy of the element's DOM.
            component.innerHTML = this.element.innerHTML;
        }

        var templates = DOM.getElementsByTagName("template");


        for (var i = 0; i < components.length; i++) {
            let app_component = null;
            let component = components[i];

            try{
                /**
                    Replace the component with a component wrapper to help preserve DOM arrangement
                */

                let comp_wrap = document.createElement("div");
                comp_wrap.classList.add("comp_wrap");
                this.wraps.push(comp_wrap);
                this.element.replaceChild(comp_wrap, component);

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

                    app_component = new Component(component);

                } else {

                    if (!App_Components[id]) {
                        if (comp = Component_Constructors[id]) {
                            app_component = new comp.constructor(component, presets, templates);

                            if (comp.model_name && Model_Constructors[comp.model_name]) {
                                var model = Model_Constructors[comp.model_name];
                                if (model.getter)
                                    model.getter.get();
                                model.addView(app_component);
                            }

                            app_component.id = id;

                            App_Components[id] = app_component;
                        } else {
                            var template = templates[id];

                            if (template)
                                app_component = new CaseComponent(template, presets, Model_Constructors, null, DOM);
                            else
                                app_component = new Component(component);
                        }

                        if(!app_component){
                            console.warn("App Component not constructed");
                            /** TODO: If there is a fallback <no-script> section use that instead. */
                            app_component = new FailedComponent();
                        }else{
                            App_Components[id] = app_component;
                        }
                    }else{
                        app_component = App_Components[id];
                    }
                }
            }catch(e){
                console.log(e)
                app_component = new FailedComponent(e, presets);
            }




            this.components.push(app_component);
        }
    }
}

export {
    Element
}
