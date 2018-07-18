import {
    PipeBase
} from "../pipe/base"


/**
 *   The IO is the last link in the Source chain. It is responsible for putting date into the DOM through the element it binds to.
 *   @param {Source} parent - The parent {@link Source}, used internally to build a hierarchy of Sources.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @param {external:HTMLElement} element - The HTMLElement that the IO will bind to.
 *   @memberof module:wick.core.source
 *   @alias IO
 *   @extends PipeBase
 */
export class IO extends PipeBase {

    constructor(parent, data, presets, element = null) {

        if(element && element.tagName == "INPUT" && data.attrib == "value") return new InputIO(parent, data, presets, element);
        if (element && element.tagName !== "IO") return new AttribIO(parent, data, presets, element);

        super(parent, data, presets)

        this.prop = data.prop;

        //Appending the value to a text node prevents abuse from insertion of malicious DOM markup. 
        this.ele = document.createTextNode(element.innerText);

        element.parentElement.replaceChild(this.ele, element)
    }


    down(data) {

        if (data[this.prop] !== undefined) 

            this.ele.data = data[this.prop];
        

        //If an inner and outer element chain has been received, append the value node to the inner and assign the outer to t. 
        if (data.o_el) {

            this.ele.parentElement.replaceChild(data.o_el, this.ele);

            data.o_el.appendChild(this.ele);
        }
    }
}

/**
    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
export class AttribIO extends PipeBase {
    constructor(parent, data, presets, element) {

        const attrib = element.attributes.getNamedItem(data.attrib);

        super(parent, data, presets)

        this.prop = data.prop;

        this.ele = attrib;
    }

    /**
        Puts data into the watched element's attribute. The default action is to simply update the attribute with data.value.  
    */
    down(data) {
        if (data[this.prop] !== undefined) 
            this.ele.value = data[this.prop];
    }
}

export class InputIO extends AttribIO {
    constructor(parent, data, presets, element) {

        super(parent, data, presets, element)

        element.addEventListener("input", (e)=>{
            this.up({[this.prop]: e.target.value})
        })
    }
}