import { ModelBase } from "./base.js"

import { ModelContainerBase } from "./container/base"

import { MultiIndexedContainer } from "./container/multi"

import { ArrayModelContainer } from "./container/array"

import { BTreeModelContainer } from "./container/btree"

import { SchemeConstructor } from "../schema/schemas"

/**
    This is used by Model to create custom property getter and setters on non-ModelContainerBase and non-Model properties of the Model constructor.
    @protected
    @memberof module:wick~internals.model
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
    This is used by Model to create custom property getter and setters on Schemed ModelContainerBase properties of the Model constructor.
    @protected
    @memberof module:wick~internals.model
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
                this.scheduleUpdate(schema_name);
            }
        }
    })
}

/**
    This is used by Model to create custom property getter and setters on Model properties of the Model constructor.
    @protected
    @memberof module:wick~internals.model
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

/**
 * @classdesc The Model class is a strict schema based data store for primitive values and ModelContainers. Models rely on a schema assigned to the constructor to ensure their property values adhere to a fixed standard. This allows models to self validate data. Any attempt to update a property on a Model that does not conform to its schema will be rejected. This helps prevent gotchas with user submitted data and unsure data conforms to server APIs.
 * 
 * An instance of a model will have getters and setters defined for each property of the schema. When a property is set, the Model will compare the new value against the requirements of the schema. If it is an incorrect value type or a non existent property, the set action will fail without warning. If the new value is acceptable according to the schema, then the value will be transformed into a value suitable for storage and transmission of the Model. 
 * 
 * In order to use the Model class, the user must extend the base class with their own model type:
 * 
 * ```javascript 
 * class User extends wick.model {}
 * ```
 * And then assign a schema object to the `schema` property of the class constructor:
 * ```
 * User.schema = { name : wick.schema.string, birthday:  wick.schema.data }
 * 
 * let user = new User({
 *      name : "Timitha Day",
 *      birthday : ""
 * })
 * ```
 * Since there is no schema defined on the base Model class, if `let model = new wick.model()`, an {@link module:wick.core.model.AnyModel} instance will be returned instead.
 * 
 * @see {Schema}
 * @param {Object | Model | AnyModel}  data - An Object or Model from which to clone property names and property values.
 * @memberof module:wick.core.model
 * @alias Model
 * @extends ModelBase
 */
class Model extends ModelBase {

    constructor(data) {

        super();
        //The schema is stored directly on the constructor. If it is not there, then consider this model type to "ANY"
        if (!this.schema) {
            
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
                            } else if (scheme[0] instanceof ModelContainerBase) {
                                CreateModelProperty(constructor, scheme[0].constructor, schema_name);
                            }
                        } else if (scheme instanceof Model)
                            CreateModelProperty(constructor, scheme[0].constructor, schema_name);
                        else if (scheme instanceof SchemeConstructor)
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
        }

        if (data)
            this.add(data);
    }

    /**
     * Removes all held references and calls unsetModel on all bound Views.
     * @protected
     */
    destroy() {

        this.schema = null;

        for (let a in this) {
            let prop = this[a];
            if (typeof(prop) == "object" && prop.destroy instanceof Function)
                prop.destroy();
            else
                this[a] = null;
        }

        super.destroy();
    }


    /**
     * Given a key, returns an object that represents the status of the value contained, if it is valid or not, according to the schema for that property. 
     * @public
     * @param   {external:String}  key - The property name to look up.
     * @return  {Object} - Returns object with the properties `valid` and `reason`. `valid` will be set to `true` if the property value is a valid form according to the scheme for the property, `false` otherwise. If `verify().valid = false`, then `reason` will be a string giving a reason as to why the value is invalid.
     */
    verify(key, value) {

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
     * Returns string representation of the property value indexed by `key`.
     * @public
     * @param      {external:String}  key     The name of the property to get the string value of.
     * @return     {external:String}  - the string representation of the property value.
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
     * Adds data to the model.
     *  @public
     *  @param      {Object}  data - An object containing properties to insert into the model. 
     */
    add(data) {
        for (let a in data)
            if (a in this) this[a] = data[a];
    }

    /**
     * Retrieves data from the model.
     *  @instance
     *  @public
     *  @param      {Object}  data - An object containing properties to insert into the model. 
     */
    get(data) {

        var out_data = {};

        if (!data)
            return this;
        else
            for (var a in data)
                if (a in this) out_data[a] = this[a];

        return out_data;
    }
    /**
     *  Returns a JSON primitive form of the Model.
     *  
     *  @instance
     *  @public
     *  @return     {Object}  Returns an object representation of the model free of cyclical references which JSON.stringfy will be able to parse.
     */
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

export { Model }