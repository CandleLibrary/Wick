import {
    Component,
    CaseComponent
} from "./component"

import {
    TurnQueryIntoData
} from "../common"

import {
    PageView
} from "./page"

import {
    Element
} from "./element"

import {
    Modal
} from "./modal"


/*
	Converts links into javascript enabled buttons that will be handled within the current active page.
*/
function setLinks(element, __function__) {
    let links = element.getElementsByTagName("a");
    for (let i = 0, l = links.length, temp, href; i < l; i++) {
        let temp = links[i];

        console.log(temp)

        if (!temp.dataset.link) continue;

        if (!temp.onclick) temp.onclick = ((href, a, __function__) => (e) => {
            e.preventDefault();
            if (__function__(href, a)) e.preventDefault();
        })(temp.href, temp, __function__);
    }
};

/* This Object is responsible for loading pages dynamically, handling the transition of page components, and monitoring and reacting to URL changes */
class Linker {

    constructor(presets) {
        this.pages = {};
        this.components = {};
        this.component_constructors = {};
        this.models_constructors = {};
        this.presets = presets;
        this.current_url = null;
        this.current_query;
        this.current_view = null;
        this.finalizing_pages = [];

        /* */
        this.modal_stack = [];

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

        if (this.pages[url])
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

    finalizePages() {
        for (var i = 0, l = this.finalizing_pages.length; i < l; i++) {
            var page = this.finalizing_pages[i];
            page.finalize();
        }

        this.finalizing_pages.length = 0;
    }

    /*
    	Loads pages from server, or from local cache, and sends it to the page parser.
    */
    loadPage(url, query, IS_SAME_PAGE) {
        let page, transition_length = 0;

        //Finalize any existing page transitions;
        this.finalizePages();

        if (page = this.pages[url]) {

            if (page instanceof Modal) {
                //trace modal stack and see if the modal already exists
                if (IS_SAME_PAGE) {
                    page.transitionIn(null, query, IS_SAME_PAGE)
                    return;
                }

                let UNWIND = 0;


                for (var i = 0, l = this.modal_stack.length; i < l; i++) {
                    let modal = this.modal_stack[i];

                    if (UNWIND == 0) {
                        if (modal.page.url == url) {
                            UNWIND = i + 1;
                        }
                    } else {
                        let trs = 0;
                        if (trs = this.modal_stack[i].transitionOut()) {
                            transition_length = Math.max(trs, transition_length);
                            this.finalizing_pages.push(this.modal_stack[i]);
                        }
                    }
                }

                if (UNWIND > 0) {
                    this.modal_stack.length = UNWIND;
                    page.transitionIn(null, query, IS_SAME_PAGE);
                } else {
                    //create new modal
                    this.modal_stack.push(page);
                    page.transitionIn(null, query, IS_SAME_PAGE);
                }

            } else {

                for (var i = 0, l = this.modal_stack.length; i < l; i++) {
                    let trs = 0;
                    if (trs = this.modal_stack[i].transitionOut()) {
                        transition_length = Math.max(trs, transition_length);
                        this.finalizing_pages.push(this.modal_stack[i]);
                    }
                }

                this.modal_stack.length = 0;
                
                let trs = 0;
                
                if (this.current_view && (trs = this.current_view.transitionOut())) {
                    transition_length = Math.max(trs, transition_length);
                    this.finalizing_pages.push(this.current_view);
                }

                page.transitionIn(this.current_view, query, IS_SAME_PAGE);

                this.current_view = page;

                if(transition_length > 0){
                    setTimeout(()=>{this.finalizePages()}, transition_length);
                }
            }
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

        let app_source = DOM.getElementsByTagName("app")[0]

        if (!app_source)
            console.warn("page does not have an app element!");

        var app = app_source.cloneNode(true);
        var dom_app = document.getElementsByTagName("app")[0];

        var templates = DOM.getElementsByTagName("template");

        var page = new PageView(URL);

        if (app) {
            //get the page type, defaults to Normal
            var PageType = DOM.getElementsByTagName("pagetype")[0];

            if (PageType) {
                page.setType(PageType.innerHTML);
                if (page.type == "modal") {
                    if (app.getElementsByTagName("modal")[0]) {
                        app = app.getElementsByTagName("modal")[0];
                        let dom_modal = DOM.getElementsByTagName("modal")[0];
                        dom_modal.parentElement.removeChild(dom_modal);
                    } else
                        page.type = "normal";
                }
            }


            var elements = app.getElementsByTagName("element");

            for (var i = 0; i < elements.length; i++) {

                let ele = elements[i];
                let equivilant_element_main_dom = null;

                if (page.type !== "modal") {

                    equivilant_element_main_dom = dom_app.querySelector(`#${ele.id}`);

                    if (!equivilant_element_main_dom) {
                        var insert;
                        //need figure out the order that this goes into.

                        if (elements[i + 1] && (insert = dom_app.querySelector(`#${elements[i + 1].id}`)))
                            dom_app.insertBefore(ele.cloneNode(), insert);

                        else if (elements[i - 1] && (insert = dom_app.querySelector(`#${elements[i - 1].id}`)))
                            dom_app.insertBefore(ele.cloneNode(), insert.nextSibling);

                        else
                            dom_app.appendChild(ele.cloneNode());

                    }

                    equivilant_element_main_dom = dom_app.querySelector(`#${ele.id}`);

                    if (document == DOM) {
                        //clear out the existing element
                        equivilant_element_main_dom.innerHTML = "";
                    }
                }
                //if there is a component inside the element, register that component if it has not already been registered
                var component = ele.getElementsByTagName("component")[0];

                if (component) {
                    var id = component.classList[0],
                        comp;

                    if (page.type !== "modal") {
                        component = component.cloneNode();
                        if (equivilant_element_main_dom) equivilant_element_main_dom.appendChild(component);
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
                } else {
                    //create a wrapped component for the elements inside the 
                    let component = new Component(ele.firstElementChild);

                    setLinks(ele, (href, e) => {
                        history.pushState({}, "ignored title", href);
                        window.onpopstate();
                        return true;
                    })


                    if (page.type !== "modal") {
                        ele.removeChild(ele.firstElementChild);
                        page.elements.push(new Element(equivilant_element_main_dom, component));
                    } else
                        page.elements.push(new Element(ele, component));

                }
            }

            this.pages[URL] = (page.type == "modal") ? new Modal(URL, page, app) : page;
        }
    }

}



export {
    Linker,
    Component
}