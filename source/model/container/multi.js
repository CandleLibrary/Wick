import { ModelContainerBase } from "./base";

export class MultiIndexedContainer extends ModelContainerBase {

    constructor(data = [], root = null, address = []) {

        super(root, address);

        this.indexes = {};
        this.first_index = null;

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
    get length() { return this.first_index.length; }

    /**
        Insert a new ModelContainerBase into the index through the key.  
    */
    addKey(key) {
        let name = key.name;

        let container = new MultiIndexedContainer.array([{ key, model: this.model }]);

        this.indexes[name] = container;
        if (this.first_index) {

            this.indexes[name].insert(this.first_index.__getAll__());
        } else
            this.first_index = this.indexes[name];
    }

    get(item, __return_data__) {

        let out = __return_data__ || new MultiIndexedContainer.array();

        if (item) {
            for (let name in item)
                if (this.indexes[name])
                    this.indexes[name].get(item[name], out);
        } else
            this.first_index.get(null, out);


        return out.proxy;
    }

    remove(item) {

        var out = [];

        for (let a in item)
            if (this.indexes[a])
                out = out.concat(this.indexes[a].remove(item[a]));

        /* Replay items against indexes to insure all items have been removed from all indexes */

        for (var j = 0; j < this.indexes.length; j++)
            for (var i = 0; i < out.length; i++)
                this.indexes[j].remove(out[i]);

        //Update all views
        if (out.length > 0)
            this.updateViewsRemoved(out);

        return out;
    }

    __insert__(model, add_list, identifier) {

        let out = false;

        for (let name in this.indexes) {

            let index = this.indexes[name];

            if (index.insert(model))
                out = true;
            //else
            //    console.warn(`Indexed container ${a} ${index} failed to insert:`, model);
        }

        if (out)
            this.updateViews(this.first_index.get());

        return out;
    }
    /**
        @private 
    */
    __remove__(item) {

        let out = false;

        for (let name in this.indexes) {
            let index = this.indexes[name];
            if (index.remove(item))
                out = true;
        }

        return out;
    }

    __removeAll__() {

        let out = false;

        for (let name in this.indexes) {
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
        return this.first_index.toJSON();
    }

    clone() {
        let clone = super.clone();
        clone.indexes = this.indexes;
        clone.first_index = this.first_index;
        return clone;
    }
}