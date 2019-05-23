import types from "../js/types.mjs";
import identifier from "../js/identifier.mjs";
import assignement from "../js/assign.mjs";
import member from "../js/member.mjs";
import rtrn from "../js/return.mjs";
import {GetOutGlobals, AddEmit} from "./script_functions.mjs";
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

        this.ast = sym[1];
        this.prop = (sym.length > 3) ? sym[3] : null;

        this.function = null;
        this.args = null;
        this.READY = false;

        this.val = this.ast + "";

        if (!(this.ast instanceof identifier) && !(this.ast instanceof member))
            this.processJSAST(env.presets);
        
    }

    toString() {
        if (this.prop)
            return `((${this.ast + ""})(${this.prop + ""}))`;
        else
            return `((${this.ast + ""}))`;
    }

    processJSAST(presets = { custom: {} }) {
        this.args = GetOutGlobals(this.ast, presets);
        AddEmit(this.ast, presets);
        let r = new rtrn([]);
        r.expr = this.ast;
        this.ast = r;
        this.val = r + "";
        this.METHOD = EXPRESSION;
        script.prototype.finalize.call(this);
    }

    setForContainer() {
        if (this.METHOD == EXPRESSION)
            this.METHOD = CONTAINER;
    }

    bind(scope, element, pinned) {
        if (this.METHOD == EXPRESSION) {
            return new ExpressionIO(element, scope, [], scope, this, this.lex, pinned);
        } else if (this.METHOD == CONTAINER)
            return new ContainerIO(element, scope, [], scope, this, this.lex, pinned);
        else
            return scope.getTap(this.val);
    }
}

Binding.type = {
    Attribute: 0,
    TextNode: 1,
    Style: 2
}