import {
    Cassette
} from "./cassette"

class ImportQuery extends Cassette {
    constructor(parent, element, d, p) {
        //Scan the element and look for inputs that can be mapped to the 
        super(parent, element, d, p);

        //ImportQuerys in forms are automatically hidden. 

        this.query = this.element.dataset.query;
    }

    update(data) {
        if (data[this.import_prop]) {
            this.element.innerHTML = (data[this.import_prop] != undefined) ? data[this.import_prop] : "";
            if (this.query) {
                if (this.parent.query[this.query] != data[this.import_prop]) {
                    this.parent.query[this.query] = data[this.import_prop];
                    this.parent.request();
                }
            }
        }
    }
}

export {
    ImportQuery
}