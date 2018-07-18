import { EL, OB } from "../../../short_names"
import { Lexer } from "../../../string_parsing/lexer"
import { CSSRule as R, CSSSelector as S } from "./base"
import { GetProperty } from "../properties/properties"
import { types } from "../properties/props_and_types"
/**
 * The empty CSSRule instance
 */
const er = OB.freeze(new R);

/**
 * Container for all rules found in a CSS string or strings.
 *
 * @memberof module:wick~internals.css
 * @alias CSSRootNode
 */
class CSSRootNode {

    constructor() {

        /**
         * All selectors indexed by their value
         */
        this.selectors = {};

        /**
         * All selectors in order of appearance
         */
        this.sel_a = [];

        /**
         * rules falling under different media, these are stored as addition CSSRootNodes
         */
        this.media = {};
    }


    applyProperties(lexer, rules) {

        let props = [];

        while (lexer.tx !== "}") {
            props.push(GetProperty(lexer, rules));
        }

        lexer.n();
    }

    parse(lexer) {

        let selectors = [],
            l = 0;

        while (!lexer.END) {

            if (lexer.tx == "/") lexer.comment(true);

            if (lexer.tx == "{") {

                let rule = new R();

                this.applyProperties(lexer.n(), rule);

                for (let i = -1; ++i < l;)
                    selectors[i].r = rule;

                selectors.length = l = 0;

                continue;
            }

            let selector = this.__parseSelector__(lexer, this);

            l = selectors.push(selector);

            this.selectors[selector.v] = selector;

            this.sel_a.push(selector);
        };
    }

    _matchCriteria_(ele, criteria) {

        if (criteria.e && ele.tagName !== criteria.e.toUpperCase())
            return false;
        outer:
            for (let i = 0, l = criteria.ss.length; i < l; i++) {
                let ss = criteria.ss[i]
                switch (ss.t) {
                    case "attribute":
                        if (!ele.getAttribute(criteria.v)) return false;
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
     *
     * @param      {external:HTMLElement}  element - An element to retrieve CSS rules.
     */
    getApplicableRules(element) {
        if (!element instanceof EL) return er;
        outer:
            for (let j = 0, jl = this.sel_a.length; j < jl; j++) {
                let ancestor = element;
                let selector = this.sel_a[j];
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
                            while (ancestor = ancestor.previousElementSibling)
                                if (this._matchCriteria_(ancestor, criteria)) 
                                    continue inner;
                            continue outer;
                        case "immediately preceded":
                            if (!(ancestor = ancestor.previousElementSibling) || !this._matchCriteria_(ancestor, criteria))
                                continue outer;
                            break;
                        case "descendant":
                            while (ancestor = ancestor.parentElement)
                                if (this._matchCriteria_(ancestor, criteria))
                                    continue inner;
                            continue outer;
                        default:
                            if (!this._matchCriteria_(ancestor, criteria))
                                continue outer;
                    }
                }

                return selector.r;
            }
    }

    getRule(string) {
        let selector = this.selectors[string];

        console.log(string, selector)

        if (selector)

            return selector.r;

        return er;
    }

    /** 
        Parses a selector up to a token '{', creating or accessing necessary rules as it progresses. 

        Reference: https://www.w3.org/TR/selectors-3/ 
        https://www.w3.org/TR/css3-mediaqueries/
        https://www.w3.org/TR/selectors-3/

        @param {Lexer} lexer - A Lexer object bound to the input CSS string.

        @protected

    */
    __parseSelector__(lexer) {
        let rule = this,
            id = "",
            selector_array = [];

        let start = lexer.pos;



        let gapped = null;

        class selectorPart {
            constructor() {
                this.e = "";
                this.ss = [];
                this.c = "";
            }
        }

        let sel = new selectorPart();

        while (!lexer.END) {
            if (!sel) sel = new selectorPart();
            switch (lexer.tx) {
                case "@":
                    lexer.n();
                    switch (lexer.tx) {
                        case "media": //Ignored at this iteration
                            /* https://www.w3.org/TR/css3-mediaqueries/ */
                            while (!p.END && p.n().tx !== "}") {};

                            if (p.END) throw new Error("Unexpected end of input.");

                            lexer.sync();
                            break;
                        case "import":
                            /* https://www.w3.org/TR/CSS21/cascade.html#important-rules */
                            let type;
                            if (type = types.url(lexer.n())) {
                                lexer.a(";");
                            } else if (type = type.string(lexer)) {
                                lexer.a(";");
                            } else {
                                while (!lexer.END && lexer.n().tx !== ";") {};
                                lexer.n();
                            }
                    }
                    break;
                case ",":
                    lexer.n();
                case "{":
                    selector_array.unshift(sel);
                    return new S(lexer.s(start).trim(), selector_array);
                case "[":
                    let p = lexer.pk;
                    while (!p.END && p.n().tx !== "]") {};
                    p.a("]");
                    if (p.END) throw new Error("Unexpected end of input.");
                    sel.ss.push({ t: "attribute", v: p.s(lexer) })
                    lexer.sync();
                    break;
                case ":":
                    sel.ss.push({ t: "pseudo", v: lexer.n().tx })
                    eID(lexer);
                    lexer.n();
                    break;
                case ".":
                    sel.ss.push({ t: "class", v: lexer.n().tx })
                    eID(lexer);
                    lexer.n();
                    break;
                case "#":
                    sel.ss.push({ t: "id", v: lexer.n().tx })
                    eID(lexer);
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
                        eID(lexer);
                        lexer.n();
                    }
                    break;
            }
        }

        return rule;
    }
}
/**
 * Expecting ID error check.
 */
const err = "Expecting Identifier";

function eID(lexer) { if (lexer.ty != lexer.types.id) lexer.throw(err); }
export { CSSRootNode }