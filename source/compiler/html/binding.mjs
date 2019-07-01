import { identifier, member_expression, return_statement } from "@candlefw/js";
import { GetOutGlobals, AddEmit } from "./script_functions.mjs";
import FUNCTION_CACHE from "./function_cache.mjs";
import ExpressionIO from "../component/io/expression_io.mjs";
import ContainerIO from "../component/io/container_io.mjs";
import script from "./script.mjs";
export const EXPRESSION = 5;
export const IDENTIFIER = 6;
export const CONTAINER = 7;
export const BOOL = 8;

export default class Binding {

    constructor(sym, env, lex) {
        this.lex = lex.copy();
        this.lex.sl = lex.off - 3;
        this.lex.off = env.start;

        this.METHOD = IDENTIFIER;

        this.ast = sym[2];
        this.prop = (sym.length > 3) ? sym[5] : null;

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

        console.log(this.ast.render())

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
