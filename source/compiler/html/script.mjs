import ElementNode from "./element.mjs";
import types from "../js/types.mjs";
import identifier from "../js/identifier.mjs";
import member from "../js/member.mjs";
import JS from "../js/tools.mjs";
import ScriptIO from "../component/io/script_io.mjs";
import glow from "@candlefw/glow";
import FUNCTION_CACHE from "./function_cache.mjs";
import {GetOutGlobals, AddEmit} from "./script_functions.mjs";


export default class scr extends ElementNode {
    
    constructor(env, tag, ast, attribs, presets) {
        super(env, "script", null, attribs, presets);
        this.function = null;
        this.args = null;
        this.ast = ast;
        this.READY = false;
        this.val = "";

        this.processJSAST(presets);

        this.on = this.getAttrib("on").value;
    }

    processJSAST(presets = { custom: {} }) {
        this.args = GetOutGlobals(this.ast, presets);
        AddEmit(this.ast, presets, this.args.map(a=>a.name));
        this.val = this.ast + "";
    }

    finalize() {
        if (!FUNCTION_CACHE.has(this.val)) {

            let func, HAVE_CLOSURE = false;

            const
                args = this.args,
                names = args.map(a => a.name);

            // For the injected emit function
            names.push("emit");

            try {
                this.function = Function.apply(Function, names.concat([this.val]));
                this.READY = true;
                FUNCTION_CACHE.set(this.val, this.function)
            } catch (e) {
                //errors.push(e);
                console.error(`Script error encountered in ${statics.url || "virtual file"}:${node.line+1}:${node.char}`)
                console.warn(this.val);
                console.error(e)
            }
        } else {
            this.function = FUNCTION_CACHE.get(this.val)
        }

        return this;
    }

    mount(element, scope, presets, slots, pinned) {
        if (this.READY) {
            const tap = this.on.bind(scope);
            new ScriptIO(scope, [], tap, this, {}, pinned);
        }
    }
}