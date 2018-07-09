import {
    Rivet
} from "../rivet"
export class Tap extends Rivet {

    constructor(parent, data, presets) {
        super(parent, data, presets);
        this.prop = data.prop;
    }

    down(data, changed_properties = null, imported) {
        if (changed_properties) {
            for (var i = 0, l = changed_properties.length; i < l; i++) {
                if (changed_properties[i] == this.prop)
                    break;

                if (i == l - 1)
                    return null;
            }
        } else {
            if (data[this.prop] !== undefined)
                return { value: data[this.prop] }
        }
    }

    /**
        See Definition in Rivet 
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