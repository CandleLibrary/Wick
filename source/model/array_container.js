import {
    ModelContainer,
    MCArray
} from "./model_container"


/**
 */
class ArrayModelContainer extends ModelContainer {

    constructor(schema) {
        super(schema);
        this.data = [];
    }

    destructor() {

        this.data = null;

        super.destructor();
    }

    get length() {
        return this.data.length;
    }

    __defaultReturn__() {
        if (this.source) return new MCArray;

        let n = new ArrayModelContainer(this.schema);

        this.__link__(n);

        return n;
    }

    __insert__(model, add_list, identifier) {

        for (var i = 0, l = this.data.length; i < l; i++) {

            var obj = this.data[i];

            if (this.__getIdentifier__(obj) == identifier) {

                obj.add(model);

                return false; //Model not added to Container. Model just updated.
            }
        }

        this.data.push(model);

        if (add_list) add_list.push(model);

        return true; // Model added to Container.
    }

    __get__(term, return_data) {

        let terms = null;

        if (term)
            if (term instanceof Array) {
                terms = term;
            } else
                terms = [term];



        for (let i = 0, l = this.data.length; i < l; i++) {
            let obj = this.data[i];
            if (this.__getIdentifier__(obj, terms)) {
                return_data.push(obj);
            }
        }

        return return_data;
    }

    __getAll__(return_data) {

        this.data.forEach((m) => {
            return_data.push(m)
        })

        return return_data;
    }

    __removeAll__() {
        let items = this.data.map(d => d) || [];

        this.data.length = 0;

        return items;
    }

    __remove__(term, out_container) {
        let result = false;
        for (var i = 0, l = this.data.length; i < l; i++) {
            var obj = this.data[i];

            if (this.__getIdentifier__(obj, term)) {

                result = true;

                this.data.splice(i, 1);

                l--;
                i--;

                out_container.push(obj);
            }
        }

        return result;
    }

    toJSON() {

        return this.data;
    }
}

export {
    ArrayModelContainer
}