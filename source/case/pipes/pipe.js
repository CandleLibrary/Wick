import {
    Rivet
} from "../rivet"
export class Pipe extends Rivet {

    static Static(data, html) {
        return `<${data.tagname}>${html}</${data.tagname}>`
    }

    constructor(parent, data, presets) {
        super(parent, data, presets);
    }

    down(data){
    	return {value:`<b>${data.value}</b>`}
    }
}

Pipe.ADDS_TAGS = true;
Pipe.CAN_BE_STATIC = true;