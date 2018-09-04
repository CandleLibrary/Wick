/**
 * Page visualization of the data that model contains.
 *
 * @class      PageView (name)
 */
export class PageView {

    constructor(URL, app_page) {

        this.url = URL;
        this.eles = [];
        this.finalizing_view = null;
        this.type = "normal";
        this.ele = app_page;
        this.ele_backer = null;
        this.LOADED = false;
    }

    _destroy_() {

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element._destroy_();
        }

        this.eles = null;
        this.ele = null;
    }

    unload(transitions) {

        this.LOADED = false;

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.getTransformTo(transitions);
            element.unloadComponents();
        }
    }

    load(app_element, wurl) {

        this.LOADED = true;

        app_element.appendChild(this.ele);

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.loadComponents(wurl);
        }
    }

    finalize() {

        if (this.LOADED) return;

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.finalize();
        }

        if (this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);
    }

    transitionOut(transitions) {

        let time = 0;

        for (var i = 0; i < this.eles.length; i++)
            time = Math.max(time, this.eles[i].transitionOut(transitions));


        return time;
    }

    transitionIn(transitions) {

        if (this.type == "modal") {
            setTimeout(() => {
                this.ele.style.opacity = 1;
            }, 50);
        }

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.parent = this;
            element.transitionIn(transitions);
        }
    }

    getNamedElements(named_elements) {

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.getNamedElements(named_elements);
        }
    }

    compareComponents() {
        //This will transition objects
    }

    setType(type) {
        this.type = type || "normal";

        if (type == "modal") {
            if (!this.ele_backer) {
                this.ele_backer = document.createElement("div");
                this.ele_backer.classList.add("modal_backer");
                this.ele.insertBefore(this.ele_backer, this.ele.firstChild);

                this.ele_backer.addEventListener("click", (e) => {
                    if (e.target == this.ele_backer) {
                        wick.router.closeModal();
                    }
                });
            }
        }
    }
}