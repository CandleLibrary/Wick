import ScriptIO  from "./script_io.mjs";
import spark from "@candlefw/spark";

/******************** Expressions **********************/

export default class ExpressionIO extends ScriptIO {
    constructor(ele, scope, errors, tap, binding, lex){
        super(scope, errors, tap, binding, lex, {})
        this.ele = ele;   
        this._SCHD_ = 0;
    }

    updateProp(io, val){
        super.updateProp(io,val);
        this.down();
    }

    down(v,m){
        this.val = super.down(v,m);
        spark.queueUpdate(this);
    }

    scheduledUpdate() {
        this.ele.data = this.val;
    }   
}