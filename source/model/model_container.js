import {
    ModelBase,
} from "./model_base.js"

class MCArray extends Array {
    constructor() {
        super();
    }

    push(item) {
        if (item instanceof Array)
            item.forEach((i) => {
                this.push(i)
            })
        else
            super.push(item);
    }

    setBounds() {

    }
}

let EmptyFunction = ()=>{};

class ModelContainer extends ModelBase {
    /**
    	The type of object this container holds.
    */
    constructor(schema) {

        super();

        //For Linking to original 
        this.source = null;
        this.first_link = null;
        this.next = null;
        this.prev = null;

        this.pin = EmptyFunction;

        this.schema = schema || this.constructor.schema || {};
        this.id = "";
        if (this.schema.identifier && typeof(this.schema.identifier) == "string") {
            this.id = this.schema.identifier;
        } else {
            // throw (`Wrong schema identifier type given to ModelContainer. Expected type String, got: ${typeof(this.schema.identifier)}!`, this);
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

    defaultReturn(params) {
        return new MCArray;
    }

    push(item) {
        return this.insert(item);
    }

    get(item, return_data, UNWRAPPED = false){
        
        if(item === null)
            UNWRAPPED = true;

        let out = null;

        if (item)

            if (return_data) {
                out = return_data;
            } else {
                out = this.defaultReturn(item);
                out.setBounds(item);
            }
        else
            out = [];

        if (!item)
            this.__getAll__(out, UNWRAPPED);
        else if (item instanceof Array) {
            for (var i = 0; i < item.length; i++)
                this.get(item[i], out, UNWRAPPED)
        } else
            this.__get__(item, out, UNWRAPPED);


        return out
    }

    /**
        Inserts an item into the container. 
    */
    insert(item, FROM_SOURCE = false) {

        let add_list = (this.first_view) ? [] : null;

        let out = false;

        if (!FROM_SOURCE && this.source)
            return this.source.insert(item);

        this.__links__insert__(item);

        if (item instanceof Array) {


            for (var i = 0; i < item.length; i++) {

                var model = item[i];

                if (!(model instanceof this.schema.model) && !(model = model.____self____)) {
                    model = new this.schema.model();
                    model.add(item[i]);
                }

                if (this.__insert__(model, add_list)) {
                    out = true;
                }
            }
            return out;
        } else {
            var model = item;

            if (!(model instanceof this.schema.model) && !(item = model.____self____)) {
                model = new this.schema.model();
                model.add(item);
            }

            out = this.__insert__(item, add_list);
        }

        if(add_list.length > 0)
        this.updateViewsAdded(add_list);

        return out;
    }
    /**
        Removes an item from the container. 
    */
    remove(item, FROM_SOURCE = false) {

        if (!FROM_SOURCE && this.source)
            return this.source.remove(item);

        let out = [];

        if (!item)
            out = this.__removeAll__();
        else if (item instanceof Array) {
            let temp = null;
            for (let i = 0; i < item.length; i++)
                if ((temp = this.removeAll(item[i])))
                    out.push(temp);
        } else {
            let out = this.__remove__(item);
        }

        this.__links__remove__(item);


        return out;

    }
    __unlink__(container) {
        if (container instanceof ModelContainer && container.source == this) {

            if (container == this.first_link)
                this.first_link = container.next;

            if (container.next)
                container.next.prev = container.prev;

            if (container.prev)
                container.prev.next = container.next;

            container.source = null;
        }
    }

    __link__(container) {
        if (container instanceof ModelContainer && !container.source) {

            container.source = this;

            container.next = this.first_link;

            if (this.first_link)
                this.first_link.prev = container;

            this.first_link = container;

            container.pin = ((container) => {
                let id = setTimeout(() => {
                    container.__unlink__();
                }, 50)

                return () => {
                    clearTimeout(id);
                    if (!container.source)
                        console.warn("failed to clear the destruction of container in time!");
                }
            })(container)
        }
    }
    __links__remove__(item) {
        let a = this.first_link;
        while (a) {
            a.remove(item, true);
            a = a.next;
        }
    }
    __links__insert__(item) {
        let a = this.first_link;
        while (a) {
            a.insert(item, true);
            a = a.next;
        }
    }

    __insert__(item, add_list) {
        return false;
    }

    __get__(item, return_data, UNWRAPPED = false) {
        return return_data;
    }

    __getAll__(return_data, UNWRAPPED = false) {
        return return_data;
    }

    cull(items) {
        let hash_table = {};
        let existing_items = __getAll__([], true);

        let loadHash = (item) => {
            if (item instanceof Array)
                return item.forEach((e) => loadHash(e));

            let identifier = this.getIdentifier(item);

            if (identifier) {
                hash_table[identifier] = item;
            }
        }

        loadHash(items);

        for (let i = 0; i < existing_items.lenth; i++) {
            let e_item = existing_items[i];
            if (!existing_items[this.getIdentifier(e_item)])
                this.__remove__(e_item);
        }

        this.insert(items);
    }

    __removeAll__() {
        return [];
    }


    __remove__(item) {
        return [];
    }

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
            return item[this.schema.identifier] || item;
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
        let out

        let add_list = (this.first_view) ? [] : null;;

        if (item) {

            for (let a in item) {
                let out = {};

                if (this.indexes[a]) {
                    out[a] = this.indexes[a].get(item[a]);
                }
            }
        } else {
            out = this.first_index.get();
        }

        this.updateViews(this.first_index.get());


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

        //Update all views
        if(out.length > 0)
            this.updateViewsRemoved(out);

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
    array_container
};