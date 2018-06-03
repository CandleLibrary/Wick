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


/** @namespace linker */

/**
 *  Responsible for loading pages and presenting them in the main DOM.
 */
class Linker {
    /**
     *  This (inker.Linker) is responsible for loading pages dynamically, handling the transition of page components, and monitoring and reacting to URL changes
     *
     *
     *  @param {LinkerPresets} presets - A preset based object that will be used by Wick for handling custom components. Is validated according to the definition of a LinkerPreset
     */
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

        /*
          The static field in presets are all Component-like objects contructors that are defined by the client
          to be used by Wick for custom components.

          The constructors must support several Component based methods in ordered ot be accepted for use. These methodes include:
            transitionIn
            transitionOut
            setModel
            unsetModel
        */
        if (presets.static) {
            for (let component_name in presets.static) {
                let component = presets.static[component_name];

                if ( true
                    //(component.transitionIn && component.transitionIn instanceof Function) &&
                    //(component.transitionOut && component.transitionOut instanceof Function) &&
                    //(component.setModel && component.setModel instanceof Function) &&
                    //(component.unsetModel && component.unsetModel instanceof Function) &&
                    //(component.transitionIn && component.transitionIn instanceof Function)
                ) this.addStatic(component_name, component);
                else
                    console.warn(`Static component ${component_name} lacks correct component methods`);
            }
        }

        /** TODO
            @define PageParser

            A page parser will parse templates before passing that data to the Case handler.
        */
        if (presets.parser) {
            for (let parser_name in presets.page_parser) {
                let parser = presets.page_parser[parser_name];
            }
        }

        /**
          TODO Validate that every schama is a Model constructor
        */

        /* */
        this.modal_stack = [];

        window.onpopstate = () => {
            this.parseURL(document.location.pathname, document.location.search)
        }
    }

    /*
    	This function will parse a URL and determine what Page needs to be loaded into the current view.
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

    /**
    	Loads pages from server, or from local cache, and sends it to the page parser.

      @param {string} url - The URL id of the cached page to load.
      @param {string} query -
      @param {Bool} IS_SAME_PAGE -
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

                let transition_elements = {};

                console.log("transition elements", transition_elements)

                if (
                    this.current_view &&
                    this.current_view != page
                ) {
                    this.current_view.getNamedElements(transition_elements);
                    transition_length = Math.max(this.current_view.transitionOut(), transition_length);
                    this.finalizing_pages.push(this.current_view);
                }

                this.current_view = page;

                page.transitionIn(this.current_view, query, IS_SAME_PAGE, transition_elements);

                setTimeout(() => {
                    this.finalizePages();
                }, transition_length + 1);
            }
        }
    }

    /**
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
        /**
            Creates a new iframe object that acts as a modal that will sit ontop of everything else.
        */
    loadNonWickPage(URL) {
            let iframe = document.createElement("iframe");
            iframe.src = URL;
            iframe.classList.add("modal", "comp_wrap");
            var page = new PageView(URL);
            page.type = "modal";
            this.pages[URL] = new Modal(URL, page, iframe);
        }
        /**
            Takes the DOM of another page and strips it, looking for component and app elements to use to integrate into the SPA system.
            If it is unable to find these elements, then it will pass the DOM to loadNonWickPage to handle wrapping the page body into a wick app element.
        */
    loadNewPage(URL, DOM) {
        //look for the app section.

        let app_source = DOM.getElementsByTagName("app")[0]

        /**
          If there is no <app> element within the DOM, then we must handle this case carefuly. This likely indicates a page delivered from the same origin that has not been converted to work with the Wick system.
          The entire contents of the page can be wrapped into a iframe, that will be could set as a modal ontop of existing pages. <- this.
        */
        if (!app_source) {
            console.warn("Page does not have an <app> element!");
            return this.loadNonWickPage(URL);
        }

        var app = app_source.cloneNode(true);
        var dom_app = document.getElementsByTagName("app")[0];

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
                let equivilant_element_main_dom = ele;

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
                }

                let WickElement;

                if (page.type !== "modal") {
                    //This is a way to make sure that Wick is completely in control of the <element>.
                    let element  = document.createElement("div");
                    element.innerHTML = ele.innerHTML;
                    element.classList.add("ele_wrap");

                    WickElement = new Element(equivilant_element_main_dom, element);

                    if (document == DOM) {
                        /* If the DOM is the page we're working on, then clear out it's contents, which may contain <no-script> tags for fallback purposes.*/
                        equivilant_element_main_dom.innerHTML = "";
                    }
                } else {

                    let element  = document.createElement("div");
                    element.innerHTML = ele.innerHTML;
                    element.classList.add("ele_wrap");

                    WickElement = new Element(equivilant_element_main_dom, element);
                }



                page.elements.push(WickElement);

                WickElement.setComponents(this.components, this.models_constructors,this.component_constructors, this.presets, DOM);
            }

            this.pages[URL] = (page.type == "modal") ? new Modal(URL, page, app) : page;
        }
    }

}

export {
    Linker,
    Component
}
