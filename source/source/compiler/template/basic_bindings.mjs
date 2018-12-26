import { ExpressionIO, InputExpresionIO } from "../../io/expression_io";
import { EventIO } from "../../io/event_io";
import { ScriptIO } from "../../io/script_io";
import { IO, AttribIO, InputIO } from "../../io/io";

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

/**
 * Binding builder for expressions
 *
 * @class      ExpressionBinding (name)
 */
export class EventBinding {
    constructor(prop) {
        this.bind = null;
        this._event_ = prop;
    }

    _bind_(source, errors, taps, element, eventname) {
        return new EventIO(source, errors, taps, element, eventname, this._event_, this.bind);
    }

    get bindings() {
        if (this.bind) {
            if (this.bind.type == TEMPLATEbindingID)
                return [...this.bind.bindings, this._event_];
            else
                return [this.bind, this._event_];
        }
        return [this._event_];
    }
    set bindings(v) {}

    get type() {
        return TEMPLATEbindingID;
    }
    set type(v) {}
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
    }

    _bind_(source, errors, taps, element) {
        
        switch (this.method) {
            case INPUT:
                return new InputExpresionIO(source, errors, taps, element, this.bindings, this.func);
            default:
                return new ExpressionIO(source, errors, taps, element, this.bindings, this.func);
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
    }

    _bind_(source, errors, taps, element) {
        let tap = source.getTap(this.tap_name); //taps[this.tap_id];
        switch (this.method) {
            case INPUT:
                return new InputIO(source, errors, tap, element);
            case ATTRIB:
                return new AttribIO(source, errors, tap, this.val, element);
            case SCRIPT:
                return new ScriptIO(source, errors, tap, this);
            default:
                return new IO(source, errors, tap, element);
        }
    }

    get type() {
        return DYNAMICbindingID;
    }
    set type(v) {}

    toString(){return `((${this.tap_name}))`;}
}

export class RawValueBinding {
    constructor(txt) {
        this.txt = txt;
        this.method = 0;
    }

    _bind_(source, errors, taps, element, prop = "") {

        switch (this.method) {
            case TEXT:
                element.data = this.txt;
                break;
            case ATTRIB:{
                if(prop == "class"){
                    element.classList.add.apply(element.classList, this.txt.split(" "));
                }else
                    element.setAttribute(prop, this.txt);
            }
        }
    }
    get _value_() { return this.txt; }
    set _value_(v) {}
    get type() { return RAW_VALUEbindingID; }
    set type(v) {}
    toString(){return this.txt;}
}