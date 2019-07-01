import spark from "@candlefw/spark";
import { EXPORT } from "../tap/tap.js";
export class IOBase {

    constructor(parent, element = null) {

        this.parent = null;
        this.ele = element;

        parent.addIO(this);
    }

    destroy() {
        this.parent.removeIO(this);

        this.parent = null;
    }

    down() {}

    up(value, meta) { this.parent.up(value, meta); }

    //For IO composition.
    set data(data) { this.down(data) }

    addIO(child) {
        this.ele = child;
    }

    removeIO() {
        this.ele = null;
    }
}

/**
 *   The IO is the last link in the Scope chain. It is responsible for putting date into the DOM through the element it binds to. Alternativly, in derived versions of `IO`, it is responsible for retriving values from user inputs from input elements and events.
 *   @param {Scope} tap - The tap {@link Scope}, used internally to build a hierarchy of Scopes.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @param {HTMLElement} element - The HTMLElement that the IO will _bind_ to.
 *   @memberof module:wick.core.scope
 *   @alias IO
 *   @extends IOBase
 */
export class IO extends IOBase {

    constructor(scope, errors, tap, element = null, default_val = null) {

        super(tap, element);
        //Appending the value to a text node prevents abuse from insertion of malicious DOM markup. 

        this.argument = null;

        if (default_val) this.down(default_val)
    }

    destroy() {
        this.ele = null;
        super.destroy();
    }

    down(value) {
        this.ele.data = value;
    }
}

class RedirectAttribIO extends IOBase {
    constructor(scope, errors, down_tap, up_tap) {
        super(down_tap);
        this.up_tap = up_tap;
    }

    down(value) {
        this.up_tap.up(value);
    }
}

/**
    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
export class AttribIO extends IOBase {
    constructor(scope, errors, tap, attr, element, default_val) {

        if (element.io) {
            let down_tap = element.io.parent;
            let root = scope.parent;
            tap.modes |= EXPORT;
            return new RedirectAttribIO(scope, errors, element.io.parent, tap)
        }

        super(tap, element);

        this.attrib = attr;
        this.ele.io = this;


        if (default_val) this.down(default_val)
    }

    destroy() {
        this.ele = null;
        this.attrib = null;
        super.destroy();
    }

    /**
        Puts data into the watched element's attribute. The default action is to simply update the attribute with data._value_.  
    */
    down(value) {
        this.ele.setAttribute(this.attrib, value);
    }

    set data(v) {
        this.down(v);
    }

    get data() {

    }
}

/**
    This io updates the value of a TextNode or it replaces the TextNode with another element if it is passed an HTMLElement
*/
export class DataNodeIO extends IOBase {
    constructor(scope, tap, element, default_val) {
        super(tap, element);
        this.ele = element;
        this.ELEMENT_IS_TEXT = element instanceof Text;
        if (default_val) this.down(default_val)
    }

    destroy() {
        this.ele = null;
        this.attrib = null;
        super.destroy();
    }

    down(value) {
        if (value instanceof HTMLElement) {
            if (value !== this.ele) {
                this.ELEMENT_IS_TEXT = false;
                this.ele.parentElement.replaceNode(value, this.ele)
                this.ele = value;
            }
        } else {
            if (!this.ELEMENT_IS_TEXT) {
                this.ELEMENT_IS_TEXT = true;
                const ele = new Text();
                console.log("SDFSDFSDFSDF")
                this.ele.parentElement.replaceNode(ele, this.ele)
                this.ele = ele;
            }
            this.ele.data = value;
        }
    }
}

export class EventIO extends IOBase {

    constructor(scope, errors, tap, attrib_name, element, default_val) {

        super(tap);

        this.ele = element;

        const up_tap = default_val ? scope.getTap(default_val) : tap;

        this.event = (e) => { up_tap.up(e.target.value, { event: e }); };

        this.event_name = attrib_name.replace("on", "");

        this.ele.addEventListener(this.event_name, this.event);
    }

    destroy() {
        this.ele.removeEventListener("input", this.event);
        this.ele = null;
        this.event = null;
        this.event_name = null;
        this.attrib = null;
        super.destroy();
    }

    down(value) {
        this.ele.value = value;
    }
}

export class InputIO extends IOBase {

    constructor(scope, errors, tap, attrib_name, element, default_val) {

        super(tap);

        this.ele = element;

        const up_tap = default_val ? scope.getTap(default_val) : tap;

        if (element.type == "checkbox")
            this.event = (e) => { up_tap.up(e.target.checked, { event: e }) };
        else
            this.event = (e) => { up_tap.up(e.target.value, { event: e }) };

        this.ele.addEventListener("input", this.event);
    }

    destroy() {
        this.ele.removeEventListener("input", this.event);
        this.ele = null;
        this.event = null;
        this.attrib = null;
        super.destroy();
    }

    down(value) {
        this.ele.value = value;
    }
}