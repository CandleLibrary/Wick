import { Scheduler } from "../../common/scheduler";

export class IOBase {

    constructor(parent) {
        parent.ios.push(this);
        this.parent = parent;
    }

    destroy() {
        this.parent.removeIO(this);
        this.parent = null;
    }

    down() {}
    up(value, meta) { this.parent.up(value, meta); }
}

/**
 *   The IO is the last link in the Source chain. It is responsible for putting date into the DOM through the element it binds to. Alternativly, in derived versions of `IO`, it is responsible for retriving values from user inputs from input elements and events.
 *   @param {Source} tap - The tap {@link Source}, used internally to build a hierarchy of Sources.
 *   @param {Object} data - An object containing HTMLELement attribute values and any other values produced by the template parser.
 *   @param {Presets} presets - An instance of the {@link Presets} object.
 *   @param {HTMLElement} element - The HTMLElement that the IO will _bind_ to.
 *   @memberof module:wick.core.source
 *   @alias IO
 *   @extends IOBase
 */
export class IO extends IOBase {

    constructor(source, errors, tap, element = null) {
        super(tap);
        //Appending the value to a text node prevents abuse from insertion of malicious DOM markup. 
        this.ele = element;
    }

    destroy() {
        this.ele = null;
        super.destroy();
    }

    down(value) {
        this.ele.data = value;
    }
}

/**
    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
export class AttribIO extends IOBase {
    constructor(source, errors, tap, attr, element) {
        super(tap);

        this.attrib = attr;
        this.ele = element;
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
}

export class InputIO extends IOBase {

    constructor(source, errors, tap, element) {

        super(tap);

        this.ele = element;

        this.event = (e) => { this.parent.up(e.target.value, { event: e }); };

        this.ele.addEventListener("input", this.event);
    }

    destroy() {
        this.ele.removeEventListener("input", this.event);
        this.ele = null;
        this.event = null;
        this.attrib = null;
    }

    down(value) {
        this.ele.value = value;
    }
}

export class BindIO extends IOBase {

    constructor(source, errors, tap) {
        super(tap);
        this._value_ = null;
        this.child = null;
    }

    destroy() {
        this._value_ = null;
        if (this.child) this.child.destroy();
        this.child = null;
        super.destroy();
    }

    /**
        Puts data into the watched element's attribute. The default action is to simply update the attribute with data._value_.  
    */
    down(value) {
        this._value_ = value;
        this.child.down();
    }
}

export class TemplateString extends IOBase {

    constructor(source, errors, taps, element, binds) {

        super(source);
        this._SCHD_ = 0;
        this.binds = [];
        this.ele = element;
        this._setBindings_(source, errors, taps, binds);
    }

    destroy() {
        for (var i = 0; i < this.binds.length; i++)
            this.binds[i].destroy();
        this._SCHD_ = 0;
        this.binds = null;
        this.ele = null;
        super.destroy();
    }

    _setBindings_(source, errors, taps, binds) {
        for (var i = 0; i < binds.length; i++) {
            let bind = binds[i];

            switch (bind.type) {
                case 0: //DYNAMIC_BINDING_ID
                    let new_bind = new BindIO(source, errors, source.getTap(bind.tap_name), bind);
                    this.binds.push(new_bind);
                    new_bind.child = this;
                    //this.binds.push(msg._bind_(source, errors, taps, this));
                    break;
                case 1: //RAW_VALUE_BINDING_ID
                    this.binds.push(bind);
                    break;
                case 2: //TEMPLATE_BINDING_ID
                    if (bind._bindings_.length < 1) // Just a variable less expression.
                        this.binds.push({ _value_: msg.func() });
                    else
                        this.binds.push(bind._bind_(source, errors, taps, this));
                    break;
            }
        }
        this.down();
    }

    get data() {}
    set data(v) { Scheduler.queueUpdate(this); }

    down() {
        Scheduler.queueUpdate(this);
    }

    scheduledUpdate() {

        let str = [];

        for (let i = 0; i < this.binds.length; i++)
            str.push(this.binds[i]._value_);

        this.ele.data = str.join('');
    }
}

export class AttribTemplate extends TemplateString {

    constructor(source, errors, taps, attr, element, binds) {
        super(source, errors, taps, element, binds);
        this.attrib = attr;
    }

    destroy() {
        this.attrib = null;
        super.destroy();
    }

    scheduledUpdate() {

        let str = [];

        for (let i = 0; i < this.binds.length; i++)
            str.push(this.binds[i]._value_);

        this.ele.setAttribute(this.attrib, str.join(''));
    }
}