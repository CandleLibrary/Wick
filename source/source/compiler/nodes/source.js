import { RootNode, BindingCSSRoot } from "./root";
import { Source } from "../../source";
import { Tap, UpdateTap } from "../../tap/tap";

/**
 * Source nodes are used to hook into specific Models, and respond to `update` events from that model.
 * @class      SourceNode (name)
 */
export class SourceNode extends RootNode {
    constructor() {
        super();
        this._model_name_ = "";
        this._schema_name_ = "";
        this.statics = {};
    }

    _delegateTapBinding_() {
        return null;
    }

    _getCSS_() {

        if (this.css)
            return this.css;

        this.css = new BindingCSSRoot();

        this._setPendingCSS_(this.css);

        return this.css;
    }

    _checkTapMethodGate_(name, lex) {
        return this._checkTapMethod_(name, lex);
    }

    /******************************************* BUILD ****************************************************/

    _build_(element, source, presets, errors, taps = null, statics = null) {

        let data = {};

        let out_taps = [];

        let me = new Source(source, presets, element, this);

        me._model_name_ = this._model_name_;
        me._schema_name_ = this._schema_name_;

        let tap_list = this.tap_list;

        for (let i = 0, l = tap_list.length; i < l; i++) {
            let tap = tap_list[i],
                name = tap.name;

            let bool = name == "update";

            me.taps[name] = bool ? new UpdateTap(me, name, tap._modes_) : new Tap(me, name, tap._modes_);

            if(bool)
                me.update_tap = me.taps[name];
            
            out_taps.push(me.taps[name]);

        }

        for (let i = 0, l = this._attributes_.length; i < l; i++) {
            let attr = this._attributes_[i];

            if (!attr.value) {
                //let value = this.par.importAttrib()
                //if(value) data[attr.name];
            } else {
                data[attr.name] = attr.value;

            }
        }

        for (let node = this.fch; node; node = this.getN(node))
            node._build_(element, me, presets, errors, out_taps, statics);

        if (statics) {
            me._statics_ = statics;
            me._update_(statics);
        }


        return me;
    }

    /******************************************* HOOKS ****************************************************/

    _endOfElementHook_() {}

    /**
     * Pulls Schema, Model, or tap method information from the attributes of the tag. 
     * All other attributes are passed through without any other consideration.
     * @param      {string}  name    The name
     * @param      {Lexer}  lex     The lex
     * @return     {Object}  Key value pair.
     */
    _processAttributeHook_(name, lex, value) {
        switch (name[0]) {
            case "#":
                return null;
            case "m":
                if (name == "model") {
                    this._model_name_ = lex.slice();
                    lex.n();
                }
                break;
            case "s":
                if (name == "schema") {
                    this._schema_name_ = lex.slice();
                    lex.n();
                }
                break;
            case "c":
                if (name == "component") {
                    let component_name = lex.tx;
                    let components = this._presets_.components;
                    if (components)
                        components[component_name] = this;
                    return null;
                }
                break;
            default:
                if (this._checkTapMethodGate_(name, lex))
                    return null;
        }

        return { name, value: lex.slice() };
    }
}