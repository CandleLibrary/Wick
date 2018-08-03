import { WURL } from "../wurl";

import { PageView } from "../../page/page";

import { Element } from "../../page/element";

const URL_HOST = { wurl: null };

/** @namespace Router */

/**
 * Returns the `<modal>` element from the document DOM, or creates and appends a new one to `<body>`.
 */
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

    return modal_container;
}

/**
 * Responsible for loading pages dynamically, handling the transition of page components, and monitoring and reacting to URL changes
 *
 * @memberof   module:wick~internal
 * @param      {Presets}  presets  A {@link Presets} object.
 * @package
 * @alias Router
 */
export class Router {

    /**
     * Constructs the object.
     *
     */
    constructor(presets) {

        presets.router = this;

        this.pages = {};
        this.elements = {};
        this.component_constructors = presets.custom_sources;
        this.models_constructors = presets.schemas;
        this._presets_ = presets;
        this.current_url = null;
        this.current_query = null;
        this.current_view = null;
        this.finalizing_pages = [];

        /* */
        this.modal_stack = [];

        window.onpopstate = () => {
            this.parseURL(document.location);
        };
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

        if (this.armed) {

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
    * Loads pages from server, or from local cache, and sends it to the page parser.
    * @param {String} url - The URL id of the cached page to load.
    * @param {String} query -
    * @param {Bool} IS_SAME_PAGE -
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

                page.transitionIn();

                return;
            }

            let UNWIND = 0;

            for (var i = 0, l = this.modal_stack.length; i < l; i++) {

                let modal = this.modal_stack[i];

                if (UNWIND == 0) {

                    if (modal == page)
                        UNWIND = i + 1;

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

                if ((trs = modal.transitionOut())) {
                    transition_length = Math.max(trs, transition_length);
                    this.finalizing_pages.push(modal);
                } else
                    modal.finalize();

            }

            this.modal_stack.length = 0;

            if (this.current_view && this.current_view != page) {

                this.current_view.unload(transition_elements);

                page.load(app_ele, wurl);

                let t = this.current_view.transitionOut();

                window.requestAnimationFrame(() => {
                    page.transitionIn(transition_elements);
                });

                transition_length = Math.max(t, transition_length);

                this.finalizing_pages.push(this.current_view);
            } else if (!this.current_view) {

                page.load(app_ele, wurl);

                window.requestAnimationFrame(() => {
                    page.transitionIn(transition_elements);
                });
            }

            this.current_view = page;
        }

        setTimeout(() => {
            this.finalizePages();
        }, (transition_length * 1000) + 1);
    }

    /**
        Pre-loads a custom constructor for an element with the specified id and provides a model to that constructor when it is called.
        The constructor must have Element in its inheritance chain.
    */
    addStatic(element_id, constructor, model) {

        this.component_constructors[element_id] = {
            constructor,
            model_name: model
        };

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
        this.pages[URL] = page;//new Modal(page, iframe, getModalContainer());
        return this.pages[URL];
    }
    /**
        Takes the DOM of another page and strips it, looking for elements to use to integrate into the SPA system.
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

        if (app_list.length > 1)
            console.warn(`Wick is designed to work with just one <app> element in a page. There are ${app_list.length} apps elements in ${url}. Wick will proceed with the first <app> element in the DOM. Unexpected behavior may occur.`)

        let app_source = app_list[0]

        /**
          If there is no <app> element within the DOM, then we must handle this case carefully. This likely indicates a page delivered from the same origin that has not been converted to work with the Wick system.
          The entire contents of the page can be wrapped into a <iframe>, that will be could set as a modal on top of existing pages.
        */
        if (!app_source) {
            console.warn("Page does not have an <app> element!");
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
                    element;


                let element_id = ele.id;

                if (page.type !== "modal") {

                    element = new Element(ele);

                } else {

                    let new_ele = document.createElement("div");

                    new_ele.innerHTML = ele.innerHTML;

                    new_ele.classList.add("ele_wrap");

                    element = new Element(ele);
                }

                page.eles.push(element);

                if (!this.elements[element_id])
                    this.elements[element_id] = {};

                element.setComponents(this.elements[element_id], this.models_constructors, this.component_constructors, this._presets_, DOM, wurl);
            }

            if (document == DOM)
                dom_app.innerHTML = "";

            let result = page;

            if (!NO_BUFFER) this.pages[URL] = result;

            return result;
        }
    }
}