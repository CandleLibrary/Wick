import { IO } from "./io"

/** @namespace IO */

/**
	This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
export class AttribIO extends IO {
    /**
    	Puts data into the watched element's attribute. The default action is to simply update the attribute with data.value.  
    */
    down(data) {
        this.element.attributes[this.prop] = data.value;
    }
}