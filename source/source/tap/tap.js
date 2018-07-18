import { PipeBase } from "../pipe/base"

/**
 *   An interest on a particular property or set of properties of a Model. A Tap exists as a child of a {@link Source} object, and will respond to Model update events that are passed down from its Source parent. It will only react to properties of the Model that match its internal `prop` property, which is the String name of the property to look for in the Model. If the data property it is interested in changes, it will pull the value of that property from the Model and pass it on to its children, which can be {@link Pipe}s and {@link IO}s.
 *   @param {Source} parent - The parent {@link Source}, used internally to build a hierarchy of Sources.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @memberof module:wick.core.source
 *   @alias Tap
 *   @extends PipeBase
 */
export class Tap extends PipeBase {

    constructor(parent, data, presets) {

        super(parent, data, presets);

        this.prop = data.prop;

    }

    load(data) {

        let out = {
            [this.prop]: data[this.prop], i_el: null, o_el: null }

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].__down__(out, out, false);
    }

    down(data, changed_properties = null, imported) {

        let prop = null;

        if (changed_properties) {
            if ((prop = changed_properties[this.prop]) !== undefined)
                return {
                    [this.prop]: data[this.prop], i_el: null, o_el: null }
        } else if ((prop = data[this.prop]) !== undefined)
            return {
                [this.prop]: data[this.prop], i_el: null, o_el: null }
    }

    /**
        See Definition in SourceBase 
    */
    __down__(data, changed_properties = null, IMPORTED = false) {

        let r_val = this.down(data, changed_properties, IMPORTED);

        if (r_val)
            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].__down__(r_val, [this.prop], IMPORTED);
    }

    up(data) {
        this.parent.up(data);
    }
}