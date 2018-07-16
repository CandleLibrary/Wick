import { Lexer } from "../../../string_parsing/lexer"
import { CSSRule as C } from "./base"
import { GetProperty } from "../properties/properties"
import { types } from "../properties/props_and_types"

export class CSSRootNode extends C {

    constructor() {
        //Basically a NO OP, ATM
        super("root");

        this.media = {};
    }

    parse(lexer) {

        let rules = [];

        while (!lexer.END) {
            let selector = null;

            if (lexer.tx == "/") this.comment(lexer);

            if (lexer.tx == "{") {
                this.applyProperties(lexer.n(), rules);
                rules.length = 0;
                continue;
            }

            rules.push(this.__parseSelector__(lexer, this));
        };
    }

    applyProperties(lexer, rules) {

        let props = [];

        while (lexer.tx !== "}") {
            props.push(GetProperty(lexer, rules));
        }

        lexer.n();
    }

    getRule(string) {
        return CSSRootNode.getRule(string, this);
    }

    /** 
        __parseSelector__

        Parses a selector up to a token '{', creating or accessing necessary rules as it progresses. 

        Reference: https://www.w3.org/TR/selectors-3/ 
        https://www.w3.org/TR/css3-mediaqueries/
        https://www.w3.org/TR/CSS21/cascade.html#important-rules

        @param {Lexer} lexer - A Lexer object bound to the input CSS string.

        @protected

    */

    __parseSelector__(lexer) {
        let rule = this,
            id = "",
            selector = "";

        let start = lexer.pos;

        while (!lexer.END) {
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
                case "*":
                    lexer.n();
                case "{":
                    return rule;
                case "[":
                    let p = lexer.pk;

                    while (!p.END && p.n().tx !== "]") {};

                    p.a("]");

                    if (p.END) throw new Error("Unexpected end of input.");

                    id = p.slice(lexer);
                    lexer.sync();

                    if (!rule.attributes) rule.attributes = {};
                    rule = (rule.attributes[id]) ? rule.attributes[id] : (rule.attributes[id] = new C(`${id}`, lexer.pk.slice(start)));

                    break;

                case ":":
                    id = lexer.n().tx;
                    if (lexer.ty != lexer.types.id) throw new Error("Expecting Identifier");
                    if (!rule.pseudo_class) rule.pseudo_class = {};
                    rule = (rule.pseudo_class[id]) ? rule.pseudo_class[id] : (rule.pseudo_class[id] = new C(`:${id}`, lexer.pk.slice(start)));
                    lexer.n();
                    break;
                case ".":
                    id = lexer.n().tx;
                    if (lexer.ty != lexer.types.id) throw new Error("Expecting Identifier");
                    if (!rule.classes) rule.classes = {};
                    rule = (rule.classes[id]) ? rule.classes[id] : (rule.classes[id] = new C(`.${id}`, lexer.pk.slice(start)));
                    lexer.n();
                    break;
                case "#":
                    id = lexer.n().tx;
                    if (lexer.ty != lexer.types.id) throw new Error("Expecting Identifier");
                    if (!rule.ids) rule.ids = {};
                    rule = (rule.ids[id]) ? rule.ids[id] : (rule.ids[id] = new C(`#${id}`, lexer.pk.slice(start)));
                    lexer.n();
                    break;
                default:
                    id = lexer.tx;
                    if (lexer.ty != lexer.types.id) throw new Error("Expecting Identifier");
                    if (!rule.rules) rule.rules = {};
                    rule = (rule.rules[id]) ? rule.rules[id] : (rule.rules[id] = new C(`${id}`, lexer.pk.slice(start)));
                    lexer.n();
                    break;
            }
        }

        return rule;
    }

    static getRule(string, node) {

        if (!node) return null;

        let lexer = new Lexer(string);

        let rule = node,
            id = "";

        let start = lexer.pos;

        while (!lexer.END && rule) {
            switch (lexer.tx) {
                case "{":
                    return rule;
                case "[":
                    let p = lexer.pk;

                    while (!p.END && p.n().tx !== "]") {};

                    p.a("]");

                    //if (p.END) throw new Error("Unexpected end of input.");

                    id = p.slice(lexer);
                    lexer.sync();

                    rule = (rule.attributes) ? rule.attributes[id] : null;
                    break;
                case ":":
                    id = lexer.n().tx;
                    rule = (rule.pseudo_class) ? rule.pseudo_class[id] : null;
                    lexer.n();
                    break;
                case ".":
                    id = lexer.n().tx;
                    rule = (rule.classes) ? rule.classes[id] : null;
                    lexer.n();
                    break;
                case "#":
                    id = lexer.n().tx;
                    rule = (rule.ids) ? rule.ids[id] : null;
                    lexer.n();
                    break;
                default:
                    id = lexer.tx;
                    rule = (rule.rules) ? rule.rules[id] : null;
                    lexer.n();
                    break;
            }
        }

        if (rule) return rule;

        return null;
    }
}