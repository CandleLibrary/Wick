import { IOBase, BindIO, TemplateString } from "./io";
import { Scheduler } from "../../common/scheduler";

export class CSSRawValue {

    constructor(name, prop = null) {
        this._name_ = name;
        this._value_ = "";

        if (Array.isArray(prop))
            this._value_ = prop.join(" ");
        else
            this._value_ = prop.toString();
    }

    get UPDATED() { return false; }
    set UPDATED(v) {}
}

export class CSSRuleTemplateString {
    constructor(source, errors, taps, binds, name) {
        this.binds = [];
        this._setBindings_(source, errors, taps, binds);
        this._ios_ = [];
        this._value_ = "";
        this._name_ = name;
    }

    _destroy_() {
        for (let i = 0, l = this.binds.length; i < l; i++)
            this.binds[i]._destroy_();
        this.binds = null;
        for (let i = 0; i < this._ios_.length; i++)
            this._ios_[i]._destroy_();
        this._ios_ = null;
        this._value_ = null;
        this._name_ = null;
    }

    _setBindings_(source, errors, taps, binds) {
        for (var i = 0; i < binds.length; i++) {
            let bind = binds[i];

            switch (bind.type) {
                case 0: //DYNAMIC_BINDING_ID
                    let new_bind = new BindIO(source, errors, source.getTap(bind.tap_name), bind)
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
        this._down_();
    }

    get data() {}
    set data(v) { Scheduler.queueUpdate(this); }

    _down_() { Scheduler.queueUpdate(this); }

    _scheduledUpdate_() {

        let str = [this._name_, ":"];

        for (let i = 0; i < this.binds.length; i++)
            str.push(this.binds[i]._value_);

        str.push(";");

        this._value_ = str.join(' ');

        for (let i = 0, l = this._ios_.length; i < l; i++)
            this._ios_[i]._updateRule_();
    }

    addIO(io) { this._ios_.push(io); }
    removeIO(io) {
        for (let i = 0; i < this._ios_.length; i++) {
            let own_io = this._ios_[i];
            if (own_io == io) return void this._ios_.splice(i, 1);
        }
    }
}


export class StyleIO extends IOBase {
    constructor(source, errors, taps, element, props = []) {

        super(source);

        this.ele = element;

        this.props = [];

        this._initializeProps_(source, errors, taps, props);

        this._scheduledUpdate_();
    }

    _destroy_() {
        this._template_text_ = null;
        this._rules_text_ = null;
        this.ele = null;
        this.props = null;
        super._destroy_();
    }

    _setRule_(rule){
        let props = rule.props;

        this.props.length = 0;

        for (let name in props) {
            let prop = props[name];

            let wick_prop = (prop._wick_type_ > 0) ? prop.bind(this.parent, [], {}, this) : new CSSRawValue(name, prop);

            this.props.push(wick_prop);

            Scheduler.queueUpdate(this);
        }
    }

    _initializeProps_(source, errors, taps, props) {

        for (let i = 0, l = props.length; i < l; i++) {
            let prop = props[i];
            if (prop._wick_type_ == 1) {
                this.props.push(props[i]._bind_(source, errors, taps, this));
            } else
                this.props.push(prop);
        }
    }

    _updateRule_() { Scheduler.queueUpdate(this); }

    get data() {}
    set data(data) { Scheduler.queueUpdate(this); }

    _scheduledUpdate_() {
        for (let i = 0; i < this.props.length; i++) {
            let prop = this.props[i];
            this.ele.style[prop._name_] = prop._value_;
        }
        return;
    }
}