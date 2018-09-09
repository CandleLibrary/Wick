import { WURL } from "./wurl";

import { PageView } from "../page/page";

import { Element } from "../page/element";

import { Transitioneer } from "../animation/transitioneer";

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
            dom_app.appendChild(modal_container, dom_app);
        else
            document.body.appendChild(modal_container);

        modal_container.addEventListener("click", (e) => {
            if (e.target == modal_container) {
                wick.router.closeModal();
            }
        });
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

        presets.processLink = (temp, source) => {
            if (!temp.onclick) temp.onclick = (e) => {
                let link = e.currentTarget;
                if (link.origin !== location.origin) return;
                e.preventDefault();
                history.pushState({}, "ignored title", link.href);
                window.onpopstate();
            };
        };

        /* */
        this.modal_stack = [];

        window.onpopstate = () => {
            this.parseURL(document.location);
        };
    }



    finalizePages(pages = this.finalizing_pages) {

        if (this.armed) {

            let a = this.armed;
            //  a.p.transitionIn(a.e, this.current_view, a.wurl, a.SP, a.te);
            this.armed = null;
        }

        for (var i = 0, l = pages.length; i < l; i++) {

            var page = pages[i];

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
    loadPage(page, wurl = new WURL(document.location.href), IS_SAME_PAGE = false) {

        URL_HOST.wurl = wurl;

        let transition = Transitioneer.createTransition();

        let app_ele = document.getElementsByTagName("app")[0];

        let transition_elements = {};

        let finalizing_pages = [];

        if (page.type == "modal") {

            //trace modal stack and see if the modal already exists
            if (IS_SAME_PAGE) {

                //page.transitionIn();

                return;
            }

            let UNWIND = 0;

            for (var i = 0, l = this.modal_stack.length; i < l; i++) {

                let modal = this.modal_stack[i];

                if (UNWIND == 0) {

                    if (modal == page)
                        UNWIND = i + 1;

                } else {
                    modal.unload();
                    finalizing_pages.push(modal);
                    modal.transitionOut(transition.out);
                }
            }

            if (UNWIND > 0) {
                this.modal_stack.length = UNWIND;
                page.mount(getModalContainer(), wurl);
                page.transitionIn(transition.in);
            } else {
                //create new modal
                this.modal_stack.push(page);
                page.mount(getModalContainer(), wurl);
                page.transitionIn(transition.in);
            }

        } else {

            for (var i = 0, l = this.modal_stack.length; i < l; i++) {

                let modal = this.modal_stack[i];

                modal.unload();

                modal.transitionOut(transition.out);

                finalizing_pages.push(modal);
            }

            this.modal_stack.length = 0;

            if (this.current_view && this.current_view != page) {

                this.current_view.unload(transition_elements);

                page.mount(app_ele, wurl);

                this.current_view.transitionOut(transition.out);

                finalizing_pages.push(this.current_view);

            } else if (!this.current_view) {

                page.mount(app_ele, wurl);

                this.current_view = page;
            }

            this.current_view = page;
        }


        page.transitionIn(transition.in);

        transition.start().then(() => { this.finalizePages(finalizing_pages); });
    }


    closeModal(data = {}) {
        for (var i = 0, l = this.modal_stack.length; i < l; i++) {
            let modal = this.modal_stack[i];
            if (modal.reply)
                modal.reply(data);
            modal.reply = null;
        }
        this.parseURL(this.current_view.url);
    }

    loadModal(URL, query_data) {
        return new Promise((res) => {
            let wurl = new WURL(URL);
            wurl.setData(query_data);
            this.parseURL(wurl, wurl, res);
        });
    }

    /*
        This function will parse a URL and determine what Page needs to be loaded into the current view.
    */
    parseURL(location, wurl = new WURL(location.href), pending_modal_reply = null) {

        let url = location;

        if (location.pathname)
            url = location.pathname;

        let IS_SAME_PAGE = (this.current_url == url),
            page = null;

        this.current_url = url;

        if ((page = this.pages[url])) {

            page.reply = pending_modal_reply;

            if (IS_SAME_PAGE) {

                URL_HOST.wurl = wurl;

                console.log("missing same page resolution")
                return;
            }

            return this.loadPage(page, wurl, IS_SAME_PAGE);
        }

        if (location)
            fetch(location.href, {
                credentials: "same-origin", // Sends cookies back to server with request
                method: 'GET'
            }).then((response) => {
                (response.text().then((html) => {

                    var DOM = (new DOMParser()).parseFromString(html, "text/html");

                    this.loadNewPage(url, DOM, wurl, pending_modal_reply).then(page =>
                        this.loadPage(page, wurl, IS_SAME_PAGE)
                    );

                }));
            }).catch((error) => {
                console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
            });
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
        this.pages[URL] = page; //new Modal(page, iframe, getModalContainer());
        return this.pages[URL];
    }
    /**
        Takes the DOM of another page and strips it, looking for elements to use to integrate into the SPA system.
        If it is unable to find these elements, then it will pass the DOM to loadNonWickPage to handle wrapping the page body into a wick app element.
    */
    loadNewPage(URL, DOM, wurl = new WURL("", true), pending_modal_reply = null) {

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

        let app_source = app_list[0];

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

            if (app_source.dataset.modal == "true" || pending_modal_reply) {

                page.setType("modal");
                let modal = document.createElement("modal");
                modal.innerHTML = app.innerHTML;
                app.innerHTML = "";
                app = modal;

                page.reply = pending_modal_reply;

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

                element.common_components = this.elements[element_id];
            }

            let promise = page.load(this.models_constructors, this.component_constructors, this._presets_, DOM, wurl);

            if (document == DOM)
                dom_app.innerHTML = "";

            if (!NO_BUFFER) this.pages[URL] = page;

            return promise;
        }
    }
}