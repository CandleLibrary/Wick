import { IOBase } from "./io";
export class ScriptIO extends IOBase {
    constructor(source, errors, tap, binding, node, statics) {

        let func;

        try {
            if (binding._func_) {
                func = binding._func_;
            } else {
                func = Function(binding.tap_name, "event", "model", "emit", "presets", "static", "src", binding.val).bind(source);
                binding._func_ = func;
            }
        } catch (e) {
            errors.push(e);
            func = () => {};
        }

        super(tap);

        this.function = binding.val;
        this._func_ = func;
        this.source = source;
        this._bound_emit_function_ = new Proxy(this._emit_.bind(this), { set: (obj, name, value) => { obj(name, value); } });
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
        this.source = null;
        this._bound_emit_function_ = null;
        this._meta = null;

    }

    down(value, meta = { event: null }) {
        this.meta = meta;
        const src = this.source;
        try {
            this._func_(value, meta.event, src.model, this._bound_emit_function_, src.presets, src.statics, src);
        } catch (e) {
            console.error(`Script error encountered in ${this.url || "virtual file"}:${this.line}:${this.char}`)
            console.warn(this.function);
            console.error(e)
        }
    }

    _emit_(name, value) {
        if (
            typeof(name) !== "undefined" &&
            typeof(value) !== "undefined"
        ) {
            this.source.upImport(name, value, this.meta);
        }
    }
}
