import {
    Cassette
} from "./cassette"

class Filter extends Cassette {
	
    constructor(parent, element, d, p) {

        super(parent, element, d, p);

        parent.filter_list.push((data) => this.filter(data));

        this.ele.addEventListener("input", () => {
            this.parent.update();
        })
    }

    update(data) {
        //apply a filter object to the parent
        return false;
    }

    filter(data) {
        return false;
    }
}

export {
    Filter
}