import {
    Component,
    CaseComponent
} from "./component"

import {
    TurnQueryIntoData
} from "../common"
/*
	Converts links into javascript enabled buttons that will be handled within the current active page.
*/
function setLinks(element, __function__) {
    let links = element.getElementsByTagName("a");
    for (let i = 0, l = links.length, temp, href; i < l; i++) {
        let temp = links[i];

        if (!temp.dataset.link) continue;

        if (!temp.onclick) temp.onclick = ((href, a) => (e) => {
            if (__function__(href, a)) e.preventDefault();
        })(temp.href, temp);
    }
};

/**
    An area to hold data and UI components. 
*/
class Element {
    constructor(element, component) {
        this.id = element.classList[0];
        this.component = component;
        this.element = element;
    }

    transitionOut() {
        if (this.component) {
            var t = this.component.transitionOut();
            this.element.removeChild(this.component.element);
            this.component.LOADED = false;
            return;
        }
        return {};
    }

    transitionIn(transition_elements, query, IS_SAME_PAGE) {
        if (this.component && !this.component.LOADED) {
            var element = this.component.element;
            if (!element.parentElement) this.element.appendChild(element);
            this.component.transitionIn(transition_elements, query, IS_SAME_PAGE);
        }
    }
}
/*
	Handles the parsing and loading of components for a particular page. 
*/
class PageView {

    constructor(URL) {
        this.url = URL;
        this.elements = [];
        this.finalizing_view = null;
    }

    transitionIn(OldView, query, IS_SAME_PAGE) {
        let final_time = 0;

        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];
            if (OldView && OldView[element.id]) {
                final_time = Math.max(element.transitionIn(OldView[element.id], query[element.id] ? query[element.id] : query, IS_SAME_PAGE), final_time);
            } else {
                element.transitionIn(null, query, IS_SAME_PAGE);
            }
        }

        if (OldView) {
            this.finalizing_view = () => {
                OldView.finalize()
            };
            setTimeout(() => {
                this.finalizeView()
            }, final_time)
        }
    }

    finalizeView() {
        if (this.finalizing_view) this.finalizing_view();
        this.finalizing_view = null;
    }

    transitionOut() {
        var out_data = {
            finalize: () => {
                console.log(this);
            }
        };

        for (var i = 0; i < this.elements.length; i++) {
            out_data[this.elements[i].id] = this.elements[i].transitionOut();
        }

        return out_data;
    }

    compareComponents() {
        //This will transition objects
    }
}

/* This Object is responsible for loading pages dynamically, handling the transition of page components, and monitoring and reacting to URL changes */
class Linker {

    constructor(presets) {
        this.views = {};
        this.components = {};
        this.component_constructors = {};
        this.models_constructors = {};
        this.presets = presets;
        this.current_url = null;
        this.current_query;
        this.current_view = null;

        /* */
        this.page_stack = [];

        window.onpopstate = () => {
            this.parseURL(document.location.pathname, document.location.search)
        }
    }

    /*
    	This function will parse a URL and determine what elements need to be loaded into the current view. 
    */
    parseURL(url, query = document.location.search) {

        if (this.current_url == url && this.current_query == query) return;

        let IS_SAME_PAGE = (this.current_url == url);

        this.current_url = url;

        this.current_query = query;

        if (this.views[url])
            return this.loadPage(url, TurnQueryIntoData(query.slice(1)), IS_SAME_PAGE);

        fetch(url, {
            credentials: "same-origin", // Sends cookies back to server with request
            method: 'GET'
        }).then((response) => {
            (response.text().then((html) => {
                var DOM = (new DOMParser()).parseFromString(html, "text/html")
                this.loadNewPage(url, DOM);
                this.loadPage(url, TurnQueryIntoData(query.slice(1)));
            }));
        }).catch((error) => {
            console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
        })
    }

    /*
    	Loads pages from server, or from local cache, and sends it to the page parser.
    */
    loadPage(url, query, IS_SAME_PAGE) {
        if (this.views[url]) {
            if (this.current_view) {
                this.views[url].transitionIn(this.current_view.transitionOut(), query, IS_SAME_PAGE);
            } else
                this.views[url].transitionIn(null, query, IS_SAME_PAGE);
            this.current_view = this.views[url];
        }
    }

    /* 
    	Pre-loads a custom constructor for an element with the specified id and provides a model to that constructor when it is called.
    	The constructor must have Component in its inheritance chain.
    */
    addStatic(element_id, constructor, model) {
        this.component_constructors[element_id] = {
            constructor,
            model_name: model
        };

    }

    addModel(model_name, modelConstructor) {
        //if(modelConstructor instanceof Model && !this.models_constructors[model_name]){
        this.models_constructors[model_name] = modelConstructor;
        //}
    }

    loadNewPage(URL, DOM) {
        //look for the app section.

        var app = DOM.getElementsByTagName("app")[0];
        var templates = DOM.getElementsByTagName("template");

        var page = new PageView(URL);

        if (app) {
            var elements = app.getElementsByTagName("element");



            for (var i = 0; i < elements.length; i++) {

                let ele = elements[i];

                var equivilant_in_document = document.getElementById(ele.id);

                if (!equivilant_in_document) {
                    var insert;
                    //need figure out the order that this goes into.

                    if (elements[i + 1] && (insert = document.getElementById(elements[i + 1].id)))
                        insert.parentElement.insertBefore(ele.cloneNode(), insert);
                    
                    else if (elements[i - 1] && (insert = document.getElementById(elements[i - 1].id)))
                        insert.parentElement.insertAfter(ele.cloneNode(), insert);

                    else 
                        insert.parentElement.getElementsByTagName("app")[0].appendChild();
                }

                var equivilant_in_document = document.getElementById(ele.id);
                //if there is a component inside the element, register that component if it has not already been registered
                var component = ele.getElementsByTagName("component")[0];

                if (component) {
                    var id = component.classList[0],
                        comp;



                    if (!equivilant_in_document.getElementsByClassName(id)[0]) {
                        component = component.cloneNode();
                        equivilant_in_document.appendChild(component);
                    }

                    if (id) {
                        if (!this.components[id]) {
                            if (comp = this.component_constructors[id]) {
                                var js_component = new comp.constructor(component, this.presets, templates);

                                if (comp.model_name && this.models_constructors[comp.model_name]) {
                                    debugger
                                    var model = this.models_constructors[comp.model_name];
                                    if (model.getter)
                                        model.getter.get();
                                    model.addView(js_component);
                                }

                                js_component.id = id;

                                this.components[id] = js_component;
                            } else {
                                var template = templates[id];

                                if (template) {
                                    this.components[id] = new CaseComponent(template, this.presets, this.models_constructors, null, DOM);
                                }
                            }
                        }
                        if (this.components[id]) {
                            this.components[id].containerElementID = ele.id;
                        }
                    }



                    page.elements.push(new Element(component, this.components[id]));
                }


            }
        } else {
            //do nothing
        }

        this.views[URL] = page;
    }
}



export {
    Linker,
    Component
}