import {
    _appendChild_,
    _createElement_
} from "../../../common/short_names";
import {
    Source
} from "../../source";
import {
    HTMLNode,
    TextNode
} from "../../../common/html/root";
import {
    CSSRootNode
} from "../../../common/css/root";
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
    DYNAMIC_BINDING_ID,
    TEMPLATE_BINDING_ID
} from "../template/basic_bindings";
import {
    barrier_a_start,
    barrier_b_start
} from "../../../root/config/global";

export class BindingCSSRoot extends CSSRootNode {
    _getPropertyHook_(value_lex, prop_name, rule) {

        //looking for binding points
        let pk = value_lex.copy();
        while (!pk.END && ((pk.ch != barrier_a_start || (pk.n().ch != barrier_a_start && pk.ch != barrier_b_start)))) {
            pk.n();
        }

        if (pk.END)
            return false;

        rule.props[prop_name] = CSSRuleTemplate(value_lex, prop_name);

        return true;
    }
}

class RootText extends TextNode {
    constructor(binding) {
        super("");
        binding.method = TEXT;
        this.binding = binding;
    }

    _build_(element, source, presets, errors, taps) {
        let ele = document.createTextNode(this.txt);
        this.binding._bind_(source, errors, taps, ele);
        _appendChild_(element, ele);
    }

    _linkCSS_() {}
}


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
        this._bindings_ = [];

        this.pending_css = [];
        this.css = null;
        this._merged_ = false;

        this.__presets__ = null;
        this.__statics__ = null;
    }

    /******************************************* STATICS ****************************************************/



    get _statics_() {
        if (this.__statics__) return this.__statics__;

        if (this.par)
            return (this.__statics__ = Object.assign({}, this.par._statics_));

        return (this.__statics__ = {});
    }

    set _statics_(statics) {
        this.__statics__ = statics;
    }

    /******************************************* PRESETS ****************************************************/

    get _presets_() {
        if (this.__presets__) return this.__presets__;
        return this.par._presets_;
    }

    set _presets_(preset) {
        this.__presets__ = preset;
    }

    /****************************************** COMPONENTIZATION *****************************************/



    _mergeComponent_() {
        let component = this._presets_.components[this.tag];

        if (component)
            this._merged_ = component;

    }



    /******************************************* CSS ****************************************************/

    _setCSS_() {}

    _linkCSS_(css) {

        if (this.css)
            css = this.css;

        //parse rules and createBindings.
        if (css) {

            let rule = css.getApplicableRules(this);

            if (rule.LOADED) {

                //Link into the binding for style. if there is no binding, create one. 
                //Link in the rule properties to the tap system. 
                let HAVE_BINDING = false;

                for (let i = 0, l = this._attributes_.length; i < l; i++) {
                    let binding = this._attributes_[i];

                    if (binding.name == "css")
                        HAVE_BINDING = (binding.binding._addRule_(rule), true);
                }

                if (!HAVE_BINDING) {
                    let binding = StyleTemplate();
                    binding._addRule_(rule);
                    let vals = {
                        name: "css",
                        value: "",
                        binding
                    };
                    this._bindings_.push(vals);
                }
            }
        }

        for (let node = this.fch; node; node = this.getN(node))
            node._linkCSS_(css);
    }

    _setPendingCSS_(css) {
        if (this.par)
            this.par._setPendingCSS_(css);
        else
            this.pending_css.push(css);
    }

    _getCSS_() {

        if (this.par)
            return this.par._getCSS_();

        if (this.css)
            return this.css;

        this.css = new BindingCSSRoot();

        this._setPendingCSS_(this.css);

        return this.css;
    }

    get classList() {
        let classes = this.getAttrib("class");
        if (classes) {
            if (typeof(classes.value) == "string")
                return classes.value.split(" ");
            else
                return classes.value.txt.split(" ");
        }
        return [];
    }

    /******************************************* TAPS ****************************************************/


    _getTap_(tap_name) {
        this.HAS_TAPS = true;
        const l = this.tap_list.length;
        for (let i = 0; i < l; i++)
            if (this.tap_list[i].name == tap_name)
                return this.tap_list[i];
        const tap = {
            name: tap_name,
            id: l,
            _modes_: 0
        };
        this.tap_list.push(tap);
        return tap;
    }



    _checkTapMethod_(name, lex) {

        let tap_mode = KEEP; // Puts

        let SET_TAP_METHOD = false;

        switch (name[0]) {
            case "i": // Imports data updates, messages - valid on source and top level objects.
                if (name === "import") {
                    SET_TAP_METHOD = true;
                    tap_mode |= IMPORT;
                }
                break;
            case "e": // Exports data updates, messages - valid on sources and top level objects.
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

                this._getTap_(lex.tx)._modes_ |= tap_mode;

                lex.n();
            }

            return true;
        }
    }



    _checkTapMethodGate_(name, lex) {

        if (!this.par)
            return this._checkTapMethod_(name, lex);
        return false;
    }



    _linkTapBinding_(binding) {

        binding.tap_id = this._getTap_(binding.tap_name).id;
    }



    _delegateTapBinding_(binding, tap_mode) {

        if (this.par)
            return this.par._processTapBinding_(binding, tap_mode);

        return null;
    }



    _processTapBinding_(binding, tap_mode = 0) {

        if (this._delegateTapBinding_(binding, tap_mode)) return binding;

        if (binding.type === TEMPLATE_BINDING_ID) {

            let _bindings_ = binding._bindings_;

            for (let i = 0, l = _bindings_.length; i < l; i++)
                if (_bindings_[i].type === DYNAMIC_BINDING_ID)
                    this._linkTapBinding_(_bindings_[i]);

        } else if (binding.type === DYNAMIC_BINDING_ID)
            this._linkTapBinding_(binding);

        return binding;
    }



    /******************************************* BUILD ****************************************************/



    /**
     * Builds Source Tree and Dom Tree.
     *
     * @param      {null}  element  The element
     * @param      {null}  source   The source
     * @param      {null}  presets  The presets
     * @param      {null   errors   The errors
     * @param      {null}  model    The model
     * @return     {null}  { description_of_the_return_value }
     */
    _build_(element, source, presets, errors, taps, statics) {

        const out_statics = this.__statics__ || statics;

        if (this._merged_) return this._merged_._build_(element, source, presets, errors, taps, out_statics);

        source = source || new Source(null, presets, element, this);

        if (this.HAS_TAPS)
            taps = source._linkTaps_(this.tap_list);

        let own_element = this._createElement_();

        if (own_element) {
            let hook = null;

            if (this._bindings_.length > 0) {
                hook = {
                    attr: this.attributes,
                    bindings: [],
                    style: null,
                    ele: own_element
                };
            }

            source.hooks.push(hook);

            for (let i = 0, l = this._bindings_.length; i < l; i++) {
                let attr = this._bindings_[i];
                let bind = attr.binding._bind_(source, errors, taps, own_element, attr.name);
                if (hook) {
                    if (attr.name == "style" || attr.name == "css")
                        hook.style = bind;

                    hook.bindings.push(bind);
                }
            }

            for (let node = this.fch; node; node = this.getN(node))
                node._build_(own_element, source, presets, errors, taps, out_statics);

            _appendChild_(element, own_element);

        } else {
            for (let node = this.fch; node;
                (node = this.getN(node))) {
                node._build_(element, source, presets, errors, taps, out_statics);
            }
        }

        return source;
    }



    /******************************************* HOOKS ****************************************************/

    /**
     * Override this method to tell the parser that `tag` is self closing and to not look for a matching close tag by returning `true`.
     * @param      {string}  tag     The HTML tag
     */
    _selfClosingTagHook_(tag) {
        switch (tag) {
            case "input":
            case "br":
            case "img":
            case "import":
                return true;
        }

        return false;
    }

    _createElement_() {
        return _createElement_(this.tag);
    }

    _endOfElementHook_() {
        if (!this.fch) {
            this._mergeComponent_();
        }
    }


    /**
     * This will create TAP binding references and methods, binding points, and regular attribute nodes.
     * @param      {<type>}  name    The name
     * @param      {Lexer}  lex     The lex
     * @return     {Object}  `null` or an object to store in this nodes attributes
     * @private
     */
    _processAttributeHook_(name, lex) {

        let start = lex.off;

        let bind_method = ATTRIB,
            FOR_EVENT = false;

        let constr = Template;

        switch (name[0]) {

            case "#": //Static values
                let key = name.slice(1);

                if (key.length > 0) {
                    if (lex.tl == lex.sl - lex.off && lex.ty == lex.types.num)
                        this._statics_[key] = parseFloat(lex.slice());
                    else
                        this._statics_[key] = lex.slice();
                }

                return null;

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
                    let components = this._presets_.components;
                    if (components)
                        components[component_name] = this;
                    return null;
                }

        }

        if (this._checkTapMethodGate_(name, lex))
            return null;

        if ((lex.sl - lex.off) > 0) {
            let binding = constr(lex, FOR_EVENT);
            if (!binding) {
                return {
                    name,
                    value: lex.slice(start)
                };
            }

            binding.val = name;
            binding.method = bind_method;
            let attr = {
                name,
                value: (start < lex.off) ? lex.slice(start) : true,
                binding: this._processTapBinding_(binding)
            };
            this._bindings_.push(attr);
            return attr;
        }

        let value = lex.slice(start);

        return {
            name,
            value: value || true
        };
    }



    /**
     * Hooks into the Text Node creation context and looks for binding points. 
     * If they are found, the text node will be made dynamic.
     * @param      {Lexer}    
     * @return     {TextNode}  
     */
    _processTextNodeHook_(lex) {

        if (lex.sl - lex.pos > 0) {

            let binding = Template(lex);
            if (binding)
                return new RootText(this._processTapBinding_(binding));
        }

        return null;
    }
}