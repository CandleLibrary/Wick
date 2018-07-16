import { TransformTo } from "../../animation/animation"

import { SourceConstructor } from "../../source/constructor"

import { SourceBase } from "../../source/base"

import { Transitioner } from "../../animation/transition/transitioner"

/** @namespace Component */

/**
    Handles the transition of separate elements.
*/
export class BasicComponent {
    constructor(element) {
        this.ele = element;
        this.anchor = null;
        this.LOADED = false;

        //this.transitioneer = new Transitioneer();
        //this.transitioneer.set(this.ele)
    }

    getNamedElements(named_elements) {
        let children = this.ele.children;

        for (var i = 0; i < children.length; i++) {
            let child = children[i];

            if (child.dataset.transition) {
                named_elements[child.dataset.transition] = child;
            }
        }
    }

    handleUrlUpdate() {};

    transitionIn() {};

    transitionOut() {};
}

/**
    This is a fallback component if constructing a CustomSource or normal Source throws an error.
*/

export class FailedComponent {
    constructor(element, error_message, presets) {
        var div = document.createElement("div");
        div.innerHTML = `<h3> This Wick component has failed!</h3> <h4>Error Message:</h4><p>${error_message.stack}</p><p>Please contact the website maintainers to address the problem.</p> <p>${presets.error_contact}</p>`;

        this.ele = div;
        //this.transitioneer = new Transitioneer();
        //this.transitioneer.set(this.ele)
    }

    handleUrlUpdate() {};

    transitionIn() {};

    transitionOut() {};
}

/**
 * A Component handles a collection of Sources.  
 *
 * @class      Component (name)
 */
export class Component {

    /**
     * Constructs the object.
     *
     * @param      {<type>}  element  The element
     */
    constructor(element, presets, app_components, component_constructors, model_constructors, WORKING_DOM) {

        this.ele = element;
        this.model = null;
        this.sources = [];

        // Set to true by Element when the Element is mounted in the DOM.
        this.ACTIVE = false;

        // Set to true when the Component is ready to load its contents.
        this.LOADED = false;

        const id = element.classList[0];

        if (app_components[id])
            return app_components[id];

        //** Some cached code paths for Asynch operation *//
        const mount_package = ($package, model) => {
            $package.mount(this.ele, model, presets.USE_SHADOW, this)

            this.LOADED = true;

            if (this.ACTIVE) {
                this.transitionIn();
                this.sources.forEach((s)=>{
                    s.ACTIVE = true;
                    if(s.model)
                        s.update(s.model);
                })
            }
        }

        const load_in_doc = () => {

            var templates = WORKING_DOM.getElementsByTagName("template");

            for (let i = 0; i < templates.length; i++) {

                let template = templates[i];

                if (template.id == id) {

                    let $package = SourceConstructor(template, presets, WORKING_DOM);

                    mount_package($package);

                    return;
                }
            }

            //let comp =  new FailedComponent(this.ele);
        }

        if (component_constructors[id]) {
            mount_package(component_constructors[id], component_constructors[id].model);
        } else {

            //We'll check to see if the component needs to be loaded from the network. 
            let url = "";

            if ((url = this.ele.getAttribute("src"))) {

                //Attempt to retrieve component from network.
                fetch(url, {
                    credentials: "same-origin",
                    method: "Get"
                }).then((response) => {

                    if (response.status !== 200) {
                        load_in_doc();
                    } else

                        response.text().then((str) => {

                            let element = document.createElement("div")

                            element.innerHTML = str;

                            let constructing_template = element.getElementsByTagName('template')[0];

                            if (!constructing_template) throw new Error(`No template found for "${url}"`);

                            let $package = SourceConstructor(constructing_template, presets, element);

                            if ($package)
                                mount_package($package);
                            else
                                load_in_doc();
                        })
                }).catch((e) => {
                    //Fall back to local DOM if nothing is received
                    console.error(e);
                    load_in_doc();
                })
            } else {
                load_in_doc();
            }
        }

        app_components[id] = this;
    }

    transitionOut() {

        if (!this.LOADED || !this.ACTIVE) {
            this.ACTIVE = false;
            return 0;
        }

        this.ACTIVE = false;

        let t = 0;

        return t;
    }

    finalize() {}

    transitionIn() {

        if (!this.LOADED || this.ACTIVE) {
            this.ACTIVE = true;
            return 0;
        }

        this.ACTIVE = true;
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

        if (!this.model) {

            this.model = new this.model_constructor();


            if (this.getter)
                this.getter.setModel(this.model);

            this.model.addView(this);
        }

        if (query_data) {
            if (!this.model.add(query_data)) {
                this.update(this.model.get());
            }
        } else
            this.update(this.model.get());
    }
}