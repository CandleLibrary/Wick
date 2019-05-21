import { RootNode, BindingCSSRoot, par_list } from "./root";
import { Scope } from "../../runtime/scope";
import { appendChild, createElement } from "../../../short_names";
import { Tap, UpdateTap } from "../../tap/tap";
import { Template } from "../template/template_bindings";
import { ATTRIB } from "../template/basic_bindings";
/**
 * Scope nodes are used to hook into specific Models, and respond to `update` events from that model.
 * @class      ScopeNode (name)
 */
export class ScopeNode extends RootNode {
    constructor() {
        super();
        this._model_name_ = "";
        this._schema_name_ = "";
        this._cached_ = [];
        this.element = 
    }

    merge(node) {
        const merged_node = super.merge(node);
        merged_node._model_name_ = this._model_name_;
        merged_node._schema_name_ = this._schema_name_;
        merged_node._cached_ = this._cached_;
    }

    pushChached(scope) {
        this._cached_.push(scope)
    }

    popCached() {
        this._cached_.pop();
    }

    getCachedScope() {
        return this._cached_[this._cached_.length - 1];
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
        return this.checkTapMethod(name, lex, true);
    }



    /******************************************* BUILD ****************************************************/
    createElement() {
        let attr = this.getAttrib("element", true);
        return createElement(attr ? attr.value : "div");
    }

    build(element, scope, presets, errors, taps = null, statics = {},  RENDER_ALL = false) {

        let data = {};

        let out_taps = [];

        let me = new Scope(scope, this.__presets__ || presets || this.presets, element, this);

        this.pushChached(me);

        me._model_name_ = this._model_name_;
        me._schema_name_ = this._schema_name_;

        let tap_list = this.tap_list;

        for (let i = 0, l = tap_list.length; i < l; i++) {
            let tap = tap_list[i],
                name = tap.name;

            let bool = name == "update";

            me.taps[name] = bool ? new UpdateTap(me, name, tap.modes) : new Tap(me, name, tap.modes);

            if (bool)
                me.update_tap = me.taps[name];

            out_taps.push(me.taps[name]);
        }

        /**
         * To keep the layout of the output HTML predictable, Wick requires that a "real" HTMLElement be defined before a scope object is created. 
         * If this is not the case, then a new element, defined by the "element" attribute of the scope virtual tag (defaulted to a "div"), 
         * will be created to allow the scope object to bind to an actual HTMLElement. 
         */

        if (!element || this.getAttrib("element", true)) {

            let ele = this.createElement();

            this.class.split(" ").map(c => c ? ele.classList.add(c) : {});

            if (this.getAttribute("id"))
                ele.id = this.getAttribute("id");

            if (this.getAttribute("style"))
                ele.style = this.getAttribute("style");

            me.ele = ele;

            if (element) {
                appendChild(element, ele);
            }

            element = ele;

            if (this._badge_name_)
                me.badges[this._badge_name_] = element;

            let hook = {
                attr: this.attributes,
                bindings: [],
                style: null,
                ele: element
            };

            for (let i = 0, l = this.bindings.length; i < l; i++) {
                let attr = this.bindings[i];
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
            } else
                data[attr.name] = attr.value;
        }

        if (this.url || this.__statics__) {
            statics = Object.assign(statics, this.__statics__);
            statics.url = this.url;
        }

        par_list.push(this)

        for (let node = this.fch; node; node = this.getNextChild(node))
            node.build(element, me, presets, errors, out_taps, statics, null, RENDER_ALL);

        par_list.pop()


        if (statics || this.__statics__) {
            let s = Object.assign({}, statics ? statics : {}, this.__statics__);
            me.statics = s;
            me.update(me.statics);
        }

        this.popCached(me);

        return me;
    }

    /******************************************* HOOKS ****************************************************/

    endOfElementHook() { if(!this.__presets__) {this.presets = this.presets; } ;return this }

    /**
     * Pulls Schema, Model, or tap method information from the attributes of the tag. 
     * All other attributes are passed through without any other consideration.
     * @param      {string}  name    The name
     * @param      {Lexer}  lex     The lex
     * @return     {Object}  Key value pair.
     */
    processAttributeHook(name, lex, value) {

        let start = lex.off,
            basic = {
                IGNORE: true,
                name,
                value: lex.slice(start)
            };

        switch (name[0]) {
            case "#":
                let key = name.slice(1);

                if (key.length > 0) {
                    if (lex.tl == lex.sl - lex.off && lex.ty == lex.types.num)
                        this.statics[key] = parseFloat(lex.slice());
                    else
                        this.statics[key] = lex.slice();
                }

                return {
                    name,
                    value: lex.slice(start)
                };
            case "m":
                if (name == "model") {
                    this._model_name_ = lex.slice();
                    lex.n;
                    return basic;
                }
                break;
            case "s":
                if (name == "schema") {
                    this._schema_name_ = lex.slice();
                    lex.n;
                    return basic;
                }



                if (name == "slot" && this.par) {
                    this.par.statics.slots[basic.value] = this;
                    return basic;
                }
                break;
            case "c":
                if (name == "component") {
                    
                    let component_name = lex.tx;
                    let components = this.presets.components;
                    if (components)
                        components[component_name] = this;
                    return basic;
                }
                break;

            case "b":
                if (name == "badge") {
                    this._badge_name_ = lex.tx;
                    return basic;
                }
                break;

            case "e":
                if (name == "element") 
                    return basic;

            default:
                if (this.checkTapMethodGate(name, lex))
                    return basic;
        }

        //return { name, value: lex.slice() };
        //return super.processAttributeHook(name, lex, value);
        basic.IGNORE = false;

        if ((lex.sl - lex.off) > 0) {
            let binding = Template(lex, true);

            if (!binding)
                return basic;



            //}
            //binding.val = name;
            binding.attrib = name;
            binding.method = ATTRIB;

            let attr = {
                IGNORE: false,
                name,
                value: (start < lex.off) ? lex.slice(start) : true,
                binding: this.processTapBinding(binding)
            };

            this.bindings.push(attr);

            return attr;
        }

        return basic;

    }
}
