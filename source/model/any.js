import { ModelBase } from "./base.js"

import { ArrayModelContainer } from "./container/array"

/**
 * Function used by the AnyModel Proxy object to set property members and values. Calls {@link Model#scheduleUpdate} of the host AnyModel instance when a property value changes or a new poperty is added.
 * @param      {Object}   obj     The object to set the property of.
 * @param      {external:String}   prop    The property name to set.
 * @param      {String | Number | Boolean | Array | Object}   val     The value to set `obj[prop]` to.
 * @return     {boolean}  { description_of_the_return_value }
 * @protected
 * @memberof module:wick~internals.model
 */
function AnyModelProxySet(obj, prop, val) {

    if (prop in obj && obj[prop] == val)
        return true

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

    constructor(data) {

        super();

        if (data)
            for (let prop_name in data) {
                if (data[prop_name] instanceof Array) {
                    let mc = new ArrayModelContainer({ parser: null, model: AnyModel, identifier: null });
                    mc.insert(data[prop_name]);
                    this[prop_name] = mc.proxy();
                } else
                    this[prop_name] = data[prop_name];
            }

        return new Proxy(this, {
            set: AnyModelProxySet
        })
    }

    scheduledUpdate() {
        super.scheduledUpdate()
    }

    /**
        Removes all held references and calls unsetModel on all listening views.
    */
    destroy() {

        super.destroy();
    }

    add(data) {

        for (var a in data) {
            this[a] = data[a];
        }
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
                prop == "_SCHD_")
                continue;

            out[prop] = this[prop]
        }

        return out;
    }

    toJsonString() {

        return this.data + "";
    }
}

export { AnyModel }