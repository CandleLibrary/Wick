import types from "../js/types.mjs";
import identifier from "../js/identifier.mjs";
import assignement from "../js/assign.mjs";
import member from "../js/member.mjs";
import rtrn from "../js/return.mjs";
import JS from "../js/tools.mjs";
//import JSTools from "./js/tools.mjs";

import ExpressionIO from "../component/io/expression_io.mjs";
import ContainerIO from "../component/io/container_io.mjs";


import glow from "@candlefw/glow";


export const EXPRESSION = 5;
export const IDENTIFIER = 6;
export const CONTAINER = 7;
export const BOOL = 8;

const defaults = { glow }


export default class Binding {

    constructor(sym, env, lex) {
        this.lex = lex.copy();
        this.lex.sl = lex.off - 3;
        this.lex.off = env.start;

        this.METHOD = IDENTIFIER;

        this.expr = sym[1];
        this.exprb = (sym.length > 3) ? sym[3] : null;

        this.args = null;
        this.val = this.expr + "";

        if (!(this.expr instanceof identifier) && !(this.expr instanceof member))
            this.processJSAST(this.expr, env.presets);

        console.log(this.expr + "")
    }

    toString() {
        if (this.exprb)
            return `((${this.expr + ""})(${this.exprb + ""}))`;
        else
            return `((${this.expr + ""}))`;
    }

    processJSAST(ast, presets = { custom: {} }, ALLOW_EMIT = false) {

        const out_global_names = JS.getClosureVariableNames(ast)
        
        const out_globals = out_global_names.map(out=>{
            const out_object = { name: out, val: null, IS_TAPPED: false };

            if (presets.custom[out])
                out_object.val = presets.custom[out];
            else if (presets[out])
                out_object.val = presets[out];
            else if (defaults[out])
                out_object.val = defaults[out];
            else {
                out_object.IS_TAPPED = true;
            }

            return out_object;
        }) 

        JS.processType(types.assignment, ast, assign=>{
            const k = assign.id.name;

            if (window[k] || this.presets.custom[k] || this.presets[k] || defaults[k])
                    return;

            assign.id = new member([new identifier(["emit"]), null, assign.id]);
        })

        let r = new rtrn([]);
        r.expr = ast;
        ast = r;

        this.args = out_globals;
        this.val = ast + "";
        this.expr = ast;
        this.METHOD = EXPRESSION;
    }

    setForContainer() {
        if (this.METHOD == EXPRESSION)
            this.METHOD = CONTAINER;
    }

    bind(scope, element) {
        if (this.METHOD == EXPRESSION) {
            return new ExpressionIO(element, scope, [], scope, this, this.lex);
        } else if (this.METHOD == CONTAINER)
            return new ContainerIO(element, scope, [], scope, this, this.lex);
        else
            return scope.getTap(this.val);
    }
}

Binding.type = {
    Attribute: 0,
    TextNode: 1,
    Style: 2
}
