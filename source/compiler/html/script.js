import { return_statement } from "@candlefw/js";
import ElementNode from "./element.js";
import ScriptIO from "../component/io/script_io.js";
import FUNCTION_CACHE from "../js/function_cache.js";
import error from "../../utils/error.js";
import { GetOutGlobals, AddEmit, AsyncInClosure, copyAST } from "../js/script_functions.js";

const offset = "    ";
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;

export function processJSAST(obj, env, ENCLOSE_IN_RETURN_STATEMENT = false) {

    obj.ast = obj.original.copy();

    const { args, ids } = GetOutGlobals(obj.ast, env.presets);

    obj.IS_ASYNC = AsyncInClosure(obj.ast, env);

    obj.args = args;

    obj.ids = ids;

    AddEmit(ids, env.presets, obj.args.reduce((r, a) => ((a.IS_TAPPED) ? null : r.push(a.name), r), []));

    if (ENCLOSE_IN_RETURN_STATEMENT) {
        const r = new return_statement([]);
        r.vals[0] = obj.ast;
        obj.ast = r;
    }
    
    obj.val = obj.ast + "";
}

export function processScriptObject(obj, component_env) {
    if (true || !FUNCTION_CACHE.has(obj.val)) {

        const
            args = obj.args,
            names = args.map(a => a.name);

        // For the injected emit function
        names.push("emit");

        try {

            if (obj.IS_ASYNC)
                obj.function = AsyncFunction.apply(AsyncFunction, names.concat([obj.val]));
            else
                obj.function = Function.apply(Function, names.concat([obj.val]));

            FUNCTION_CACHE.set(obj.val, obj.function);
        } catch (e) {
            component_env.error(error.SCRIPT_FUNCTION_CREATE_FAILURE, e, obj);
            return false;
        }

    } else {
        obj.function = FUNCTION_CACHE.get(obj.val);
    }

    return true;
}

export default class ScriptNode extends ElementNode {

    constructor(env, presets, tag, ast, attribs) {
        super(env, presets, "script", null, attribs);
        this.function = null;
        this.args = null;
        this.original = null;
        this.ast = null;
        this.IS_ASYNC = false;
        this.READY = false;
        this.val = "";

        const on = this.getAttribObject("on").value;

        if (typeof on == "string")
            console.warn("No binding set for this script's [on] attribute. This script will have no effect.");
        else {
            this.on = on;
            this.loadAST(ast[0]);
        }
    }

    loadAST(ast) {
        if (ast && !this.ast) {
            this.original = ast;
            processJSAST(this, this.env);
        }
    }

    finalize() {

        if (!this.ast || !this.on) return this;

        this.READY = processScriptObject(this, this.component_env);

        return this;
    }

    mount(element, scope, presets, slots, pinned) {

        if (this.READY) {
            const tap = this.on.bind(scope, null, null, this);
            scope.ios.push(new ScriptIO(scope, this, tap.main, this, {}, pinned));
        }
    }

    toString(off = 0) {

        var o = offset.repeat(off),
            str = `${o}<${this.tag}`;

        for (const attr of this.attribs.values()) {
            if (attr.name)
                str += ` ${attr.name}="${attr.value}"`;
        }

        str += ">\n";

        str += this.original.render();

        return str + `${o}</${this.tag}>\n`;
    }
}