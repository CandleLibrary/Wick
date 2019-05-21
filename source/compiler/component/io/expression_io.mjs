import ScriptIO from "./script_io.mjs";
import spark from "@candlefw/spark";

/******************** Expressions **********************/

export default class ExpressionIO extends ScriptIO {
    constructor(ele, scope, errors, tap, binding, lex) {
        super(scope, errors, tap, binding, lex, {})
        this.ele = ele;
        this._SCHD_ = 0;
        this.IS_FILTER = false;
        this.ACTIVE = false;
        this.containerFunction = this.containerFunction.bind(this);
    }

    updateProp(io, val) {
        super.updateProp(io, val);
        if (!this._SCHD_)
            this.down();
    }

    setValue(value) {
        if (Array.isArray(value)) {
            value.forEach((v, i) => this.arg_props[i] = v);
            this.active_IOS = this.IO_ACTIVATIONS;
        } else if (typeof(value) == "object") {
            //Distribute iterable properties amongst the IO_Script's own props.
            for (const a in value) {
                if (this.arg_ios[a])
                    this.arg_ios[a].down(value[a]);
            }
        } else {
            if (this.TAP_BINDING !== -1)
                this.arg_props[this.TAP_BINDING] = value;
        }
    }

    down(v, m) {
        
        if(this.IS_FILTER)
            this.ele.filterExpressionUpdate();
        else
            this.val = super.down(v, m);
    }

    containerFunction(...data) {
        return super.down(data);
    }

    scheduledUpdate() {
        if(!this.IS_FILTER)
            this.ele.data = this.val;
    }
}