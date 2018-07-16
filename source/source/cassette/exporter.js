import {
    Cassette
} from "./cassette"

class Exporter extends Cassette {
    constructor(parent, element, d, p) {
        //Scan the element and look for inputs that can be mapped to the 
        super(parent, element, d, p);

        if (element.tagName == "A") {
            element.addEventListener("click", () => {
                this.event()
            })
        }
    }

    event() {
        this.parent.export();
    }

    destroy() {
        this.ele.removeEventListener("click", this.event)
        super.destroy();
    }
}

export {
    Exporter
}