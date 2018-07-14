import { CSSRule as C } from "./base"
import { GetProperty } from "../properties/properties"

export class CSSRootNode extends C {

    constructor() {
        super("root");
    }

    parse(lexer) {
        let rules = [];

        while (!lexer.END) {
            let selector = null;

            if (lexer.tx == "/") this.comment(lexer);

            if (lexer.tx == "{") {
                this.applyRules(lexer.n(), rules);
                rules.length = 0;
                continue;
            }

            rules.push(this.getRule(lexer, this));
        };
    }

    getProperty(lexer) {
        return GetProperty(lexer);
    }

    applyRules(lexer, rules) {
        let props = [];

        while (lexer.tx !== "}")
            props.push(this.getProperty(lexer));

        for (let i = 0, l = rules.length, jl = props.length; i < l; i++) {
            let rule = rules[i];
            for (let j = 0; j < jl; j++)
                if (props[j]) rule.addProperty(props[j]);
        }
    }

    getRule(lexer, root) {
        let rule = this,
            id = "";

        while (!lexer.END) {
            switch (lexer.tx) {
                case ",":
                    lexer.n();
                case "{":
                    return rule;
                case ":":
                    id = lexer.n().tx;
                    if (lexer.ty != lexer.types.id) throw new Error("Expecting Identifier");
                    rule = (rule.pseudo_class[id]) ? rule.pseudo_class[id] : (rule.pseudo_class[id] = new C(`:${id}`));
                    break;
                case ".":
                    id = lexer.n().tx;
                    if (lexer.ty != lexer.types.id) throw new Error("Expecting Identifier");
                    rule = (rule.classes[id]) ? rule.classes[id] : (rule.classes[id] = new C(`.${id}`));
                    break;
                case "#":
                    id = lexer.n().tx;
                    if (lexer.ty != lexer.types.id) throw new Error("Expecting Identifier");
                    rule = (rule.ids[id]) ? rule.ids[id] : (rule.ids[id] = new C(`#${id}`));
                    break;
                default:
                    id = lexer.tx;
                    if (lexer.ty != lexer.types.id) throw new Error("Expecting Identifier");
                    rule = (rule.rules[id]) ? rule.rules[id] : (rule.rules[id] = new C(`${id}`));
                    break;
            }
            lexer.n();
        }

        return rule;
    }
}