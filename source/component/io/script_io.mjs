import { IOBase } from "./io.mjs";
import glow from "@candlefw/glow";
import whind from "@candlefw/whind";
import spark from "@candlefw/spark";

const Globals = new Set([
    "window",
    "document",
    "JSON",
    "HTMLElement",
])

//Function.apply(Function, [binding.arg_key || binding.tap_name, "event", "model", "emit", "presets", "static", "src", binding.val]);
export class ScriptIO extends IOBase {
    constructor(scope, errors, tap, binding, node, statics) {

        let presets = scope.presets;
        let ids = binding.ids;
        let func, HAVE_CLOSURE = false;

        const names = [binding.arg_key || binding.tap_name, "emit"];
        const props = [null, null];


        //TODO, do this before building of script, when the script is first compiled. 
        for(var i = 0; i < ids.length; i++){
            let id = ids[i];
            if(!window[id]){

                if(id == "wick"){
                    props.push(wick)
                    names.push(id)
                }

                if(id == "glow"){
                    props.push(glow)
                    names.push(id)
                }

                if(id == "whind"){
                    props.push(whind)
                    names.push(id)
                }

                if(presets.custom[id]){
                    props.push(presets.custom[id]);
                    names.push(id);
                }
                //createTapReceiver 
            }
        }

        try {
            if (binding._func_) {
                func = binding._func_;
                if(binding.HAVE_CLOSURE)
                    HAVE_CLOSURE = true;
            } else {
                func = Function.apply(Function, names.concat([binding.val]));
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

        this.props = props;
        this.props[1] = new Proxy(func_bound, { set: (obj, name, value) => { obj(name, value); } });
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
            this.props[0] = value;

            if(this.HAVE_CLOSURE)
                this._func_.apply(this, this.props);
            else
                this._func_.apply(this, this.props);
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
