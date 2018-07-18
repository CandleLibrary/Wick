import { View } from "../../view/view"

import { AnyModel } from "../../model/any"


/**
 *   The base class {@link IO}, {@link Tap}, and {@link Pipe} inherit from.  
 *   @param {Source} parent - The parent {@link Source}, used internally to build a hierarchy of Sources.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @memberof module:wick~internals.source
 *   @interface
 *   @alias PipeBase
 */
export class PipeBase {

    constructor(parent = null, data = {}, presets = {}) {
        this.parent = parent;
        this.data = data;
        this.children = [];
        this.IS_SOURCE = false;
        if (this.parent) this.parent.children.push(this);
    }

    load(){
        // NO OP
    }

    dstr() {
        this.data = null;
    }

    /**
        Called by  parent when data is update and passed down from further up the chain. 
        @param {(Object | Model)} data - Data that has been updated and is to be read. 
        @param {Array} changed_properties - An array of property names that have been updated. 
        @param {Boolean} IMPORTED - True if the data did not originate from the Model bound to the parent Source. False otherwise.
    */
    __down__(data, changed_properties = null, IMPORTED = false) {

        let r_val = this.down(data, changed_properties, IMPORTED);

        if (r_val)(data = r_val, IMPORTED = true);

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].__down__(data, changed_properties, IMPORTED);
    }
    down(data, changed_properties = null, IMPORTED) {}

    /**
        Called by a child when data is update and passed up from a child to be added to a Model. 
        @param {(Object | Model)} data - Data that has been changed by the child and is to be set. 
    */
    __up__(data) {

        if (this.parent)
            this.parent.up(data);
    }

    up(data) {
        if (data)
            this.__up__(data)
    }
}