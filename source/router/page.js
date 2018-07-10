/*
	Handles the parsing and loading of components for a particular page.
*/
class PageView {

    constructor(URL, app_page) {
        this.url = URL;
        this.elements = [];
        this.finalizing_view = null;
        this.type = "normal";
        if (!app_page) debugger
        this.element = app_page;
        this.element_backer = null;
        this.LOADED = false;
    }

    destructor() {
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.destructor();
        }

        this.elements = null;
        this.element = null;
    }

    unload(transitions) {

        this.LOADED = false;
        
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.getTransformTo(transitions);
            element.unloadComponents();
        }
    }

    transitionOut(transitions) {

        let time = 0;

        for (var i = 0; i < this.elements.length; i++) {
            time = Math.max(time, this.elements[i].transitionOut(transitions));
        }

        return time;
    }

    finalize() {
        if(this.LOADED) return;

        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.finalize();
        }

        if (this.element.parentElement)
            this.element.parentElement.removeChild(this.element);
    }

    load(app_element, wurl) {

        this.LOADED = true;
        
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.loadComponents(wurl);
        }

        app_element.appendChild(this.element);

        var t = this.element.style.opacity;
    }

    transitionIn(transitions) {
        let final_time = 0;

        if (this.type == "modal") {
            if (!this.element_backer) {
                this.element_backer = document.createElement("div");
                this.element_backer.classList.add("modal_backer")
                this.element.appendChild(this.element_backer)
            }
            setTimeout(() => {
                this.element.style.opacity = 1;
            }, 50)
        }

        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.parent = this;
            element.setTransformTo(transitions);
            element.transitionIn();
        }        
    }

    getNamedElements(named_elements) {
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.getNamedElements(named_elements);
        }
    }

    compareComponents() {
        //This will transition objects
    }

    setType(type) {
        this.type = type || "normal";
    }
}

export {
    PageView
}