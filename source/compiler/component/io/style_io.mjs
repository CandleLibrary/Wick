import spark from "@candlefw/spark";
import { IOBase, BindIO } from "./io";

function replaceString(e){
    return e[1].toUpperCase();
}

function toCamel(string){
    let str = string.replace(/(?:[-_])([a-z])/g, replaceString);
    return str;
}
/*
export class CSSRawValue {

    constructor(name, prop = null) {
        this._name_ = toCamel(name);
        this._value_ = "";

        if (Array.isArray(prop))
            this._value_ = prop.join(" ");
        else
            this._value_ = prop.toString();
    }

    get UPDATED() { return false; }
    set UPDATED(v) {}
}
*/

export class CSSRuleTemplateString {
    constructor(scope, errors, taps, binds, name) {
        this.binds = [];
        this._setBindings_(scope, errors, taps, binds);
        this.ios = [];
        this._value_ = "";
        this._name_ = toCamel(name);
    }

    destroy() {
        for (let i = 0, l = this.binds.length; i < l; i++)
            this.binds[i].destroy();
        this.binds = null;
        for (let i = 0; i < this.ios.length; i++)
            this.ios[i].destroy();
        this.ios = null;
        this._value_ = null;
        this._name_ = null;
    }

    _setBindings_(scope, errors, taps, binds) {
        for (var i = 0; i < binds.length; i++) {
            let bind = binds[i];

            switch (bind.type) {
                case 0: //DYNAMICbindingID
                    let new_bind = new BindIO(scope, errors, scope.getTap(bind.tap_name), bind)
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
        this._value_ = str.join(' ');
        for (let i = 0, l = this.ios.length; i < l; i++)
            this.ios[i]._updateRule_();
    }

    addIO(io) { this.ios.push(io); }
    removeIO(io) {
        for (let i = 0; i < this.ios.length; i++) {
            let own_io = this.ios[i];
            if (own_io == io) return void this.ios.splice(i, 1);
        }
    }
}


export class StyleIO extends IOBase {
    constructor(scope, errors, taps, element, props = []) {

        super(scope);

        this.ele = element;

        this.props = [];

        this._initializeProps_(scope, errors, taps, props);

        this.scheduledUpdate();
    }

    destroy() {
        this._template_text_ = null;
        this._rules_text_ = null;
        this.ele = null;
        this.props = null;
        super.destroy();
    }

    _setRule_(rule){
        let props = rule.props;

        this.props.length = 0;

        for (let name in props) {
            let prop = props[name];

            let wick_prop = (prop._wick_type_ > 0) ? prop.bind(this.parent, this, {}, this) : new CSSRawValue(name, prop);

            this.props.push(wick_prop);

            spark.queueUpdate(this);
        }
    }

    _initializeProps_(scope, errors, taps, props) {

        for (let i = 0, l = props.length; i < l; i++) {
            let prop = props[i];
            if (prop._wick_type_ == 1) {
                this.props.push(props[i]._bind_(scope, this, taps, this));
            } else
                this.props.push(prop);
        }
    }

    _updateRule_() { spark.queueUpdate(this); }

    get data() {}
    set data(data) { spark.queueUpdate(this); }

    scheduledUpdate() {
        for (let i = 0; i < this.props.length; i++) {
            let prop = this.props[i];
            this.ele.style[prop._name_] = prop._value_;
        }
    }
}
