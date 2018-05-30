/**
    An area to hold data and UI components. 
*/
class Element {
    constructor(element, component) {
        this.id =  (element.classList) ? element.classList[0] : element.id;
        this.component = component;
        this.element = element;
    }

    transitionOut() {
        if (this.component.transitionOut) {
            var t = this.component.transitionOut();
            this.element.removeChild(this.component.element);
            this.component.LOADED = false;
            return;
        }
        return {};
    }

    transitionIn(transition_elements, query, IS_SAME_PAGE) {
        if (this.component && !this.component.LOADED) {
            var element = this.component.element;
            if (!element.parentElement) this.element.appendChild(element);
            this.component.transitionIn(transition_elements, query, IS_SAME_PAGE);
        }
    }
}

export {
    Element
}