import { PipeBase } from "../pipe/base"

export class TapResult {
    constructor(value, data){
        this.d = data;
        this.v = value;
        this.i_el = null;
        this.o_el = null;
    }
}

export class Tap extends PipeBase {

    constructor(parent, data, presets) {

        super(parent, data, presets);

        this.prop = data.prop;

    }

    load(data){

        let out = { [this.prop]: data[this.prop], i_el : null, o_el : null }

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].__down__(out, out, false);
    }

    down(data, changed_properties = null, imported) {

        let prop = null;

        if (changed_properties) {
            if ((prop = changed_properties[this.prop]) !== undefined)
                return { [this.prop]: data[this.prop], i_el : null, o_el : null }
        } else if ((prop = data[this.prop]) !== undefined)
            return { [this.prop]: data[this.prop], i_el : null, o_el : null }
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

        if (data.value !== undefined) {
            let out = {};
            out[this.prop] = data.value;
            return out;
        }

        return null;
    }
}