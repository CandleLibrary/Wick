import { IOBase } from "./io.mjs";
import spark from "@candlefw/spark";

export class ScriptIO extends IOBase {
    constructor(scope, errors, tap, binding, node, statics) {

        let func, HAVE_CLOSURE = false;

        try {
            if (binding._func_) {
                func = binding._func_;
                if(binding.HAVE_CLOSURE)
                    HAVE_CLOSURE = true;
            } else {
                func = Function(binding.arg_key || binding.tap_name, "event", "model", "emit", "presets", "static", "src", binding.val);
                binding._func_ = func;
            }
        } catch (e) {
            errors.push(e);
            console.error(`Script error encountered in ${statics.url || "virtual file"}:${node.line+1}:${node.char}`)
            console.warn(binding.val);
            console.error(e)
            func = () => {};
        }

        super(tap);

        this.function = binding.val;
        this.HAVE_CLOSURE = HAVE_CLOSURE;

        if(this.HAVE_CLOSURE)
            this._func_ = func;
        else
            this._func_ = func.bind(scope);
        
        this.scope = scope;

        let func_bound = this.emit.bind(this);
        func_bound.onTick = this.onTick.bind(this);

        this._bound_emit_function_ = new Proxy(func_bound, { set: (obj, name, value) => { obj(name, value); } });
        this.meta = null;
        this.url = statics.url;

        this.offset = node.offset;
        this.char = node.char;
        this.line = node.line;
    }

    /**
     * Removes all references to other objects.
     * Calls destroy on any child objects.
     */
    destroy() {
        this._func_ = null;
        this.scope = null;
        this._bound_emit_function_ = null;
        this._meta = null;

    }

    down(value, meta = { event: null }) {
        this.meta = meta;
        const src = this.scope;
        try {
            if(this.HAVE_CLOSURE)
                this._func_(value, this._bound_emit_function_, src, meta.event);
            else
                this._func_(value, meta.event, src.model, this._bound_emit_function_, src.presets, src.statics, src);
        } catch (e) {
            console.error(`Script error encountered in ${this.url || "virtual file"}:${this.line+1}:${this.char}`)
            console.warn(this.function);
            console.error(e)
        }
    }

    emit(name, value) {
        if (
            typeof(name) !== "undefined" &&
            typeof(value) !== "undefined"
        ) {
            this.scope.upImport(name, value, this.meta);
        }
    }
    // Same as emit, except the message is generated on the next global tick. Usefule for actions which required incremental updates to the ui.
    // Value
    onTick(name){
        spark.queueUpdate({
            _SCHD_:0, // Meta value for spark;
            scheduledUpdate:(s,d)=>this.emit(name, {step:s,diff:d})
        })
    }
}
