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
    RAW_VALUE_BINDING_ID,
    TEMPLATE_BINDING_ID,
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
    this._bindings_ = binds;
}

OutTemplate.prototype = {
    method: 0,

    attr: "",

    _bindings_: null,

    _bind_: function(source, errors, taps, element, attr) {
        if (this.method == ATTRIB || this.method == INPUT)
            return new AttribTemplate(source, errors, taps, attr, element, this._bindings_);
        return new TemplateString(source, errors, taps, element, this._bindings_);
    },

    _appendText_: function(string) {
        let binding = this._bindings_[this._bindings_.length - 1];

        if (binding && binding.type == RAW_VALUE_BINDING_ID) {
            binding.txt += string;
        } else {
            this._bindings_.push(new RawValueBinding(string));
        }
    },

    set type(v) {},
    get type() {
        return TEMPLATE_BINDING_ID;
    },

    toString(){
        let str = ""
        for(let i = 0; i < this._bindings_.length; i++)
            str += this._bindings_[i];
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

    get _bindings_() {
        if (this._template_)
            return this._template_._bindings_;
        return [];
    }
    set _bindings_(v) {}

    get type() {
        return TEMPLATE_BINDING_ID;
    }
    set type(v) {}

    clear(){
        this._css_props_ = [];
    }

    _addRule_(rule) {

        let props = rule.props;

        for (let name in props) {
            let prop = props[name];

            if (prop._wick_type_ > 0)
                this._css_props_.push(prop);
            else 
                this._css_props_.push(new CSSRawValue(name, prop));
        }
    }

    _bind_(source, errors, taps, element) {
        return new StyleIO(source, errors, taps, element, this._css_props_);
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

        this._bindings_ = bindings;
    }

    get _wick_type_() {
        return 1;
    }
    set _wick_type_(v) {}

    _bind_(source, errors, taps, io) {
        let binding = new CSSRuleTemplateString(source, errors, taps, this._bindings_, this.prop_name);
        binding.addIO(io);
        return binding;
    }
}