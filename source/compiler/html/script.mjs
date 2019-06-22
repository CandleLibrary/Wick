import ElementNode from "./element.mjs";
import ScriptIO from "../component/io/script_io.mjs";
import FUNCTION_CACHE from "./function_cache.mjs";
import { GetOutGlobals, AddEmit as addEmitExpression } from "./script_functions.mjs";

export default class scr extends ElementNode {

    constructor(env, tag, ast, attribs, presets) {
        super(env, "script", null, attribs, presets);
        this.function = null;
        this.args = null;
        this.ast = ast[0];
        this.READY = false;
        this.val = "";
        this.on = this.getAttrib("on").value;

        if (this.ast)
            this.processJSAST(presets);
    }

    loadAST(ast){
        if(ast && !this.ast){
            this.ast = ast;
            this.processJSAST(this.presets);
        }
    }

    processJSAST(presets = { custom: {} }) {
        const { args, ids } = GetOutGlobals(this.ast, presets);
        this.args = args;
        addEmitExpression(ids, presets, this.args.reduce((r, a) => ((a.IS_TAPPED) ? null : r.push(a.name), r), []));
        this.val = this.ast + "";
    }

    finalize() {
        if (!this.ast) return this;

        if (true || !FUNCTION_CACHE.has(this.val)) {

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
                //console.error(`Script error encountered in ${statics.url || "virtual file"}:${node.line+1}:${node.char}`)
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
