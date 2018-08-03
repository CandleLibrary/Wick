import { ModelBase } from "./base.js";

import { ArrayModelContainer } from "./container/array";

/**
 * Function used by the AnyModel Proxy object to set property members and values. Calls {@link Model#scheduleUpdate} of the host AnyModel instance when a property value changes or a new poperty is added.
 * @param      {Object}   obj     The object to set the property of.
 * @param      {String}   prop    The property name to set.
 * @param      {String | Number | Boolean | Array | Object}   val     The value to set `obj[prop]` to.
 * @return     {boolean}  { description_of_the_return_value }
 * @protected
 * @memberof module:wick~internals.model
 */
function AnyModelProxySet(obj, prop, val) {
    

    if (prop in obj && obj[prop] == val)
        return true;

    let property = obj[prop];

    if (property && typeof(property) == "object")
        property.set(val);
    else
        obj[prop] = val;


    obj.scheduleUpdate(prop);

    return true;
}

/**
 * An observable data class that does not require a schema. It will accept any type of property value and new properties can be added at any point. Uses the Proxy interface internally.  
 * @param {Object | Model | AnyModel}  data - An Object or Model from which to clone property names and property values.
 * @memberof module:wick.core.model
 * @alias AnyModel
 * @extends ModelBase
 */
class AnyModel extends ModelBase {

    constructor(data, prop_name = "") {
        super();

        this._cv_ = [];

        if (data)
            for (let prop_name in data) {
                if (data[prop_name] instanceof Array && prop_name != "_cv_") {

                    let mc = new ArrayModelContainer(data[prop_name], {
                        parser: null,
                        model: AnyModel,
                        identifier: null,
                        prop_name
                    });

                    mc.par = this;

                    //mc.insert(data[prop_name]);

                    this[prop_name] = mc;
                } else
                    this[prop_name] = data[prop_name];
            }

        Object.defineProperty(this, "_SCHD_", { configurable: false, enumerable: false, value: 0, writable: true });
        Object.defineProperty(this, "_SEALED_", { configurable: false, enumerable: false, value: false, writable: true });
        Object.defineProperty(this, "prop_name", { configurable: false, enumerable: false, value: prop_name, writable: false });
    }


    get proxy() {
        return new Proxy(this, {
            set: AnyModelProxySet
        });
    }

    _scheduledUpdate_() {
        super._scheduledUpdate_();
    }

    /**
        Removes all held references and calls unsetModel on all listening views.
    */
    _destroy_() {

        super._destroy_();
    }

    set(data, par = this.par) {

        let out = (par) ? par.setMutation(this, this.MUTATION_ID) : this;

        for (var name in data) {

            let property = out[name];

            if (property && typeof(property) == "object")
                out[name] = property.set(data[name], this);
            else
                out[name] = data[name];
        }

        return out;
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

    remove() {
        return {};
    }

    seal() {
        let clone = this.clone();
        clone.MUTATION_ID = this.MUTATION_ID + 1;
        return clone;
    }

    toJSON() {

        let out = {};


        for (let prop in this) {

            if (prop == "first_view" ||
                prop == "changed_values" ||
                prop == "_SCHD_")
                continue;

            out[prop] = this[prop];
        }

        return out;
    }

    toJsonString() {
        return this.data + "";
    }


    /**
     * Creates a new instance of the object with same properties than original.
     */
    clone() {
        let clone = new this.constructor(this);

        for (let name in this)
            clone[name] = this[name];

        clone.MUTATION_ID = this.MUTATION_ID;

        return clone;
    }
}



export { AnyModel };