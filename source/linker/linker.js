import {
    WURL
} from "./wurl"
import {
    Component,
    CaseComponent
} from "./component"

import {
    PageView
} from "./page"

import {
    Element
} from "./element"

import {
    TurnDataIntoQuery
} from "../common/url/url"

import {
    GLOBAL
} from "../global"

let URL_HOST = {
    wurl: null
};
let URL = (function() {

            return {
                /**
                    Changes the URL to the one provided, prompts page update. overwrites current URL.
                */
                set: function(a, b, c) {
                    if (URL_HOST.wurl)
                        URL_HOST.wurl.set(a, b, c);
                },
                /**
                            Returns a Query entry if it exists in the query string. 
                        */
                get: function(a, b) {
                    if (URL_HOST.wurl)
                        return URL_HOST.wurl.set(a, b);
                    return null;
                },
                /**
                            Changes the URL state to the one provided and prompts the Browser to respond o the change. 
                        */
                goto: function(a, b) {
                        history.pushState({}, "ignored title", `${a}${ ((b) ? `?${TurnDataIntoQuery(b)}` : "") }`);
            window.onpopstate();
        }
    }
})();

function getModalContainer() {
    let modal_container = document.getElementsByTagName("modals")[0];

    if (!modal_container) {

        modal_container = document.createElement("modals");

        var dom_app = document.getElementsByTagName("app")[0];

        if (dom_app)
            dom_app.parentElement.insertBefore(modal_container, dom_app);
        else
            document.body.appendChild(modal_container);
    }

    return modal_container
}

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

        GLOBAL.linker = this;

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

                let a = 0,
                    b = 0,
                    c = 0,
                    d = 0,
                    e = 0;

                if ((a = (component.prototype.transitionIn && component.prototype.transitionIn instanceof Function)) &&
                    (b = (component.prototype.transitionOut && component.prototype.transitionOut instanceof Function)) &&
                    (c = (component.prototype.setModel && component.prototype.setModel instanceof Function)) &&
                    (d = (component.prototype.unsetModel && component.prototype.unsetModel instanceof Function)))
                    this.addStatic(component_name, component);
                else
                    console.warn(`Static component ${component_name} lacks correct component methods, \nHas transitionIn function:${a}\nHas transitionOut functon:${b}\nHas set model function:${c}\nHas unsetModel function:${d}`);
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
            Schemas provide the constructors for models
        */
        if (presets.schemas) {

        } else {
            presets.schemas = {};
        }

        /**
            Modals are the global models that can be accessed by any Case
        */
        if (presets.models) {

        } else {
            presets.models = {};
        }

        /**
          TODO Validate that every schama is a Model constructor
        */

        /* */
        this.modal_stack = [];

        window.onpopstate = () => {
            this.parseURL(document.location)
        }
    }

    /*
        This function will parse a URL and determine what Page needs to be loaded into the current view.
    */
    parseURL(location) {

        let url = location.pathname;

        let IS_SAME_PAGE = (this.current_url == url),
            page = null,
            wurl = new WURL(location);

        this.current_url = url;

        if ((page = this.pages[url])) {
            if (IS_SAME_PAGE) {
                URL_HOST.wurl = wurl;

                return page.transitionIn(
                    (page.type == "modal") ? getModalContainer() : document.getElementsByTagName("app")[0], 
                    null, wurl, IS_SAME_PAGE);
            }
            return this.loadPage(page, wurl, IS_SAME_PAGE);
        }

        if (location)
            fetch(location.href, {
                credentials: "same-origin", // Sends cookies back to server with request
                method: 'GET'
            }).then((response) => {
                (response.text().then((html) => {
                    var DOM = (new DOMParser()).parseFromString(html, "text/html")
                    this.loadPage(
                        this.loadNewPage(url, DOM, wurl),
                        wurl,
                        IS_SAME_PAGE
                    );
                }));
            }).catch((error) => {
                console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
            })
    }

    finalizePages() {

        if(this.armed){
            let a = this.armed;
          //  a.p.transitionIn(a.e, this.current_view, a.wurl, a.SP, a.te);
            this.armed = null;
        }
        
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
    loadPage(page, wurl = new WURL(document.location), IS_SAME_PAGE) {


        URL_HOST.wurl = wurl;

        let transition_length = 0;

        let app_ele = document.getElementsByTagName("app")[0];

        //Finalize any existing page transitions;
        // this.finalizePages();

        let transition_elements = {};

        if (page.type == "modal") {
            
            //trace modal stack and see if the modal already exists
            if (IS_SAME_PAGE) {
                page.transitionIn()
                return;
            }

            let UNWIND = 0;

            for (var i = 0, l = this.modal_stack.length; i < l; i++) {
                let modal = this.modal_stack[i];

                if (UNWIND == 0) {
                    if (modal == page) {
                        UNWIND = i + 1;
                    }
                } else {
                    let trs = 0;
                    modal.unload();

                    if (trs = modal.transitionOut()) {
                        transition_length = Math.max(trs, transition_length);
                        this.finalizing_pages.push(modal);
                    } else 
                        modal.finalize();
                }
            }

            if (UNWIND > 0) {
                this.modal_stack.length = UNWIND;
                page.load(getModalContainer(), wurl);
                page.transitionIn();
            } else {
                //create new modal
                this.modal_stack.push(page);
                page.load(getModalContainer(), wurl);
                page.transitionIn();
            }

        } else {

            for (var i = 0, l = this.modal_stack.length; i < l; i++) {
                let modal = this.modal_stack[i];
                let trs = 0;
                
                modal.unload();

                if (trs = modal.transitionOut()) {
                    transition_length = Math.max(trs, transition_length);
                    this.finalizing_pages.push(modal);
                } else 
                    modal.finalize();
                
            }

            this.modal_stack.length = 0;

            let trs = 0;


            if (this.current_view && this.current_view != page) {
                this.current_view.unload(transition_elements);
                
                page.load(app_ele, wurl);
               
                let t = this.current_view.transitionOut();
                
                window.requestAnimationFrame(()=>{
                    page.transitionIn(transition_elements)
                })

                transition_length = Math.max(t, transition_length);
                
                this.finalizing_pages.push(this.current_view);
            } else if(!this.current_view){
                page.load(app_ele, wurl);

                window.requestAnimationFrame(()=>{
                    page.transitionIn(transition_elements)
                })
            }

            this.current_view = page;
        }

        setTimeout(() => {
            this.finalizePages();
        }, (transition_length*1000) + 1);
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
        this.models_constructors[model_name] = modelConstructor;
    }
    /**
        Creates a new iframe object that acts as a modal that will sit ontop of everything else.
    */
    loadNonWickPage(URL) {
        let iframe = document.createElement("iframe");
        iframe.src = URL;
        iframe.classList.add("modal", "comp_wrap");
        var page = new PageView(URL, iframe);
        page.type = "modal";
        this.pages[URL] = page //new Modal(page, iframe, getModalContainer());
        return this.pages[URL];
    }
    /**
        Takes the DOM of another page and strips it, looking for component and app elements to use to integrate into the SPA system.
        If it is unable to find these elements, then it will pass the DOM to loadNonWickPage to handle wrapping the page body into a wick app element.
    */
    loadNewPage(URL, DOM, wurl) {
        //look for the app section.

        /**
            If the page should not be reused, as in cases where the server does all the rendering for a dynamic page and we're just presenting the results,
            then having NO_BUFFER set to true will cause the linker to not save the page to the hashtable of existing pages, forcing a request to the server every time the page is visited.
        */
        let NO_BUFFER = false;


        /* 
            App elements: There should only be one. 
        */
        let app_list = DOM.getElementsByTagName("app");

        if (app_list.length > 1) {
            console.warn(`Wick is designed to work with just one <app> element in a page. There are ${app_list.length} apps elements in ${url}. Wick will proceed with the first <app> element in the DOM. Unexpected behavior may occur.`)
        }

        let app_source = app_list[0]

        /**
          If there is no <app> element within the DOM, then we must handle this case carefully. This likely indicates a page delivered from the same origin that has not been converted to work with the Wick system.
          The entire contents of the page can be wrapped into a <iframe>, that will be could set as a modal on top of existing pages.
        */
        if (!app_source) {
            console.trace("Page does not have an <app> element!");
            return this.loadNonWickPage(URL);
        }

        var app_page = document.createElement("apppage");
        app_page.innerHTML = app_source.innerHTML;

        var app = app_source.cloneNode(true);


        var dom_app = document.getElementsByTagName("app")[0];

        var page = new PageView(URL, app_page);
        if (app_source) {

            if (app_source.dataset.modal == "true") {
                page.setType("modal");
                let modal = document.createElement("modal");
                modal.innerHTML = app.innerHTML;
                app.innerHTML = "";
                app = modal;

                /*
                    If the DOM is the same element as the actual document, then we shall rebuild the existing <app> element, clearing it of it's contents.
                */
                if (DOM == document && dom_app) {
                    let new_app = document.createElement("app");
                    document.body.replaceChild(new_app, dom_app);
                    dom_app = new_app;
                }
            }

            if (app.dataset.no_buffer == "true")
                NO_BUFFER = true;

            var elements = app_page.getElementsByTagName("element");

            for (var i = 0; i < elements.length; i++) {

                let ele = elements[i],
                    equivilant_element_from_main_dom = ele,
                    wick_element;


                let element_id = ele.id;

                if (page.type !== "modal") {

                    wick_element = new Element(ele);

                } else {
                    let element = document.createElement("div");
                    element.innerHTML = ele.innerHTML;
                    element.classList.add("ele_wrap");

                    wick_element = new Element(ele);
                }

                page.elements.push(wick_element);

                if (!this.components[element_id])
                    this.components[element_id] = {};

                wick_element.setComponents(this.components[element_id], this.models_constructors, this.component_constructors, this.presets, DOM, wurl);
            }

            if (document == DOM)
                dom_app.innerHTML = "";

            let result = page;

            if (!NO_BUFFER) this.pages[URL] = result;

            return result;

        }
    }
}

export {
    Linker,
    Component,
    URL
}