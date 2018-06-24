class ModelContainer {
    /**
    	The type of object this container holds.
    */
    constructor(schema) {
        this.schema = schema || this.constructor.schema || {};
        this.id = "";
        this.model = schema;

        if (this.schema.identifier && typeof(this.schema.identifier) == "string") {
            this.id = this.schema.identifier;
        } else {
            throw (`Wrong schema identifier type given to ModelContainer. Expected type String, got: ${typeof(this.schema.identifier)}!`, this);
        }
    }

    destructor() {
        this.schema = null;
        this.identifier = null;
    }

    get identifier() {
        return this.id;
    }

    set identifier(a) {

    }

    insert(item) {
        if (item instanceof Array) {
            var out = false;
            for (var i = 0; i < item.length; i++) {

                var model = item[i];

                if (!(model instanceof this.schema.model) && !(model = model.____self____)) {
                    model = new this.schema.model();
                    model.add(item[i]);
                }

                if (this.__insert__(model)) {
                    out = true;
                }
            }
            return out;
        } else {
            var model = item;

            if (!(model instanceof this.schema.model) && !(model = model.____self____)) {
                model = new this.schema.model();
                model.add(item);
            }

            return this.__insert__(model);
        }
    }

    get(item) {
        if (!item) {
            return this.__getAll__();
        } else if (item instanceof Array) {
            var out = [],
                temp = null;
            for (var i = 0; i < item.length; i++)
                if ((temp = this.getAll(item[i])))
                    out.push(temp);


            return out;
        } else {
            return this.__get__(item);
        }
    }

    remove(item) {
        if (!item) {
            return this.__removeAll__();
        }
        if (item instanceof Array) {
            var out = [],
                temp = null;
            for (var i = 0; i < item.length; i++)
                if ((temp = this.removeAll(item[i])))
                    out.push(temp);

            return out;
        } else {
            return this.__remove__(item);
        }
    }

    __insert__(item) {
        return false;
    }

    __get__(item) {
        return [];
    }

    __getAll__() {
        return [];
    }

    __removeAll__() {
        return [];
    }


    __remove__(item) {
        return [];
    }


    addView(view) {}

    checkIdentifier(item) {
        return this.checkRawID(item);
    }

    checkRawID(item) {
        if (item.data && item.schema) {
            return !(!item.data[this.schema.identifier]);
        } else {
            return item !== undefined;
        }
    }

    getIdentifier(item) {
        if (item.data && item.schema) {
            return item.data[this.schema.identifier];
        } else {
            return item;
        }
    }
}

class MultiIndexedContainer extends ModelContainer {
    constructor(schema) {

        super({
            identifier: "indexed",
            model: schema.model
        });

        this.schema = schema;
        this.indexes = {};
        this.first_index = null;

        this.addIndex(schema.index);
    }

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

    get(item) {
        var out = [];

        if (item) {

            for (let a in item) {
                if (this.indexes[a])
                    out = out.concat(this.indexes[a].get(item[a]));
            }
        } else {
            out = this.first_index.get();
        }


        return out;
    }

    remove(item) {
        var out = [];

        for (let a in item) {
            if (this.indexes[a])
                out = out.concat(this.indexes[a].remove(item[a]));
        }

        /* Replay items against indexes to insure all items have been removed from all indexes */

        for (var j = 0; j < this.indexes.length; j++) {
            for (var i = 0; i < out.length; i++) {
                this.indexes[j].remove(out[i]);
            }
        }


        return out;
    }

    __insert__(item) {
        let out = false

        //if(!this.getIdentifier(item)) debugger;
        for (let a in this.indexes) {
            let index = this.indexes[a];
            if (index.insert(item)) out = true;
            else {
                console.warn(`Indexed container ${a} ${index} failed to insert:`, item);
            }
        }
        return out;
    }

    __remove__(item) {
        let out = false;
        for (let a in this.indexes) {
            let index = this.indexes[a];
            if (index.remove(item))
                out = true;
        }
        return out;
    }
}


export {
    ModelContainer,
    MultiIndexedContainer,
};