import { ModelContainerBase, MCArray } from "./base"

export class MultiIndexedContainer extends ModelContainerBase {

    constructor(schema) {

        super({
            identifier: "indexed",
            model: schema ._model_
        });

        this.schema = schema;
        this.indexes = {};
        this.first_index = null;

        this.addIndex(schema.index);
    }

    /**
        Returns the length of the first index in this container. 
    */
    get length() {
        return this.first_index.length;
    }

    /**
        Insert a new ModelContainerBase into the index through the schema.  
    */
    addIndex(index_schema) {

        for (let name in index_schema) {
            let scheme = index_schema[name];

            if (scheme.container && !this.indexes[name]) {
                this.indexes[name] = new scheme.container(scheme.schema);

                if (this.first_index)
                    this.indexes[name].insert(this.first_index.__getAll__());
                else
                    this.first_index = this.indexes[name];
            }
        }
    }

    get(item, __return_data__) {

        let out = {};

        if (item) {
            for (let name in item)
                if (this.indexes[name])
                    out[name] = this.indexes[name].get(item[name], __return_data__);
        } else

            out = this.first_index.get(null);


        return out;
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

        let out = false

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
        return "[]";
    }
}