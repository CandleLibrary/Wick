import { IOBase } from "./io";

export class ScriptIO extends IOBase {
    constructor(source, errors, tap, binding) {
        
        let func;

        try {
            if (binding._func_) {
                func = binding._func_;
            } else {
                func = Function("value", "event", "model", "emit", "presets", "static", "src", binding.val);
                binding._func_ = func;
            }
        } catch (e) {
            errors.push(e);
            return;
        }

        super(tap);
        this._func_ = func;
        this._source_ = source;
        this._bound_emit_function_ = this._emit_.bind(this);
        this.meta = null;
    }

    /**
     * Removes all references to other objects.
     * Calls _destroy_ on any child objects.
     */
    _destroy_() {
        this._func_ = null;
        this._source_ = null;
        this._bound_emit_function_ = null;
        this._meta = null;

    }

    _down_(value, meta = {event:null}) {
        this.meta = meta;
        const src = this._source_;
        this._func_(value, meta.event, src._model_, this._bound_emit_function_, src._presets_, src._statics_, src);
    }

    _emit_(name, value) {
        if (
            typeof(name) !== "undefined" &&
            typeof(value) !== "undefined"
        ) {
            this._source_._upImport_(name, value, this.meta);
        }
    }
}