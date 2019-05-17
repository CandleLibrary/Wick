import { ExpressionIO, InputExpressionIO, BooleanExpressionIO, AttribExpressionIO } from "../../io/expression_io.mjs";
import { EventIO } from "../../io/event_io.mjs";
import { ScriptIO } from "../../io/script_io.mjs";
import { IO, AttribIO, InputIO, BooleanIO } from "../../io/io.mjs";
import { replaceEscapedHTML } from "../../../utils/string.mjs";

export const DYNAMICbindingID = 0;
export const RAW_VALUEbindingID = 1;
export const TEMPLATEbindingID = 2;
export const EVENTbindingID = 3;

export const ATTRIB = 1;
export const STYLE = 2;
export const HTML = 3;
export const TEXT = 4;
export const INPUT = 5;
export const SCRIPT = 6;
export const EVENT = 7;
export const BOOL = 8;

/**
 * Binding builder for expressions
 *
 * @class      ExpressionBinding (name)
 */
export class EventBinding {
    constructor(prop) {
        this.arg = null;
        this.event = prop;
    }

    _bind_(scope, errors, taps, element, eventname) {
        return new EventIO(scope, errors, taps, element, eventname, this.event, this.arg);
    }

    get bindings() {
        if (this.argument) {
            if (this.argument.type == TEMPLATEbindingID)
                return [...this.argument.bindings, this.event];
            else
                return [this.argument, this.event];
        }
        return [this.event];
    }
    set bindings(v) {}

    get type() {
        return TEMPLATEbindingID;
    }
    set type(v) {}

    set argument(binding) {
        this.arg = binding;
    }
}

/**
 * Binding builder for expressions
 *
 * @class      ExpressionBinding (name)
 */
export class ExpressionBinding {
    constructor(binds, func) {
        this.bindings = binds;
        this.func = func;
        this.arg = null;
        this.attrib = "";
    }

    _bind_(scope, errors, taps, element) {
        switch (this.method) {
            case BOOL:
                return new BooleanExpressionIO(scope, errors, taps, element, this.bindings, this.func);
            case INPUT:
                return new InputExpressionIO(scope, errors, taps, element, this.bindings, this.func);
            case ATTRIB:
                return new AttribExpressionIO(scope, errors, taps, element, this.bindings, this.func, this.attrib);
            default:
                return new ExpressionIO(scope, errors, taps, element, this.bindings, this.func);
        }
    }

    get type() {
        return TEMPLATEbindingID;
    }
    set type(v) {}
}


export class DynamicBinding {

    constructor() {
        this.tap_name = "";
        this.tap_id = 0;
        this.val = "";
        this._func_ = null;
        this.method = 0;
        this.argKey = null;
        this.argVal = null;
        this.attrib = "";
    }

    _bind_(scope, errors, taps, element, attr = "", node = null, statics = null) {

        let tap = scope.getTap(this.tap_name); //taps[this.tap_id];
        switch (this.method) {
            case INPUT:
                return new InputIO(scope, errors, tap, element, this.argKey);
            case BOOL:
                return new BooleanIO(scope, errors, tap, element, this.argVal);
            case ATTRIB:
                return new AttribIO(scope, errors, tap, attr, element, this.argVal);
            case SCRIPT:
                return new ScriptIO(scope, errors, tap, this, node, statics);
            default:
                return new IO(scope, errors, tap, element, this.argVal);
        }
    }

    get type() {
        return DYNAMICbindingID;
    }
    set type(v) {}

    toString() { return `((${this.tap_name}))`; }

    set argument(binding) {
        if (binding instanceof DynamicBinding) {
            this.argKey = binding.tap_name;
            this.argVal = binding.val;
        } else if (binding instanceof RawValueBinding) {
            this.argVal = binding.val;
        }
    }
}

export class RawValueBinding {
    constructor(val) {
        this.val = replaceEscapedHTML(val);
        this.method = 0;
    }

    _bind_(scope, errors, taps, element, prop = "") {
        try {

            switch (this.method) {
                case TEXT:
                    element.data = this.val;
                    break;
                case ATTRIB:
                    {
                        if (prop == "class") {
                            element.classList.add.apply(element.classList, this.val.split(" "));
                        } else
                            element.setAttribute(prop, this.val);
                    }
            }
        } catch (e) {
            console.error(`Unable to process the value ${this.val}`)
            console.error(e);
        }
    }
    get _value_() { return this.val; }
    set _value_(v) {}
    get type() { return RAW_VALUEbindingID; }
    set type(v) {}
    toString() { return this.val; }
}
