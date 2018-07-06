import {
    ModelBase
} from "./model_base.js"

import {
    ModelContainer,
    MultiIndexedContainer
} from "./model_container"

import {
    ArrayModelContainer
} from "./array_container"

import {
    BTreeModelContainer
} from "./btree_container"

import {
    SchemaType
} from "../schema/schemas"

import {
    Scheduler
} from "../scheduler"


/**
    This is used by NModel to create custom property getter and setters 
    on non-ModelContainer and non-Model properties of the NModel constructor.
*/

function CreateSchemedProperty(constructor, scheme, schema_name) {

    if (constructor.prototype[schema_name])
        return;

    let __shadow_name__ = `__${schema_name}__`;


    Object.defineProperty(constructor.prototype, __shadow_name__, {
        writable: true,
        configurable: false,
        enumerable: false,
        value: scheme.start_value || undefined
    })

    Object.defineProperty(constructor.prototype, schema_name, {
        configurable: false,
        enumerable: true,
        get: function() {
            return this[__shadow_name__];
        },

        set: function(value) {

            let result = {
                valid: false
            };

            let val = scheme.parse(value);

            scheme.verify(val, result);

            if (result.valid && this[__shadow_name__] != val)
                (this[__shadow_name__] = val, this.scheduleUpdate(schema_name));
        }
    })
}

/**
    This is used by NModel to create custom property getter and setters 
    on Schemed ModelContainer properties of the NModel constructor.
*/

function CreateMCSchemedProperty(constructor, scheme, schema_name) {

    let schema = scheme.schema;

    let mc_constructor = scheme.container;

    let __shadow_name__ = `__${schema_name}__`;

    Object.defineProperty(constructor.prototype, __shadow_name__, {
        enumerable: false,
        writable: true,
        value: null
    })

    Object.defineProperty(constructor.prototype, schema_name, {
        configurable: false,
        enumerable: true,
        get: function() {

            if (!this[__shadow_name__])
                this[__shadow_name__] = new mc_constructor(scheme.schema)

            return this[__shadow_name__];
        },

        set: function(value) {

            let MC = this[__shadow_name__];
            let data = null;

            if (typeof(value) == "string")
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    console.log(e)
                    return;
                }

            if (value instanceof Array) {
                data = value;
                MC = new mc_constructor(scheme.schema);
                this[__shadow_name__] = MC;
                MC.insert(data)
                this.scheduleUpdate(schema_name);
            } else if (value instanceof mc_constructor) {
                this[__shadow_name__] = value;
                console.log(schema_name)
                this.scheduleUpdate(schema_name);
            }
        }
    })
}

/**
    This is used by NModel to create custom property getter and setters 
    on Model properties of the NModel constructor.
*/

function CreateModelProperty(constructor, scheme, schema_name) {

    let schema = scheme.schema;

    let __shadow_name__ = `__${schema_name}__`;

    Object.defineProperty(constructor.prototype, schema_name, {
        configurable: false,
        enumerable: true,

        get: function() {
            Object.defineProperty(this, schema_name, {
                configurable: false,
                enumerable: true,
                writable: false,
                value: new scheme()
            })
            return this[schema_name];
        },

        set: function(value) {}
    })
}

class Model extends ModelBase {
    /**
     
     */
    constructor(data) {

        super();
        //The schema is stored directly on the constructor. If it is not there, then consider this model type to "ANY"
        let schema = this.constructor.schema;

        if (schema) {
            let __FinalConstructor__ = schema.__FinalConstructor__;

            let constructor = this.constructor;

            Object.defineProperty(constructor.prototype, "schema", {
                writable: false,
                enumerable: false,
                configurable: false,
                value: schema
            })

            if (!__FinalConstructor__) {
                for (let schema_name in schema) {
                    let scheme = schema[schema_name];

                    if (scheme instanceof Array) {
                        if (scheme[0] && scheme[0].container && scheme[0].schema) {
                            CreateMCSchemedProperty(constructor, scheme[0], schema_name);
                        } else if (scheme[0] instanceof ModelContainer) {
                            CreateModelProperty(constructor, scheme[0].constructor, schema_name);
                        }
                    } else if (scheme instanceof Model)
                        CreateModelProperty(constructor, scheme[0].constructor, schema_name);
                    else if (scheme instanceof SchemaType)
                        CreateSchemedProperty(constructor, scheme, schema_name);
                    else
                        console.warn(`Could not create property ${schema_name}.`)

                }

                Object.seal(constructor);


                Object.defineProperty(schema, "__FinalConstructor__", {
                        writable: false,
                        enumerable: false,
                        configurable: false,
                        value: constructor
                    })
                    //schema.__FinalConstructor__ = constructor;


                //Start the process over with a newly minted Model that has the properties defined in the Schema
                return new constructor(data);
            }
        } else {
            /* This will be an ANY Model */
            return new AnyModel(data);
        }

        if (data)
            this.add(data);
    }

    /**
        Removes all held references and calls unsetModel on all listening views.
    */
    destructor() {

        this.schema = null;

        for (let a in this) {
            let prop = this[a];
            if (typeof(prop) == "object" && prop.destructor instanceof Function)
                prop.destructor();
            else
                this[a] = null;
        }

        super.destructor();
        //debugger
    }

    /**
        Given a key, returns an object that represents the status of the value contained, if it is valid or not, according to the schema for that property. 
    */
    verify(key) {

        let out_data = {
            valid: true,
            reason: ""
        };

        var scheme = this.schema[key];

        if (scheme) {
            if (scheme instanceof Array) {

            } else if (scheme instanceof Model) {

            } else {
                scheme.verify(this[key], out_data);
            }
        }

        return out_data
    }

    /**
        Returns a parsed value based on the key 
    */
    string(key) {
        let out_data = {
            valid: true,
            reason: ""
        };

        if (key) {
            var scheme = this.schema[key];

            if (scheme) {
                if (scheme instanceof Array) {
                    this[key].string();
                } else if (scheme instanceof Model) {
                    this[key].string();
                } else {
                    return scheme.string(this[key]);
                }
            }
        }
    }

    /**
        @param data : An object containing key value pairs to insert into the model. 
    */
    add(data) {
        for (let a in data)
            if (a in this) this[a] = data[a];
    }


    get(data) {
        var out_data = {};

        if (!data)
            return this;
        else
            for (var a in data)
                if (a in this) out_data[a] = this[a];

        return out_data;
    }

    toJSON() {
        let out = {};

        let schema = this.schema;

        for (let prop in schema) {

            let scheme = schema[prop];

            out[prop] = this[prop]
        }

        return out;
    }
}

/**
    This is used by NModel to create custom property getter and setters 
    on non-ModelContainer and non-Model properties of the NModel constructor.
*/

function CreateGenericProperty(constructor, prop_val, prop_name, model) {

    if (constructor.prototype[prop_name])
        return;

    let __shadow_name__ = `__${prop_name}__`;


    Object.defineProperty(constructor.prototype, __shadow_name__, {
        writable: true,
        configurable: false,
        enumerable: false,
        val: prop_val
    })

    Object.defineProperty(constructor.prototype, prop_name, {
        configurable: false,
        enumerable: true,

        get: function() {
            return this[__shadow_name__];
        },

        set: function(value) {
            if (result.valid && this[__shadow_name__] != val)
                (this[__shadow_name__] = val, model.scheduleUpdate(prop_name));
        }
    })
}

function AnyModelProxySet(obj, prop, val) {
    if (prop in obj && obj[prop] == val)
        return true

    obj[prop] = val;

    obj.scheduleUpdate(prop);

    return true;
}

class AnyModel extends ModelBase {

    constructor(data) {

        super();

        if (data) {
            for (let prop_name in data) {

                this[prop_name] = data[prop_name];
            }
        }

        return new Proxy(this, {
            set: AnyModelProxySet
        })
    }

    /**
        Alias for destructor
    */

    destroy() {
        this.destructor();
    }

    /**
        Removes all held references and calls unsetModel on all listening views.
    */
    destructor() {
        super.destructor();
    }

    add(data) {
        for (var a in data)
            this[a] = data[a];
    }

    get(data) {
        var out_data = {};

        if (!data) {
            return this;
        } else {
            for (var a in data) {
                let prop = this[a];
                if (prop) {
                    out_data[a] = prop;
                }
            }
        }

        return out_data;
    }

    /**
        Removes items in containers based on matching index.
    */

    remove(data) {
        return {};
    }

    toJSON() {
        let out = {};


        for (let prop in this) {

            if (prop == "first_view" ||
                prop == "changed_values" ||
                prop == "____SCHEDULED____")
                continue;

            out[prop] = this[prop]
        }

        return out;
    }

    toJsonString() {
        return this.data + "";
    }
}

export {
    Model,
    AnyModel,
    ModelContainer,
    ArrayModelContainer,
    MultiIndexedContainer,
    BTreeModelContainer
}