/*
	Handles the parsing and loading of components for a particular page.
*/
class PageView {

    constructor(URL) {
        this.url = URL;
        this.elements = [];
        this.finalizing_view = null;
        this.type = "normal";
    }

    destructor(){
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.destructor();
        }

        this.elements = null;
    }

    transitionIn(OldView, query, IS_SAME_PAGE, transition_elements) {
        let final_time = 0;

        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            if (OldView && OldView[element.id]) {
                final_time = Math.max(element.transitionIn(OldView[element.id], query[element.id] ? query[element.id] : query, IS_SAME_PAGE), final_time);
            } else {
                element.transitionIn(null, query, IS_SAME_PAGE, transition_elements);
            }
        }
    }

    finalize() {
        for (var i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.finalize();
        }
    }

    transitionOut() {
        let time = 0;

        for (var i = 0; i < this.elements.length; i++) {
            time = Math.max(time,this.elements[i].transitionOut());
        }

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
