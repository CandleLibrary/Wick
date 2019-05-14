import { IOBase, IO } from "./io.mjs";
import glow from "@candlefw/glow";
import whind from "@candlefw/whind";
import spark from "@candlefw/spark";

const Globals = new Set([
    "window",
    "document",
    "JSON",
    "HTMLElement",
])

class argumentIO extends IO {
    constructor(scope, errors, tap, script, id){
        super(scope, errors, tap)
        this.ele = script;
        this.id = id;
    }

    destroy(){
        this.id = null;
        super.destroy();
    }

    down(value){
        this.ele.updateProp(this, value);
    }
}


//Function.apply(Function, [binding.arg_key || binding.tap_name, "event", "model", "emit", "presets", "static", "src", binding.val]);
export class ScriptIO extends IOBase {
    constructor(scope, errors, tap, binding, node, statics) {

        let presets = scope.presets;
        let ids = binding.ids;
        let func, HAVE_CLOSURE = false;

        //*********** PRE OBJECT FUNCTION INITIALIZATION *******************//

        const args = binding.args;
        
        const names = args.map(a=>a.name);

        names.push("emit"); // For the injected emit function
        //names.unshift(binding.tap_name);

        const arg_ios = [];

        const props = args.map((a,i)=>{
            
            if(a.IS_TAPPED){
                const arg_io = new argumentIO(scope, errors, scope.getTap(a.name), null, i);
                arg_ios.push(arg_io);
                return null;
            }

            return a.val;
        });
        //props.unshift(null); // Place holder for value data

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

        this.IO_ACTIVATIONS = arg_ios.length;
        this.active_IOS = 0;

        this.function = binding.val;

        this.HAVE_CLOSURE = HAVE_CLOSURE;

        if(this.HAVE_CLOSURE)
            this._func_ = func;
        else
            this._func_ = func.bind(scope);
        
        this.scope = scope;

        //Embedded emit functions
        const func_bound = this.emit.bind(this);
        func_bound.onTick = this.onTick.bind(this);
        
        //TODO: only needed if emit is called in function. Though highly probably. 
        props.push(new Proxy(func_bound, { set: (obj, name, value) => { obj(name, value); } }));

        this.props = props;
        this.arg_ios = arg_ios;

        for(const a of arg_ios)
            a.ele = this;
        
        //this.meta = null;
        this.url = statics.url;

        this.offset = node.offset;
        this.char = node.char;
        this.line = node.line;

        this.val = null;
    }

    /*
        Removes all references to other objects.
        Calls destroy on any child objects.
     */
    destroy() {
        this._func_ = null;
        this.scope = null;
        this._bound_emit_function_ = null;
        this._meta = null;
        this.props = null;

        for(const a of this.arg_ios)
            a.destroy();

        this.arg_ios = null;
    }

    updateProp(io, val){
        this.props[io.id] = val;

        if(!io.ACTIVE){
            io.ACTIVE = true;
            this.active_IOS++;
        }
        
        this.down()
    }

    down(value, meta = { event: null }) {
        //this.meta = meta;
        if(this.active_IOS < this.IO_ACTIVATIONS) 
            return
        
        const src = this.scope;

        try {

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

    /* 
        Same as emit, except the message is generated on the next global tick. 
        Useful for actions which require incremental updates to the UI.
    */
    onTick(name){
        spark.queueUpdate({
            _SCHD_:0, // Meta value for spark;
            scheduledUpdate:(s,d)=>this.emit(name, {step:s,diff:d})
        })
    }
}
