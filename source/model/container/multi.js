import { ModelContainerBase } from "./base.js";

export class MultiIndexedContainer extends ModelContainerBase {

    constructor(data = [], root = null, address = []) {

        super(root, address);

        this.secondary_indexes = {};
        this.primary_index = null;
        this.primary_key = "";

        if (data[0] && data[0].key) {

            let key = data[0].key;

            if (data[0].model)
                this.model = data[0].model;

            if (Array.isArray(key))
                key.forEach((k) => (this.addKey(k)));

            data = data.slice(1);
        }

        if (Array.isArray(data) && data.length > 0)
            this.insert(data);
    }

    /**
        Returns the length of the first index in this container. 
    */
    get length() { return this.primary_index.length; }

    /**
        Insert a new ModelContainerBase into the index through the key.  
    */
    addKey(key) {
        let name = key.name;

        let container = new MultiIndexedContainer.array([{ key, model: this.model }]);

        if (this.primary_index) {
            this.secondary_indexes[name] = container;
            this.secondary_indexes[name].insert(this.primary_index.__getAll__());
        } else {
            this.primary_key = name;
            this.primary_index = container;
        }
    }

    get(item, __return_data__) {
        
        item = this.getHook("query", item);

        if (item) {
            for (let name in item) {
                if (name == this.primary_key)
                    return this.primary_index.get(item[name], __return_data__);

                else if (this.secondary_indexes[name])
                    return this.secondary_indexes[name].get(item[name], __return_data__);

            }
        } else
            return this.primary_index.get(null, __return_data__);
    }

    __insert__(model, add_list, identifier) {

        let out = false;

        model.par = this;

        if ((out = this.primary_index.insert(model))) {
            for (let name in this.secondary_indexes) {

                let index = this.secondary_indexes[name];

                index.insert(model);
            }
        }

        if (out)
            this.updateViews(this.primary_index.get());

        return out;
    }
    /**
        @private 
    */
    __remove__(term, out_container) {

        let out = false;

        if ((out = this.primary_index.__remove__(term, out_container))) {

            for (let name in this.secondary_indexes) {

                let index = this.secondary_indexes[name];

                index.__remove__(out_container);
            }
        }

        return out;
    }

    __removeAll__() {

        let out = false;

        out = this.primary_index.__removeAll__();

        for (let name in this.secondary_indexes) {

            let index = this.secondary_indexes[name];

            if (index.__removeAll__())
                out = true;
        }

        return out;
    }


    /**
        Overrides Model container default _gI_ to force item to pass.
        @private 
    */
    _gI_(item, filters = null) {
        return true;
    }

    toJSON() {
        return this.primary_index.toJSON();
    }

    clone() {
        let clone = super.clone();
        clone.secondary_indexes = this.secondary_indexes;
        clone.primary_index = this.primary_index;
        return clone;
    }
}
