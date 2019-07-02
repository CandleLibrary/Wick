import { identifier, member_expression, return_statement } from "@candlefw/js";
import { GetOutGlobals, AddEmit } from "./script_functions.js";
import FUNCTION_CACHE from "./function_cache.js";
import ExpressionIO from "../component/io/expression_io.js";
import ContainerIO from "../component/io/container_io.js";
import script from "./script.js";
export const EXPRESSION = 5;
export const IDENTIFIER = 6;
export const CONTAINER = 7;
export const BOOL = 8;

export default class Binding {

    constructor(exprA, exprB, env, lex) {
        this.lex = lex.copy();
        this.lex.sl = lex.off - 3;
        this.lex.off = env.start;

        this.METHOD = IDENTIFIER;

        this.ast = exprA;
        this.prop = exprB;

        this.function = null;
        this.args = null;
        this.READY = false;

        this.origin_url = env.url;

        this.val = this.ast + "";

        if (!(this.ast instanceof identifier))
            this.processJSAST(env.presets);

    }

    toString() {
        
        if (this.prop)
            return `((${this.ast + ""})(${this.prop + ""}))`;
        else
            return `((${this.ast + ""}))`;
    }

    processJSAST(presets = { custom: {} }) {
        const { args, ids } = GetOutGlobals(this.ast, presets);

        this.args = args;

        AddEmit(ids, presets);

        const r = new return_statement([]);
        r.vals[0] = this.ast;
        this.ast = r;
        this.val = r + "";
        this.METHOD = EXPRESSION;

        script.prototype.finalize.call(this);
    }

    setForContainer(presets) {

        if (this.METHOD == IDENTIFIER)
            this.processJSAST(presets);

        this.METHOD = CONTAINER;
    }

    bind(scope, element, pinned, node = this) {
        if (this.METHOD == EXPRESSION) {
            return new ExpressionIO(element, scope, node, scope, this, this.lex, pinned);
        } else if (this.METHOD == CONTAINER)
            return new ContainerIO(element, scope, node, scope, this, this.lex, pinned);
        else
            return scope.getTap(this.val);
    }
}

Binding.type = {
    Attribute: 0,
    TextNode: 1,
    Style: 2
};
