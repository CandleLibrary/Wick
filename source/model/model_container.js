import {
    ModelBase,
} from "./model_base.js"

import {
    SchemaType
} from "../schema/schema_type"

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

    //For compatibility
    __setFilters__() {

    }
    getChanged(){

    }

    toJSON(){
        return this;
    }

    toJson() {
        return JSON.stringify(this,null, '\t');
    }
}

// A "null" function
let EmptyFunction = () => {};
let EmptyArray = [];



class ModelContainer extends ModelBase {

    constructor(schema) {

        super();

        //For Linking to original 
        this.source = null;
        this.first_link = null;
        this.next = null;
        this.prev = null;

        //For keeping the container from automatic deletion.
        this.pin = EmptyFunction;

        //Filters are a series of strings or number selectors used to determine if a model should be inserted into or retrieved from the container.
        this.__filters__ = EmptyArray;

        this.schema = schema || this.constructor.schema || {};

        //The parser will handle the evaluation of identifiers according to the criteria set by the __filters__ list. 

        if (this.schema.parser && this.schema.parser instanceof SchemaType) {
            this.parser = this.schema.parser
        } else {
            this.parser = new SchemaType();
        }

        this.id = "";

        if (this.schema.identifier && typeof(this.schema.identifier) == "string") {
            this.id = this.schema.identifier;
        } else {
            // throw (`Wrong schema identifier type given to ModelContainer. Expected type String, got: ${typeof(this.schema.identifier)}!`, this);
        }
        return this
        return new Proxy(this, {
            get: (obj, prop, val) => (prop in obj) ? obj[prop] : obj.get(val)
        })
    }

    destructor() {
        this.schema = null;

        this.__filters__ = null;

        if (this.source) {
            this.source.__unlink__(this);
        }

        super.destructor();
    }

    /**
        Get the number of Models held in this ModelContainer

        @returns {Number}
    */
    get length() {
        return 0;
    }

    set length(e) {
        //NULL function. Do Not Override!
    }

    /** 
        Returns a ModelContainer type to store the results of a get().
    */
    __defaultReturn__(USE_ARRAY) {
        if (USE_ARRAY) return new MCArray;

        let n = new this.constructor(this.schema);

        this.__link__(n);

        return n;
    }

    /**
        Array emulating kludge

        @returns The result of calling this.insert
    */
    push(item) {
        return this.insert(item, true);
    }

    /**
        Retrieves a list of items that match the term/terms. 

        @param {(Array|SearchTerm)} term - A single term or a set of terms to look for in the ModelContainer. 
        @param {Array} __return_data__ - Set to true by a source Container if it is calling a SubContainer insert function. 

        @returns {(ModelContainer|Array)} Returns a Model container or an Array of Models matching the search terms. 
    */
    get(term, __return_data__) {

        let out = null;

        let USE_ARRAY = true;

        if (term)
            if (__return_data__) {
                out = __return_data__;
            } else {

                if (__return_data__ === null)
                    USE_ARRAY = false;

                if (!this.source)
                    USE_ARRAY = false;

                out = this.__defaultReturn__(USE_ARRAY);
                out.__setFilters__(term);
            }
        else
            out = this.__defaultReturn__(USE_ARRAY);

        if (!term)
            this.__getAll__(out);
        else {

            let terms = term;

            if (!term instanceof Array)
                terms = [term];


            this.__get__(terms, out);
        }

        return out
    }

    /**
        Inserts an item into the container. If the item is not a {Model}, an attempt will be made to convert the data in the Object into a Model.
        If the item is an array of objects, each object in the array will be considered separately. 

        @param {Object} item - An Object to insert into the container. On of the properties of the object MUST have the same name as the ModelContainer's 
        @param {Array} item - An array of Objects to insert into the container.
        @param {Boolean} __FROM_SOURCE__ - Set to true by a source Container if it is calling a SubContainer insert function. 

        @returns {Boolean} Returns true if an insertion into the ModelContainer occurred, false otherwise.
    */
    insert(item, __FROM_SOURCE__ = false) {

        let add_list = (this.first_view) ? [] : null;

        let out = false;

        if (!__FROM_SOURCE__ && this.source)
            return this.source.insert(item);

        if (item instanceof Array) {
            for (var i = 0; i < item.length; i++)
                if (this.__insertSub__(item[i], out, add_list))
                    out = true;
        } else if (item)
            out = this.__insertSub__(item, out, add_list);


        if (add_list && add_list.length > 0)
            this.updateViewsAdded(add_list);

        return out;
    }

    /**
        A subset of the insert function. Handles the test of identifier, the conversion of an Object into a Model, and the calling of the internal __insert__ function.
    */
    __insertSub__(item, out, add_list) {

        let model = item;

        var identifier = this.__getIdentifier__(item);

        if (identifier != undefined) {

            if (!(model instanceof this.schema.model) && !(model = model.____self____)) {
                model = new this.schema.model();
                model.add(item);
            }

            identifier = this.__getIdentifier__(model, this.__filters__);

            if (identifier) {
                out = this.__insert__(model, add_list, identifier)
                this.__linksInsert__(model);
            }
        }

        return out;
    }


    /**
        Removes an item from the container. 
    */
    remove(term, __FROM_SOURCE__ = false) {

        if (!__FROM_SOURCE__ && this.source)
            return this.source.remove(term);

        let out = [];

        if (!term)
            this.__removeAll__();
        else {

            let terms = term;

            if (!term instanceof Array) {
                terms = [term];
            }

            this.__remove__(terms, out);
        }

        this.__linksRemove__(terms);

        return out;
    }

    /**
        Removes a ModelContainer from list of linked containers. 

        @param {ModelContainer} container - The ModelContainer instance to remove from the set of linked containers. Must be a member of the linked containers. 
    */
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

    /**
        Adds a container to the list of tracked containers. 

        @param {ModelContainer} container - The ModelContainer instance to add the set of linked containers.
    */
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

    __linksRemove__(terms) {
        let a = this.first_link;
        while (a) {
            a.remove(terms, true);
            a = a.next;
        }
    }

    __linksInsert__(item) {
        let a = this.first_link;
        while (a) {
            a.insert(item, true);
            a = a.next;
        }
    }

    /**
        Removes any items in the model not included in the array "items", and adds any items in items not already in the ModelContainer.

        @param {Array} items - An array of identifiable Models or objects. 
    */
    cull(items) {

        let hash_table = {};
        let existing_items = __getAll__([], true);

        let loadHash = (item) => {
            if (item instanceof Array)
                return item.forEach((e) => loadHash(e));

            let identifier = this.__getIdentifier__(item);

            if (identifier)
                hash_table[identifier] = item;

        }

        loadHash(items);

        for (let i = 0; i < existing_items.lenth; i++) {
            let e_item = existing_items[i];
            if (!existing_items[this.__getIdentifier__(e_item)])
                this.__remove__(e_item);
        }

        this.insert(items);
    }

    __setFilters__(term) {
        if (term instanceof Array)
            this.__filters__ = this.__filters__.concat(term)
        else
            this.__filters__.push(term);

    }

    /**
        Returns true if the identifier matches a predefined filter pattern, which is evaluated by this.parser. If a 
        parser was not present the ModelContainers schema, then the function will return true upon every evaluation.
    */
    __filterIdentifier__(identifier, filters) {
        if (filters.length > 0) {
            return this.parser.filter(identifier, filters);
        }
        return true;
    }

    /**
        Returns the Identifier property value if it exists in the item. If an array value for filters is passed, then undefined is returned if the identifier value does not pass filtering criteria.
        @param {(Object|Model)} item
        @param {Array} filters - An array of filter terms to test whether the identifier meets the criteria to be handled by the ModelContainer.
    */
    __getIdentifier__(item, filters = null) {

        let identifier = null;

        if (typeof(item) == "object")
            identifier = item[this.schema.identifier];
        else
            identifier = item;

        if (filters && identifier)
            return (this.__filterIdentifier__(identifier, filters)) ? identifier : undefined;

        return identifier;
    }

    /** 
        OVERRIDE SECTION ********************************************************************
        
        All of these functions should be overridden by inheriting classes
    */

    __insert__(item, add_list, identifier) {
        return false;
    }

    __get__(item, __return_data__) {
        return __return_data__;
    }

    __getAll__(__return_data__) {
        return __return_data__;
    }

    __removeAll__() {
        return [];
    }

    __remove__(item) {
        return [];
    }

    // END OVERRIDE *************************************************************************

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

    /**
        Returns the length of the first index in this container. 
    */
    get length() {
        return this.first_index.length;
    }

    /**
        Insert a new ModelContainer into the index through the schema.  
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
        Overrides Model container default __getIdentifier__ to force item to pass.
        @private 
    */
    __getIdentifier__(item, filters = null) {
        return true;
    }

    toJSON(){
        return "[]";
    }
}


/*
    Removing Non Enumerable properties 
*/

Object.defineProperty(ModelContainer.constructor, "__filters__", {
    writable: true,
    enumerable: false,
    configurable: false,
    value: EmptyArray
});
Object.defineProperty(ModelContainer.constructor, "prev", {
    writable: true,
    enumerable: false,
    configurable: false,
    value: null
});
Object.defineProperty(ModelContainer.constructor, "next", {
    writable: true,
    enumerable: false,
    configurable: false,
    value: null
});
Object.defineProperty(ModelContainer.constructor, "first_link", {
    writable: true,
    enumerable: false,
    configurable: false,
    value: null
});
Object.defineProperty(ModelContainer.constructor, "source", {
    writable: true,
    enumerable: false,
    configurable: false,
    value: null
});
Object.defineProperty(ModelContainer.constructor, "pin", {
    writable: true,
    enumerable: false,
    configurable: false,
    value: null
});
Object.defineProperty(ModelContainer.constructor, "schema", {
    writable: true,
    enumerable: false,
    configurable: false,
    value: null
});

export {
    MCArray,
    ModelContainer,
    MultiIndexedContainer,
    array_container
};