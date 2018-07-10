import { PipeBase } from "../pipe_base"

/** @namespace IO */

/**
	The IO is the last link in the Source chain. It is responsible for putting date into the DOM through it's connected element, and present it to the viewer. 
	It is also responsible for responding to user input, though the base IO object does not provide any code for that. 
*/
export class IO extends PipeBase {

    constructor(parent, data, presets, element = null) {

        if (element && element.tagName !== "IO") return new AttribIO(parent, data, presets, element);

        super(parent, data, presets)
        this.prop = data.prop;
        this.ele = element;
    }


    down(data) {
        this.ele.innerHTML = data.value;
    }
}

/** @namespace IO */

/**
	This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
export class AttribIO extends IO {
    constructor(parent, data, presets, element) {
        super(parent, data, presets)

        this.element = element;

        //Remove the index marker
        element.childNodes[0].data = element.childNodes[0].data.replace(/\#\#\:\d*\s/, "");
    }

    /**
    	Puts data into the watched element's attribute. The default action is to simply update the attribute with data.value.  
    */
    down(data) {
        if (this.prop == "style"){
            this.ele.style = data.value;
        }
        else
            this.ele.attributes[this.prop] = data.value;
    }
}