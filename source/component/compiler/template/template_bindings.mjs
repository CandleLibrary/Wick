import {
    TemplateString,
    AttribTemplate,
} from "../../io/io";
import {
    CSSRawValue,
    CSSRuleTemplateString,
    StyleIO
} from "../../io/style_io";
import {
    RAW_VALUEbindingID,
    TEMPLATEbindingID,
    ATTRIB,
    INPUT,
    RawValueBinding
} from "./basic_bindings";
import {
    evaluate
} from "./template_evaluator";

export function Template(lex, FOR_EVENT) {
    let binds = evaluate(lex, FOR_EVENT);
    if (binds.length > 0) {
    if (binds.length == 1)
            return binds[0];
        return new OutTemplate(binds);
    }
    return null;
}

function OutTemplate(binds = []) {
    this.bindings = binds;
}

OutTemplate.prototype = {
    method: 0,

    attr: "",

    bindings: null,

    _bind_: function(scope, errors, taps, element, attr) {

        if (this.method == ATTRIB || this.method == INPUT)
            return new AttribTemplate(scope, errors, taps, attr, element, this.bindings);
        return new TemplateString(scope, errors, taps, element, this.bindings);
    },

    _appendText_: function(string) {
        let binding = this.bindings[this.bindings.length - 1];

        if (binding && binding.type == RAW_VALUEbindingID) {
            binding.val += string;
        } else {
            this.bindings.push(new RawValueBinding(string));
        }
    },

    set type(v) {},
    get type() {
        return TEMPLATEbindingID;
    },

    toString(){
        let str = ""
        for(let i = 0; i < this.bindings.length; i++)
            str += this.bindings[i];
        return str;
    }
};


export function StyleTemplate(lex) {

    const style = new OutStyleTemplate();
    if(lex){

    }
    return style;
}

class OutStyleTemplate {

    constructor() {
        this._css_props_ = [];
    }

    get bindings() {
        if (this._template_)
            return this._template_.bindings;
        return [];
    }
    set bindings(v) {}

    get type() {
        return TEMPLATEbindingID;
    }
    set type(v) {}

    clear(){
        this._css_props_ = [];
    }

    _addRule_(rule) {

        let props = rule.props;

        for (let name in props) {
            let prop = props[name];

            if(prop == null) continue;

            if (prop._wick_type_ > 0)
                this._css_props_.push(prop);
            else 
                this._css_props_.push(new CSSRawValue(name, prop));
        }
    }

    _bind_(scope, errors, taps, element) {
        return new StyleIO(scope, errors, taps, element, this._css_props_);
    }
}

export function CSSRuleTemplate(lex, prop_name) {
    return new OutCSSRuleTemplate(lex, prop_name);
}

class OutCSSRuleTemplate {
    constructor(lex = null, prop_name = "") {
        let bindings = evaluate(lex);

        this.binding = null;

        this.prop_name = prop_name;

        this.bindings = bindings;
    }

    get _wick_type_() {
        return 1;
    }
    set _wick_type_(v) {}

    _bind_(scope, errors, taps, io) {
        let binding = new CSSRuleTemplateString(scope, errors, taps, this.bindings, this.prop_name);
        binding.addIO(io);
        return binding;
    }
}
