import { IOBase } from "./io";

export class ScriptIO extends IOBase {
    constructor(source, errors, tap, binding) {
        
        let func;

        try {
            if (binding._func_) {
                func = binding._func_;
            } else {
                func = Function("value", "event", "model", "emit", binding.val);
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

    _down_(value, meta) {
        if (meta && meta.event){
            this.meta = meta;
            this._func_(value, meta.event, this._source_._m, this._bound_emit_function_);
        }
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