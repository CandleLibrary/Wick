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
        if (!app_page) debugger
        this.ele = app_page;
        this.ele_backer = null;
        this.LOADED = false;
    }

    destroy() {

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.destroy();
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

    transitionOut(transitions) {

        let time = 0;

        for (var i = 0; i < this.eles.length; i++) 
            time = Math.max(time, this.eles[i].transitionOut(transitions));
        

        return time;
    }

    finalize() {

        if(this.LOADED) return;

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.finalize();
        }

        if (this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);
    }

    load(app_element, wurl) {

        this.LOADED = true;
        
        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.loadComponents(wurl);
        }

        app_element.appendChild(this.ele);

        var t = this.ele.style.opacity;
    }

    transitionIn(transitions) {

        let final_time = 0;

        if (this.type == "modal") {
            if (!this.ele_backer) {
                this.ele_backer = document.createElement("div");
                this.ele_backer.classList.add("modal_backer")
                this.ele.appendChild(this.ele_backer)
            }
            setTimeout(() => {
                this.ele.style.opacity = 1;
            }, 50)
        }

        for (var i = 0; i < this.eles.length; i++) {
            let element = this.eles[i];
            element.parent = this;
            //element.setTransformTo(transitions);
            element.transitionIn();
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
    }
}