import { IOBase, IO } from "./io.js";
import spark from "@candlefw/spark";
import error from "../../../utils/error.js";

class ArgumentIO extends IO {
    constructor(scope, errors, tap, script, id) {
        super(scope, errors, tap);
        this.ele = script;
        this.id = id;
        this.ACTIVE = false;
    }

    destroy() {
        this.id = null;
        super.destroy();
    }

    down(value) {
        this.ele.updateProp(this, value);
    }
}

export default class ScriptIO extends IOBase {

    constructor(scope, node, tap, script, lex, pinned) {
        

        const HAVE_CLOSURE = false;

        super(tap);

        this.scope = scope;
        this.TAP_BINDING_INDEX = script.args.reduce((r, a, i) => (a.name == tap.prop) ? i : r, -1);
        this.ACTIVE_IOS = 0;
        this.IO_ACTIVATIONS = 0;
        this._SCHD_ = 0;
        this.node = node;

        this.function = null;

        this.HAVE_CLOSURE = HAVE_CLOSURE;
        
        if (this.HAVE_CLOSURE)
            this.function = script.function;
        else
            this.function = script.function.bind(scope);

        //Embedded emit functions
        const func_bound = this.emit.bind(this);
        func_bound.onTick = this.onTick.bind(this);

        //TODO: only needed if emit is called in function. Though highly probably. 
        this.arg_props = [];
        this.arg_ios = {};

        this.initProps(script.args, tap, node, pinned);

        this.arg_props.push(new Proxy(func_bound, { set: (obj, name, value) => { obj(name, value) } }));
    }

    /*
        Removes all references to other objects.
        Calls destroy on any child objects.
     */
    destroy() {
        this.function = null;
        this.scope = null;
        this._bound_emit_function_ = null;
        this._meta = null;
        this.arg_props = null;
        this.props = null;

        for (const a in this.arg_ios)
            this.arg_ios[a].destroy();

        this.arg_ios = null;

        super.destroy();
    }

    initProps(arg_array, tap, errors, pinned) {
        for (let i = 0; i < arg_array.length; i++) {

            const a = arg_array[i];
            if (a.IS_ELEMENT) {
                this.arg_props.push(pinned[a.name]);
            } else if (a.IS_TAPPED) {

                let val = null;

                const name = a.name;

                if (name == tap.name) {
                    val = tap.prop;
                    this.TAP_BINDING_INDEX = i;
                }

                this.ACTIVE_IOS++;

                this.arg_ios[name] = new ArgumentIO(this.scope, errors, this.scope.getTap(name), this, i);

                this.arg_props.push(val);
            } else {
                this.arg_props.push(a.val);
            }
        }
    }

    updateProp(io, val) {
        this.arg_props[io.id] = val;

        if (!io.ACTIVE) {
            io.ACTIVE = true;
            this.ACTIVE_IOS++;
        }
    }

    setValue(value, meta) {
        if (typeof(value) == "object") {
            //Distribute iterable properties amongst the IO_Script's own props.
            for (const a in value) {
                if (this.arg_ios[a])
                    this.arg_ios[a].down(value[a]);
            }
        } else {
            if (this.TAP_BINDING_INDEX !== -1){
                this.arg_props[this.TAP_BINDING_INDEX] = value;
            }
        }
    }

    scheduledUpdate() {
        // Check to make sure the function reference is still. May not be if the IO was destroyed between
        // a down update and spark subsequently calling the io's scheduledUpdate method
        
        if (this.function) { 
            try {
                if (this.HAVE_CLOSURE)
                    return this.function.apply(this, this.arg_props);
                else
                    return this.function.apply(this, this.arg_props);
            } catch (e) {
                error(error.IO_FUNCTION_FAIL, e, this.node);
            }
        }
    }

    down(value, meta) {
        if (value)
            this.setValue(value);

        if(meta){
            this.setValue(meta);
            if(meta.IMMEDIATE && this.ACTIVE_IOS >= this.IO_ACTIVATIONS){
                return this.scheduledUpdate();
            }
        }

                if (this.ACTIVE_IOS < this.IO_ACTIVATIONS)
            return;

        if (!this._SCHD_)
            spark.queueUpdate(this);
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
    onTick(name) {
        spark.queueUpdate({
            _SCHD_: 0, // Meta value for spark;
            scheduledUpdate: (s, d) => this.emit(name, { step: s, diff: d })
        });
    }
}
