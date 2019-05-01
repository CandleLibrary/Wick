import { HTMLNode, TextNode } from "@candlefw/html";
import { CSSRootNode } from "@candlefw/css";
import { Plugin } from "../../../plugin.mjs";
import {
    appendChild,
    createElement
} from "../../../short_names";
import {
    Scope
} from "../../runtime/scope.mjs";

import {
    KEEP,
    IMPORT,
    EXPORT,
    PUT
} from "../../tap/tap";
import {
    Template,
    StyleTemplate,
    CSSRuleTemplate
} from "../template/template_bindings";
import {
    ATTRIB,
    TEXT,
    INPUT,
    EVENT,
    BOOL,
    DYNAMICbindingID,
    TEMPLATEbindingID
} from "../template/basic_bindings";


import {
    barrier_a_start,
    barrier_b_start
} from "../../../barriers";

import whind from "@candlefw//whind"

export const par_list = [];

export class BindingCSSRoot extends CSSRootNode {
    getPropertyHook(value_lex, prop_name, rule) {

        //looking for binding points
        let pk = value_lex.copy();
        while (!pk.END && ((pk.ch != barrier_a_start || (pk.n.ch != barrier_a_start && pk.ch != barrier_b_start)))) {
            pk.n;
        }

        if (pk.END)
            return false;

        rule.props[prop_name] = CSSRuleTemplate(value_lex, prop_name);

        return true;
    }
}

export class RootText extends TextNode {
    constructor(binding) {
        super("");
        binding.method = TEXT;
        this.binding = binding;
    }

    build(element, scope, presets, errors, taps, statics) {
        let ele = document.createTextNode(this.txt);
        this.binding._bind_(scope, errors, taps, ele, "", this, statics);
        appendChild(element, ele);
    }

    linkCSS() {}

    toString(off = 0) {
        return `${("    ").repeat(off)}${this.binding}\n`;
    }
}

var M = null;
/**
 * Class for Root HTML AST Node.
 *@memberof module:wick~internals.templateCompiler
 *@alias Root
 */
export class RootNode extends HTMLNode {

    constructor() {
        super();
        this.HAS_TAPS = false;

        this.tap_list = [];
        this.bindings = [];

        this.css = null;

        this.merged = false;
        this.SLOTED = false;

        this._badge_name_ = "";

        this.__presets__ = null;
        this.__statics__ = null;
    }

    /******************************************* ERROR ****************************************************/

    getURL(index) {
        if (this.url)
            return this.url;
        if (par_list[index])
            return par_list[index].getURL(index - 1);
        return null;
    }

    /******************************************* STATICS ****************************************************/

    get statics() {

        if (this.__statics__) return this.__statics__;

        if (this.par)
            return (this.__statics__ = Object.assign({}, this.par.statics, { slots: {} }));
        return (this.__statics__ = { slots: {} });
    }

    set statics(statics) {
        //this.__statics__ = statics;
    }

    /******************************************* PRESETS ****************************************************/

    get presets() {
        if (this.__presets__) return this.__presets__;
        return this.par.presets;
    }

    set presets(preset) {
        this.__presets__ = preset;
    }

    /****************************************** COMPONENTIZATION *****************************************/

    mergeComponent() {

        if (this.presets.components) {
            let component = this.presets.components[this.tag];

            if (component) {
                return component.merge(this);
            }
        }

        return this;
    }

    merge(node) {

        const merged_node = new this.constructor()
        merged_node.line = this.line;
        merged_node.char = this.char;
        merged_node.offset = this.offset;
        merged_node.single = this.single;
        merged_node.url = this.url;
        merged_node.tag = this.tag;
        merged_node.fch = (node.fch || this.fch) ? new MergerNode(this.children, node.children) : null;
        merged_node.css = this.css;
        merged_node.HAS_TAPS = this.HAS_TAPS;
        merged_node.merged = true;
        merged_node._badge_name_ = node._badge_name_;
        merged_node.__presets__ = this.presets;
        merged_node.par = node.par;

        if (this.tap_list)
            merged_node.tap_list = this.tap_list.map(e => Object.assign({}, e));


        this.attributes.forEach(e => {
            if(e.name == "component") return; //Prevent this from changing the global static value.
            merged_node.processAttributeHook(e.name, whind(e.value))
        });

        node.attributes.forEach(e => merged_node.processAttributeHook(e.name, whind(e.value)))
        merged_node.attributes = merged_node.attributes.concat(this.attributes, node.attributes)

        merged_node.__statics__ = node.__statics__;

        //merged_node.attributes = this.attributes.slice();
        return merged_node;
    }

    /******************************************* CSS ****************************************************/

    linkCSS(css, win = window) {

        if (this.css)
            css = this.css;

        if (css) {

            let rule;


            for (let i = 0; i < css.length; i++)
                rule = css[i].getApplicableRules(this, rule, win);


            //parse rules and createBindings.
            if (rule && rule.LOADED) {


                //Link into the binding for style. if there is no binding, create one. 
                //Link in the rule properties to the tap system. 
                let HAVE_BINDING = false;

                for (let i = 0, l = this.bindings.length; i < l; i++) {
                    let binding = this.bindings[i];

                    if (binding.name == "css") {
                        binding.binding.clear();
                        HAVE_BINDING = (binding.binding._addRule_(rule), true);
                    }
                }

                if (!HAVE_BINDING) {
                    let binding = StyleTemplate();
                    binding._addRule_(rule);
                    let vals = {
                        name: "css",
                        value: "",
                        binding
                    };
                    this.bindings.push(vals);

                }

                this.css = css;
            }
        }

        for (let node = this.fch; node; node = this.getNextChild(node))
            node.linkCSS(css, win);
    }

    setPendingCSS(css, par = this.par) {
        if (par)
            par.setPendingCSS(css, par.par);
        else {
            if (!this.css)
                this.css = [];
            this.css.push(css);
        }
    }

    getCSS(par = this.par) {

        let css = new BindingCSSRoot();

        this.setPendingCSS(css, par);

        return css;
    }

    get classList() {
        let classes = this.getAttrib("class");
        if (classes) {
            if (typeof(classes.value) == "string")
                return classes.value.split(" ");
            else
                return classes.value.val.split(" ");
        }
        return [];
    }

    /******************************************* TAPS ****************************************************/


    getTap(tap_name) {
        this.HAS_TAPS = true;
        const l = this.tap_list.length;
        for (let i = 0; i < l; i++)
            if (this.tap_list[i].name == tap_name)
                return this.tap_list[i];
        const tap = {
            name: tap_name,
            id: l,
            modes: 0
        };
        this.tap_list.push(tap);
        return tap;
    }

    checkTapMethod(name, lex, OVERRIDE = false) {
        if (this.par && !OVERRIDE) return false;

        let tap_mode = KEEP; // Puts

        let SET_TAP_METHOD = false;

        switch (name[0]) {
            case "i": // Imports data updates, messages - valid on scope and top level objects.
                if (name === "import") {
                    SET_TAP_METHOD = true;
                    tap_mode |= IMPORT;
                }
                break;
            case "e": // Exports data updates, messages - valid on scopes and top level objects.
                if (name === "export") {
                    SET_TAP_METHOD = true;
                    tap_mode |= EXPORT;
                }
                break;
            case "p": // Pushes updates to model
                if (name === "put") {
                    SET_TAP_METHOD = true;
                    tap_mode |= PUT;
                }
        }

        if (SET_TAP_METHOD) {

            while (!lex.END) {

                this.getTap(lex.tx).modes |= tap_mode;

                lex.n;
            }

            return true;
        }
    }

    checkTapMethodGate(name, lex) {

        if (!this.par)
            return this.checkTapMethod(name, lex);

        return false;
    }

    linkTapBinding(binding) {

        binding.tap_id = this.getTap(binding.tap_name).id;
    }

    delegateTapBinding(binding, tap_mode) {

        if (this.par)
            return this.par.processTapBinding(binding, tap_mode);

        return null;
    }

    processTapBinding(binding, tap_mode = 0) {

        if (this.delegateTapBinding(binding, tap_mode)) return binding;

        if (binding.type === TEMPLATEbindingID) {

            let bindings = binding.bindings;

            for (let i = 0, l = bindings.length; i < l; i++)
                if (bindings[i].type === DYNAMICbindingID)
                    this.linkTapBinding(bindings[i]);

        } else if (binding.type === DYNAMICbindingID)
            this.linkTapBinding(binding);

        return binding;
    }



    /******************************************* BUILD ****************************************************/

    getCachedScope() {
        if (this.par)
            return this.par.getCachedScope();
        return null;
    }

    setScope(scope) {
        scope.ast = this;
    }

    /**
     * Builds Scope Graph and Dom Tree.
     */
    build(element, scope, presets, errors, taps, statics, RENDER_ALL = false) {

        let out_statics = statics;

        if (this.url || this.__statics__){
            out_statics = Object.assign({}, statics, this.__statics__, { url: this.getURL(par_list.length - 1) });
        }

        const own_element = this.createElement(presets, scope);

        if (!scope)
            scope = new Scope(null, presets || this.__presets__ || this.presets, own_element, this);

        if (this.HAS_TAPS)
            taps = scope.linkTaps(this.tap_list);

        if (own_element) {

            if (!scope.ele) scope.ele = own_element;

            if (this._badge_name_)
                scope.badges[this._badge_name_] = own_element;

            if (element) appendChild(element, own_element);

            for (let i = 0, l = this.bindings.length; i < l; i++) {
                let attr = this.bindings[i];
                attr.binding._bind_(scope, errors, taps, own_element, attr.name, this, statics);
            }
        }

        const ele = own_element ? own_element : element

        par_list.push(this);

        for (let node = this.fch; node; node = this.getNextChild(node))
            node.build(ele, scope, presets, errors, taps, out_statics, RENDER_ALL);

        par_list.pop();

        return scope;
    }


    /******************************************* HOOKS ****************************************************/

    /**
     * Override this method to tell the parser that `tag` is self closing and to not look for a matching close tag by returning `true`.
     * @param      {string}  tag     The HTML tag
     */
    selfClosingTagHook(tag) {
        switch (tag) {
            case "input":
            case "br":
            case "img":
            case "import":
            case "link":
            case "f":
            case "filter":
                return true;
        }

        return false;
    }

    createElement() {
        return createElement(this.tag);
    }

    async endOfElementHook() {
        await super.endOfElementHook();
        return this.mergeComponent();
    }


    /**
     * This will create TAP binding references and methods, binding points, and regular attribute nodes.
     * @param      {<type>}  name    The Attribute name
     * @param      {Lexer}  lex     The lexer containing the attribute value.
     * @return     {Object}  `null` or an object to store in this nodes attributes
     * @private
     */
    processAttributeHook(name, lex) {
        
        if (!name) return null;

        let start = lex.off,
            basic = {
                IGNORE: true,
                name,
                value: lex.slice(start)
            };

        let bind_method = ATTRIB,
            FOR_EVENT = false;

        switch (name[0]) {

            case "#": //Static values
                let key = name.slice(1);

                if (key.length > 0) {
                    if (lex.tl == lex.sl - lex.off && lex.ty == lex.types.num)
                        this.statics[key] = parseFloat(lex.slice());
                    else
                        this.statics[key] = lex.slice();
                }

                return basic;

            case "v": //Input
                if (name == "value")
                    bind_method = INPUT;
                break;


            case "o": // Event Messaging linking
                if (name[1] == "n") {
                    FOR_EVENT = true;
                    bind_method = EVENT;
                }
                break;

            case "c":
                if (name == "component") {
                    let component_name = lex.tx;

                    if (this.presets.components)
                        this.presets.components[component_name] = this;

                    return basic;
                }
                break;
            case "b":
                if (name == "badge") {
                    this._badge_name_ = lex.tx;
                    return basic;
                }
            case "s":
                if (name == "showif") {
                    bind_method = BOOL;
                    break;
                }

                if (name == "slot" && this.par) {
                    this.par.statics.slots[basic.value] = this;
                    return basic;
                }
        }

        if (this.checkTapMethodGate(name, lex))
            return basic.IGNORE = false, basic;

        basic.IGNORE = false;

        if ((lex.sl - lex.off) > 0) {
            let binding = Template(lex, FOR_EVENT);
            if (!binding) {
                return basic;
            }

            binding.attrib = name;
            binding.method = bind_method;
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



    /**
     * Hooks into the Text Node creation context and looks for binding points. 
     * If they are found, the text node will be made dynamic.
     * @param      {Lexer}    
     * @return     {TextNode}  
     */
    async processTextNodeHook(lex) {
        if (lex.sl - lex.pos > 0) {
            //let binding = Template(lex.trim());

            //lex = whind(await Plugin.parseInnerHTMLonTag(this.tag, lex.trim(1).slice()), true)

            let binding = Template(lex);
            if (binding)
                return new RootText(this.processTapBinding(binding));
        }

        return null;
    }
}


//Node that allows the combination of two sets of children from separate nodes that are merged together
export class MergerNode extends RootNode {
    constructor(...children_arrays) {
        super();

        this.c = [];

        for (let i=0,l = children_arrays.length; i<l; i++)
            if(Array.isArray(children_arrays))
                this.c = this.c.concat(children_arrays[i]);
    }

    build(element, scope, presets, errors, taps, statics, RENDER_ONLY) {
        for (let i=0,l = this.c.length; i<l; i++){
            if(this.c[i].SLOTED == true) continue;
            this.c[i].build(element, scope, presets, errors, taps, statics, RENDER_ONLY);
        }

        return scope;
    }


    linkCSS() {}

    toString(off = 0) {
        return `${("    ").repeat(off)}${this.binding}\n`;
    }
}
