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

    __remove__(term) {
        if (this.__getIdentifier__(term)) {
            for (var i = 0, l = this.data.length; i < l; i++) {
                var obj = this.data[i];

                if (this.__getIdentifier__(obj) == this.__getIdentifier__(term)) {

                    this.data.splice(i, 1);

                    return [obj];
                }
            }
        }
        return [];
    }

    toJSON() {
        let out_string = "["

        for (var i = 0, l = this.data.length; i < l; i++) {
            out_string += `${JSON.stringify(this.data[i])} ${(i+1 == l)?",":""}`;
        }

        return out_string.slice(-1) + "]";
    }
}

export {
    ArrayModelContainer
}