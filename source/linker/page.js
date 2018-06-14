/*
	Handles the parsing and loading of components for a particular page.
*/
class PageView {

    constructor(URL, app_page) {
        this.url = URL;
        this.elements = [];
        this.finalizing_view = null;
        this.type = "normal";
        if(!app_page) debugger
        this.element = app_page;
    }

    destructor(){
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.destructor();
        }

        this.elements = null;
        this.element = null;
    }

    transitionIn(app_element, OldView, query, IS_SAME_PAGE, transitions) {
        let final_time = 0;

        if(!IS_SAME_PAGE)
            app_element.appendChild(this.element);

        if(this.type == "modal")
            setTimeout(()=>{
                this.element.style.opacity = 1;
            }, 50)
        

        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            if (OldView && OldView[element.id]) {
                final_time = Math.max(element.transitionIn(OldView[element.id], query[element.id] ? query[element.id] : query, IS_SAME_PAGE), final_time);
            } else {
                element.transitionIn(null, query, IS_SAME_PAGE, transitions);
            }
        }

        var t = this.element.style.opacity;

        console.log(t);

        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.setTransformTo(transitions);
        }

    }

    finalize() {
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.finalize();
        }
        
        if(this.element.parentElement)
            this.element.parentElement.removeChild(this.element);
    }

    transitionOut(transitions) {
        let time = 0;

        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.getTransformTo(transitions);
        }

        for (var i = 0; i < this.elements.length; i++) {
            time = Math.max(time,this.elements[i].transitionOut(transitions));
        }

        if(this.type == "modal")
            this.element.style.opacity = 0;

        return time;
    }

    getNamedElements(named_elements){
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.getNamedElements(named_elements);
        }
    }

    compareComponents() {
        //This will transition objects
    }

    setType(type){
        this.type = type || "normal";
    }
}

export {
    PageView
}
