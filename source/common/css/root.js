import { OB } from "../short_names";
import { Lexer } from "../string_parsing/lexer";
import { CSSRule as R, CSSSelector as S } from "./nodes";
import { _getPropertyParser_ } from "./properties/parser";
import { property_definitions, media_feature_definitions, types } from "./properties/property_and_type_definitions";

export {R as CSSRule, S as CSSSelector};

/**
 * The empty CSSRule instance
 * @alias module:wick~internals.css.empty_rule
 */
const er = OB.freeze(new R());

class _selectorPart_ {
    constructor() {
        this.e = "";
        this.ss = [];
        this.c = "";
    }
}

class _mediaSelectorPart_ {
    constructor() {
        this.id = "";
        this.props = {};
        this.c = "";
    }
}

/**
 * Container for all rules found in a CSS string or strings.
 *
 * @memberof module:wick~internals.css
 * @alias CSSRootNode
 */
class CSSRootNode {

    constructor(_med_ = []) {

        this.promise = null;

        /**
         * Media query selector
         */
        this._med_ = _med_;

        /**
         * All selectors indexed by their value
         */
        this._selectors_ = {};

        /**
         * All selectors in order of appearance
         */
        this._sel_a_ = [];

        /**
         * rules falling under different media, these are stored as addition CSSRootNodes
         */
        this._media_ = [];

        /**
         * The next set of CSS rules to lookup.
         */
        this._next_ = null;

        this.resolves = [];
        this.res = null;

        this.observer = null;


        this.pending_build = 0;
    }

    _resolveReady_(res, rej) {
        if (this.pending_build > 0)
            this.resolves.push(res);
        res(this);
    }

    _setREADY_() {
        if (this.pending_build < 1) {
            for (let i = 0, l = this.resolves; i < l; i++)
                this.resolves[i](this);
            this.resolves.length = 0;
            this.res = null;
        }
    }

    _READY_() {
        if (!this.res)
            this.res = this._resolveReady_.bind(this);

        return new Promise(this.res);
    }

    /**
     * Creates a new instance of the object with same properties as the original.
     * @return     {CSSRootNode}  Copy of this object.
     * @public
     */
    clone() {
        let rn = new this.constructor();

        rn._selectors_ = this._selectors_;
        rn._sel_a_ = this._sel_a_;
        rn._media_ = this._media_;

        return rn;
    }

    /**
     * Gets the media.
     * @return     {Object}  The media.
     * @public
     */
    getMedia() {
        let start = this;

        this._media_.forEach((m) => {
            if (m._med_) {
                let accept = true;
                for (let i = 0, l = m._med_.length; i < l; i++) {
                    let ms = m._med_[i];

                    if (ms.props) {
                        for (let n in ms.props) {
                            if (!ms.props[n]())
                                accept = false;
                        }
                    }

                    //if(not)
                    //    accept = !accept;

                    if (accept)
                        (m._next_ = start, start = m);


                }
            }
        });

        return start;
    }

    /**
     * Hook method for hijacking the property parsing function. Return true if default property parsing should not take place
     * @param      {Lexer}   value_lexer    The value lexer
     * @param      {<type>}   property_name  The property name
     * @param      {<type>}   rule           The rule
     * @return     {boolean}  The property hook.
     */
    _getPropertyHook_(value_lexer, property_name, rule) {
        return false;
    }

    /**
     * Parses properties
     * @param      {Lexer}  lexer        The lexer
     * @param      {<type>}  rule         The rule
     * @param      {<type>}  definitions  The definitions
     */
    _GetProperty_(lexer, rule, definitions) {
        const name = lexer.tx.replace(/\-/g, "_");

        lexer.n().a(":");
        //allow for short circuit < | > | =

        const p = lexer.pk;

        while ((p.ch !== "}" && p.ch !== ";")) {
            //look for 
            p.n();
        }

        const out_lex = lexer.copy();
        lexer.sync();
        out_lex.fence(p);

        if (!this._getPropertyHook_(out_lex, name, rule)) {
            try {
                const IS_VIRTUAL = { is: false };
                const parser = _getPropertyParser_(name, IS_VIRTUAL, definitions);
                if (parser && !IS_VIRTUAL.is) {
                    if (!rule.props) rule.props = {};
                    parser._parse_(out_lex, rule.props);
                } else
                    //Need to know what properties have not been defined
                    console.warn(`Unable to get parser for css property ${name}`);
            } catch (e) {
                console.log(e);
            }
        }

        if (lexer.ch == ";") lexer.n();
    }


    _applyProperties_(lexer, rule) {
        while (!lexer.END && lexer.tx !== "}")
            this._GetProperty_(lexer, rule, property_definitions);

        lexer.n();
    }


    /**
     * Used to match selectors to elements
     * @param      {ele}   ele       The ele
     * @param      {string}   criteria  The criteria
     * @return     {boolean}  { description_of_the_return_value }
     * @private
     */
    _matchCriteria_(ele, criteria) {
        if (criteria.e && ele.tagName !== criteria.e.toUpperCase())
            return false;
        outer:
            for (let i = 0, l = criteria.ss.length; i < l; i++) {
                let ss = criteria.ss[i];
                switch (ss.t) {
                    case "attribute":
                    
                        let lex = new Lexer(ss.v);
                        if(lex.ch=="[" && lex.pk.ty == lex.types.id){
                            let id = lex.sync().tx;
                            let attrib = ele.getAttribute(id);
                            if(!attrib) return;
                            if(lex.n().ch == "="){
                                let value = lex.n().tx;
                                if(attrib !== value) return false;
                            }
                        }
                        break;
                    case "pseudo":
                        debugger;
                        break;
                    case "class":
                        let class_list = ele.classList;
                        for (let j = 0, jl = class_list.length; j < jl; j++) {
                            if (class_list[j] == ss.v)
                                continue outer;
                        }
                        return false;
                    case "id":
                        if (ele.id !== ss.v)
                            return false;
                }
            }

        return true;
    }

    /**
     * Retrieves the set of rules from all matching selectors for an element.
     * @param      {HTMLElement}  element - An element to retrieve CSS rules.
     * @public
     */
    getApplicableRules(element, rule = new R()) {
        outer: for (let j = 0, jl = this._sel_a_.length; j < jl; j++) {
            let ancestor = element;
            let selector = this._sel_a_[j];
            let sa = selector.a;
            let criteria = null;
            inner:
                for (let i = 0, l = sa.length; i < l; i++) {
                    criteria = sa[i];
                    switch (criteria.c) {
                        case "child":
                            if (!(ancestor = ancestor.parentElement) || !this._matchCriteria_(ancestor, criteria))
                                continue outer;
                            break;
                        case "preceded":
                            while ((ancestor = ancestor.previousElementSibling))
                                if (this._matchCriteria_(ancestor, criteria))
                                    continue inner;
                            continue outer;
                        case "immediately preceded":
                            if (!(ancestor = ancestor.previousElementSibling) || !this._matchCriteria_(ancestor, criteria))
                                continue outer;
                            break;
                        case "descendant":
                            while ((ancestor = ancestor.parentElement))
                                if (this._matchCriteria_(ancestor, criteria))
                                    continue inner;
                            continue outer;
                        default:
                            if (!this._matchCriteria_(ancestor, criteria))
                                continue outer;
                    }
                }
            rule.merge(selector.r);
        }

        return (this._next_) ? this._next_.getApplicableRules(element, rule) : rule;
    }

    /**
     * Gets the rule matching the selector
     * @param      {string}  string  The string
     * @return     {CSSRule}  The combined set of rules that match the selector.
     */
    getRule(string) {
        let selector = this._selectors_[string];

        if (selector)

            return selector.r;

        return er;
    }

    /**
     * Parses CSS string
     * @param      {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}
     * @param      {(Array|CSSRootNode|Object|_mediaSelectorPart_)}  root    The root
     * @return     {Promise}  A promise which will resolve to a CSSRootNode
     * @private
     */
    _parse_(lexer, root, res = null, rej = null) {
        return new Promise((res, rej) => {

            if (!root && root !== null) {
                root = this;
                this.pending_build++;
            }

            let selectors = [],
                l = 0;
            while (!lexer.END) {
                switch (lexer.ch) {
                    case "@":
                        lexer.n();

                        switch (lexer.tx) {
                            case "media": //Ignored at this iteration /* https://drafts.csswg.org/mediaqueries/ */
                                //create media query selectors
                                let _med_ = [],
                                    sel = null,
                                    media_root = null;
                                while (!lexer.END && lexer.n().ch !== "{") {

                                    if (!sel) sel = new _mediaSelectorPart_();

                                    if (lexer.ch == ",")
                                        _med_.push(sel), sel = null;
                                    else if (lexer.ch == "(") {
                                        let start = lexer.n().off;

                                        while (!lexer.END && lexer.ch !== ")") lexer.n();

                                        let out_lex = lexer.copy();
                                        out_lex.off = start;
                                        out_lex.tl = 0;
                                        out_lex.n().fence(lexer);

                                        this._GetProperty_(out_lex, sel, media_feature_definitions);

                                        if (lexer.pk.tx.toLowerCase() == "and")
                                            lexer.sync();
                                    } else {
                                        let id = lexer.tx.toLowerCase(),
                                            condition = "";
                                        if (id === "only" || id === "not")
                                            (condition = id, id = lexer.n().tx);

                                        sel.c = condition;

                                        sel.id = id;

                                        if (lexer.pk.tx.toLowerCase() == "and")
                                            lexer.sync();
                                    }
                                }
                                //debugger
                                lexer.a("{");

                                if (sel)
                                    _med_.push(sel);


                                if (_med_.length == 0)
                                    this._parse_(lexer, null); // discard results
                                else {
                                    this._parse_(lexer, (media_root = new this.constructor(_med_)));
                                    this._media_.push(media_root);
                                }



                                continue;
                            case "import":
                                /* https://drafts.csswg.org/css-cascade/#at-ruledef-import */
                                let type;
                                if (type = types.url._parse_(lexer.n())) {

                                    lexer.a(";");
                                    /**
                                     * The {@link CSS_URL} incorporates a fetch mechanism that returns a Promise instance.
                                     * We use that promise to hook into the existing promise returned by CSSRoot#_parse_,
                                     * executing a new _parse_ sequence on the fetched string data using the existing CSSRoot instance,
                                     * and then resume the current _parse_ sequence.
                                     * @todo Conform to CSS spec and only _parse_ if @import is at the top of the CSS string.
                                     */
                                    return type.fetchText().then((str) =>

                                        //Successfully fetched content, proceed to _parse_ in the current root.
                                        //let import_lexer = ;

                                        res(this._parse_(new Lexer(str, true), this).then((r) => this._parse_(lexer, r)))

                                        //_Parse_ returns Promise. 
                                        // return;
                                    ).catch((e) =>
                                        res(this._parse_(lexer))
                                    );
                                } else {
                                    //Failed to fetch resource, attempt to find the end to of the import clause.
                                    while (!lexer.END && lexer.n().tx !== ";") {};
                                    lexer.n();
                                }
                        }
                        break;

                    case "/":
                        lexer.comment(true);
                        break;
                    case "}":
                        lexer.n();
                        return;
                    case "{":

                        let rule = new R(this);

                        this._applyProperties_(lexer.n(), rule);

                        for (let i = -1, sel = null; sel = selectors[++i];)
                            if (sel.r)
                                sel.r.merge(rule);
                            else
                                sel.r = rule;


                        selectors.length = l = 0;

                        continue;
                }

                if (root) {
                    let selector = this.__parseSelector__(lexer, this);
                    if (selector) {

                        if (!root._selectors_[selector.v]) {
                            l = selectors.push(selector);
                            root._selectors_[selector.v] = selector;
                            root._sel_a_.push(selector);
                        } else
                            l = selectors.push(root._selectors_[selector.v]);
                    }
                }
            }

            res(this);

            this._setREADY_();

            return this;
        });
    }

    /** 
    Parses a selector up to a token '{', creating or accessing necessary rules as it progresses. 

    Reference: https://www.w3.org/TR/selectors-3/ 
    https://www.w3.org/TR/css3-mediaqueries/
    https://www.w3.org/TR/selectors-3/

    @param {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}.

    @protected

    */
    __parseSelector__(lexer) {
        let rule = this,
            id = "",
            selector_array = [];

        let start = lexer.pos;



        let gapped = null;



        let sel = new _selectorPart_();

        while (!lexer.END) {

            if (!sel) sel = new _selectorPart_();
            switch (lexer.tx) {
                case ",":
                    lexer.n();
                case "{":
                    selector_array.unshift(sel);
                    return new S(lexer.s(start).trim(), selector_array, this);
                case "[":
                    let p = lexer.pk;
                    while (!p.END && p.n().tx !== "]") {};
                    p.a("]");
                    if (p.END) throw new _Error_("Unexpected end of input.");
                    sel.ss.push({
                        t: "attribute",
                        v: p.s(lexer)
                    })
                    lexer.sync();
                    break;
                case ":":
                    sel.ss.push({
                        t: "pseudo",
                        v: lexer.n().tx
                    })
                    _eID_(lexer);
                    lexer.n();
                    break;
                case ".":
                    sel.ss.push({
                        t: "class",
                        v: lexer.n().tx
                    })
                    _eID_(lexer);
                    lexer.n();
                    break;
                case "#":
                    sel.ss.push({
                        t: "id",
                        v: lexer.n().tx
                    })
                    _eID_(lexer);
                    lexer.n();
                    break;
                case "*":
                    lexer.n();
                    break;
                case ">":
                    sel.c = "child";
                    selector_array.unshift(sel);
                    sel = null;
                    lexer.n();
                    break;
                case "~":
                    sel.c = "preceded";
                    selector_array.unshift(sel);
                    sel = null;
                    lexer.n();
                    break;
                case "+":
                    sel.c = "immediately preceded";
                    selector_array.unshift(sel);
                    sel = null;
                    lexer.n();
                    break;
                default:
                    if (sel.e) {
                        sel.c = "descendant";
                        selector_array.unshift(sel);
                        sel = null;
                    } else {
                        sel.e = lexer.tx;
                        _eID_(lexer);
                        lexer.n();
                    }
                    break;
            }
        }

        return null;
    }

    toString(){
        let str = "";

        for(let i = 0; i < this._sel_a_.length; i++){
            str += this._sel_a_[i] + "";
        }

        return str;
    }

    updated(){
        if(this.observer)
            this.observer.updatedCSS();
    }
}

export {
    CSSRootNode
}

/*
 * Expecting ID error check.
 */
const _err_ = "Expecting Identifier";
/**
 * Checks to make sure token is an Identifier.
 * @param      {Lexer} - A Lexical tokenizing object supporting methods found in {@link Lexer}.
 * @alias module:wick~internals.css.elementIsIdentifier
 */
function _eID_(lexer) {
    if (lexer.ty != lexer.types.id) lexer.throw(_err_);
}

/**
 * Builds a CSS object graph that stores `selectors` and `rules` pulled from a CSS string. 
 * @function
 * @param {string} css_string - A string containing CSS data.
 * @param {string} css_string - An existing CSSRootNode to merge with new `selectors` and `rules`.
 * @return {Promise} A `Promise` that will return a new or existing CSSRootNode.
 * @memberof module:wick.core
 * @alias css
 */
export const CSSParser = (css_string, root = null) => (root = (!root || !(root instanceof CSSRootNode)) ? new CSSRootNode() : root, root._parse_(new Lexer(css_string, true)));