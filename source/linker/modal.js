/**
	Handles pages that appear ontop of other pages, and do not represent a change of the view.
*/
class Modal {

    constructor(page, element) {
        this.page = page;
        this.element = element;
        this.element.classList.add("modal");

        var backer = document.createElement("div")
        backer.classList.add("modal_backer");

        this.element.appendChild(backer);

        this.history_depth = 0;

        backer.addEventListener("click",()=>{
            window.history.go(-this.history_depth);
        })

        this.element.style.opacity = 0;
    }

    transitionIn(OldView, query, IS_SAME_PAGE) {
        this.history_depth++;

        if(!IS_SAME_PAGE){
            document.body.appendChild(this.element);
            var t = this.element.style.opacity;
            setTimeout(()=>{
                this.element.style.opacity = 1;
            }, 50)
        }

        this.page.transitionIn(OldView, query, IS_SAME_PAGE);
    }

    finalize() {
        this.page.finalize();
        document.body.removeChild(this.element)
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

export {
    Modal
}
