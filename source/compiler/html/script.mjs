import ElementNode from "./element.mjs";

import types from "../js/types.mjs";
import identifier from "../js/identifier.mjs";
import member from "../js/member.mjs";
import JS from "../js/tools.mjs";

import ScriptIO from "../component/io/script_io.mjs";

export const EXPRESSION = 5;
export const IDENTIFIER = 6;
export const EVENT = 7;
export const BOOL = 8;


import glow from "@candlefw/glow";

const defaults = { glow };


export default class scr extends ElementNode {

    constructor(env, tag, children, attribs, presets) {
        super(env, "script", null, attribs, presets);
        this.processJSAST(children, presets, true);
        this.on = this.getAttrib("on").value;
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

        this.args = out_globals;
        this.val = ast + "";
        this.expr = ast;
        this.METHOD = EXPRESSION;
    }

    mount(element, scope, statics, presets) {
        const tap = this.on.bind(scope);
        new ScriptIO(scope, [], tap, this, {}, statics);
    }
}
