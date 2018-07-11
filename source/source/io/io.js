import {
    PipeBase
} from "../pipe/base"

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

        //Appending the value to a text node prevents abuse from insertion of malicious DOM markup. 
        this.ele = document.createTextNode(element.innerText);

        element.parentElement.replaceChild(this.ele, element)
    }


    down(data) {

        if (data.v !== undefined) 

            this.ele.data = data.v;
        

        //If an inner and outer element chain has been received, append the value node to the inner and assign the outer to t. 
        if (data.o_el) {

            this.ele.parentElement.replaceChild(data.o_el, this.ele);

            data.o_el.appendChild(this.ele);
        }
    }
}

/** @namespace IO */

/**
    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
export class AttribIO extends PipeBase {
    constructor(parent, data, presets, element) {

        const attrib = element.attributes.getNamedItem(data.prop);

        super(parent, data, presets)

        this.ele = attrib;
    }

    /**
        Puts data into the watched element's attribute. The default action is to simply update the attribute with data.value.  
    */
    down(data) {
        this.ele.value = data.v;
    }
}