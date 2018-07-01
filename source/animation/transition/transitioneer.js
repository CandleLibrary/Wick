class Transitioneer {
    constructor() {

    }

    set(element, data) {
        element.style.transition = "opacity 0.5s";
        element.style.opacity = 0;
    }

    set_in(element, data, index = 0) {
    	element.style.transition = `opacity ${0.8*index+0.5}s`;
        element.style.opacity = 1;
        return 0.8;
    }

    set_out(element, data, index = 0) {
        element.style.opacity = 0;
        return 0.8;
    }

    finalize_out(element) {
    	element.style.opacity = 0;
    }
}
export {
    Transitioneer
}