import {
    Cassette
} from "./cassette"

class Filter extends Cassette {
	
    constructor(parent, element, d, p) {
        super(parent, element, d, p);

        parent.filter_list.push((data) => this.filter(data));

        this.element.addEventListener("input", () => {
            this.parent.update();
        })
    }

    update(data) {
        //apply a filter object to the parent
    }

    filter(data) {
        return false;
    }
}

export {
    Filter
}