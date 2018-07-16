import { View } from "../../view/view"

import { AnyModel } from "../../model/model"

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
        Called by  parent when data is update and passed down from further up the graph. 
        @param {(Object | Model)} data - Data that has been updated and is to be read. 
        @param {Array} changed_properties - An array of property names that have been updated. 
        @param {Boolean} IMPORTED - True if the data did not originate from the model watched by the parent Source. False otherwise.
    */
    __down__(data, changed_properties = null, IMPORTED = false) {

        let r_val = this.down(data, changed_properties, IMPORTED);

        if (r_val)(data = r_val, IMPORTED = true);

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].__down__(data, changed_properties, IMPORTED);
    }
    down(data, changed_properties = null, IMPORTED) {}

    /**
        Called by  parent when data is update and passed up from a leaf. 
        @param {(Object | Model)} data - Data that has been updated and is to be read. 
        @param {Array} changed_properties - An array of property names that have been updated. 
        @param {Boolean} IMPORTED - True if the data did not originate from the model watched by the parent Source. False otherwise.
    */
    __up__(data) {

        if (this.parent)
            this.parent(up);
    }

    up(data) {
        if (data)
            this.__up__(data)
    }
}