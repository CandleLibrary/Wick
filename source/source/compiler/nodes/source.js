import { RootNode, BindingCSSRoot } from "./root";
import { Source } from "../../source";
import { _appendChild_, createElement } from "../../../common/short_names";
import { Tap, UpdateTap } from "../../tap/tap";
import { Template } from "../template/template_bindings";
import { ATTRIB } from "../template/basic_bindings";
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

    delegateTapBinding() {
        return null;
    }

    getCSS() {

        if (this.css)
            return this.css;

        this.css = new BindingCSSRoot();

        this.setPendingCSS(this.css);

        return this.css;
    }

    checkTapMethodGate(name, lex) {
        return this.checkTapMethod(name, lex);
    }



    /******************************************* BUILD ****************************************************/
    createElement() {
        return createElement(this.getAttribute("element") || "div");
    }
    
    build(element, source, presets, errors, taps = null, statics = null, out_ele = null) {

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

            if (bool)
                me.update_tap = me.taps[name];

            out_taps.push(me.taps[name]);
        }

        /**
         * To keep the layout of the output HTML predictable, Wick requires that a "real" HTMLElement be defined before a source object is created. 
         * If this is not the case, then a new element, defined by the "element" attribute of the source virtual tag (defaulted to a "div"), 
         * will be created to allow the source object to bind to an actual HTMLElement. 
         */
        if (!element || this.getAttribute("element")) {

            let ele = this.createElement();

            this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

            if (this.getAttribute("id"))
                ele.id = this.getAttribute("id");

            if (this.getAttribute("style"))
                ele.style = this.getAttribute("style");

            me.ele = ele;

            if (element) {
                _appendChild_(element, ele);
            }

            element = ele;

            if (out_ele)
                out_ele.ele = element;

            if (this._badge_name_)
                me.badges[this._badge_name_] = element;

            let hook = {
                attr: this.attributes,
                bindings: [],
                style: null,
                ele: element
            };

            for (let i = 0, l = this._bindings_.length; i < l; i++) {
                let attr = this._bindings_[i];
                let bind = attr.binding._bind_(me, errors, out_taps, element, attr.name);

                if (hook) {
                    if (attr.name == "style" || attr.name == "css")
                        hook.style = bind;

                    hook.bindings.push(bind);
                }
            }

            me.hooks.push(hook);
        }

        for (let i = 0, l = this.attributes.length; i < l; i++) {
            let attr = this.attributes[i];

            if (!attr.value) {
                //let value = this.par.importAttrib()
                //if(value) data[attr.name];
            } else {
                data[attr.name] = attr.value;

            }
        }

        for (let node = this.fch; node; node = this.getNextChild(node))
            node.build(element, me, presets, errors, out_taps, statics);

        if (statics) {
            me.statics = statics;
            me.update(statics);
        }


        return me;
    }

    /******************************************* HOOKS ****************************************************/

    endOfElementHook() {}

    /**
     * Pulls Schema, Model, or tap method information from the attributes of the tag. 
     * All other attributes are passed through without any other consideration.
     * @param      {string}  name    The name
     * @param      {Lexer}  lex     The lex
     * @return     {Object}  Key value pair.
     */
    processAttributeHook(name, lex, value) {
        let start = lex.off;

        switch (name[0]) {
            case "#":
                let key = name.slice(1);

                if (key.length > 0) {
                    if (lex.tl == lex.sl - lex.off && lex.ty == lex.types.num)
                        this.statics[key] = parseFloat(lex.slice());
                    else
                        this.statics[key] = lex.slice();
                }

                return null;
            case "m":
                if (name == "model") {
                    this._model_name_ = lex.slice();
                    lex.n;
                    return null;
                }
                break;
            case "s":
                if (name == "schema") {
                    this._schema_name_ = lex.slice();
                    lex.n;
                    return null;
                }
                break;
            case "c":
                if (name == "component") {
                    let component_name = lex.tx;
                    let components = this.presets.components;
                    if (components)
                        components[component_name] = this;
                    return null;
                }
                break;
            case "b":
                if (name == "badge") {
                    this._badge_name_ = lex.tx;
                    return null;
                }
                break;
            default:
                if (this.checkTapMethodGate(name, lex))
                    return null;
        }

        //return { name, value: lex.slice() };
        //return super.processAttributeHook(name, lex, value);
        if ((lex.sl - lex.off) > 0) {
            let binding = Template(lex, true);
            if (!binding) {
                return {
                    name,
                    value: lex.slice(start)
                };
            }
            binding.val = name;
            binding.method = ATTRIB;
            let attr = {
                name,
                value: (start < lex.off) ? lex.slice(start) : true,
                binding: this.processTapBinding(binding)
            };
            this._bindings_.push(attr);
            return attr;
        }

        return {
            name,
            value: lex.slice(start)
        };

    }
}