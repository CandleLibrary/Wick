/**
	Handles pages that appear on-top of other pages; ones that do not represent a change of the page location.
*/
class Modal {

    constructor(page, element, parent_element) {
        this.page = page;
        this.element = element;
        this.element.classList.add("modal");
        this.parent_element = parent_element;

        var backer = document.createElement("div")
        backer.classList.add("modal_backer");

        this.element.appendChild(backer);

        this.history_depth = 0;

        backer.addEventListener("click",()=>{
            window.history.go(-this.history_depth);
        })

        this.element.style.opacity = 0;
    }

    destructor(){
        this.page.destructor();
        this.element = null;
        this.backer = null;
    }

    transitionIn(OldView, query, IS_SAME_PAGE) {
        this.history_depth++;

        if(!IS_SAME_PAGE){
            this.parent_element.appendChild(this.element);
            var t = this.element.style.opacity;
            setTimeout(()=>{
                this.element.style.opacity = 1;
            }, 50)
        }

        this.page.transitionIn(OldView, query, IS_SAME_PAGE);
    }

    finalize() {
        this.page.finalize();
        this.parent_element.removeChild(this.element)
    }

    transitionOut() {
        this.page.transitionOut();
        this.element.style.opacity = 0;
        this.history_depth = 0;
        return 250;
    }

    compareComponents() {
        //This will transition objects
        this.page.compareComponents();
    }

    setPageType(type){
    }
}

Modal.create = function(){
    console.warn("Modal.create function not emplemented at this point. ")
}

export {
    Modal
}
