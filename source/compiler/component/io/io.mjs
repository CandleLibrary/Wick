import spark from "@candlefw/spark";

export class IOBase {

    constructor(parent) {

        this.parent = null;

        parent.addIO(this);
    }

    destroy() {

        this.parent.removeIO(this);

        this.parent = null;
    }

    down() {}
    up(value, meta) { this.parent.up(value, meta); }
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

    constructor(scope, errors, tap, element = null, default_val) {

        super(tap);
        //Appending the value to a text node prevents abuse from insertion of malicious DOM markup. 
        this.ele = element;
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

/**
    This IO object will update the attribute value of the watched element, using the "prop" property to select the attribute to update.
*/
export class AttribIO extends IOBase {
    constructor(scope, errors, tap, attr, element, default_val) {
        super(tap);

        this.attrib = attr;
        this.ele = element;

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

    set data(v){
        this.down();
    }

    get data(){

    }
}

// Toogles the display state of the element based on the "truthyness" of the passed value
export class BooleanIO extends IOBase {
    constructor(scope, errors, tap, element, default_val) {
        super(tap);

        this.par = element.parentElement;

        this.ele = element;

        this.state = false;

        this.place_holder = null;

        if (typeof(default_val) !== "undefined") this.down(default_val)

        if (this.state == false)
            this.ele.style.display = "none";

    }

    destroy() {
        this.ele = null;
        this.attrib = null;
        super.destroy();
    }

    down(value) {


        if (!this.par && this.ele.parentElement)
            this.par = this.ele.parentElement

        if (value && !this.state) {
            this.ele.style.display = "";

            if (this.place_holder)
                this.par.replaceChild(this.ele, this.place_holder);

            this.place_holder = null;

            this.state = true;
        } else if (!value && this.state) {
            this.place_holder = document.createTextNode("");
            this.par.replaceChild(this.place_holder, this.ele);
            this.state = false;
        }
    }
}


export class InputIO extends IOBase {

    constructor(scope, errors, tap, element, message_key) {

        super(tap);

        this.ele = element;

        const up_tap = message_key ? scope.getTap(message_key) : tap;

        this.event = (e) => { up_tap.up(e.target.value, { event: e }); };

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

    constructor(scope, errors, tap) {
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

    constructor(scope, errors, taps, element, binds) {
       
        super(scope);
        this._SCHD_ = 0;
        this.binds = [];
        this.ele = element;
        this._setBindings_(scope, errors, taps, binds);
    }

    destroy() {
        for (var i = 0; i < this.binds.length; i++)
            this.binds[i].destroy();
        this._SCHD_ = 0;
        this.binds = null;
        this.ele = null;
        super.destroy();
    }

    _setBindings_(scope, errors, taps, binds) {
        for (var i = 0; i < binds.length; i++) {
            let bind = binds[i];

            switch (bind.type) {
                case 0: //DYNAMICbindingID
                    let new_bind = new BindIO(scope, errors, scope.getTap(bind.tap_name), bind);
                    this.binds.push(new_bind);
                    new_bind.child = this;
                    //this.binds.push(msg._bind_(scope, errors, taps, this));
                    break;
                case 1: //RAW_VALUEbindingID
                    this.binds.push(bind);
                    break;
                case 2: //TEMPLATEbindingID
                    if (bind.bindings.length < 1) // Just a variable less expression.
                        this.binds.push({ _value_: msg.func() });
                    else
                        this.binds.push(bind._bind_(scope, errors, taps, this));
                    break;
            }
        }
        this.down();
    }

    get data() {}
    set data(v) { spark.queueUpdate(this); }

    down() { spark.queueUpdate(this); }

    scheduledUpdate() {
        let str = [];

        for (let i = 0; i < this.binds.length; i++)
            str.push(this.binds[i]._value_);

        this.ele.data = str.join('');   
    }
}

export class AttribTemplate extends TemplateString {

    constructor(scope, errors, taps, attr, element, binds) {
        super(scope, errors, taps, element, binds);
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
