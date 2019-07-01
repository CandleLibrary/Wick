import ScriptIO from "./script_io.js";
import spark from "@candlefw/spark";

/******************** Expressions **********************/

export default class ExpressionIO extends ScriptIO {
    constructor(ele, scope, errors, tap, binding, lex, pinned) {
        super(scope, errors, tap, binding, lex, pinned);
        this.ele = ele;
        this.old_val = null;
        this._SCHD_ = 0;
        this.ACTIVE = true;
        //this.containerFunction = this.containerFunction.bind(this);
    }

    updateProp(io, val) {
        super.updateProp(io, val);
        this.down();
    }

    scheduledUpdate() {
        
        this.val = super.scheduledUpdate();
        this.ele.data = this.val;

        if(this.val !== this.old_val){
            this.old_val = this.val;
            this.ele.data = this.val;
        }
    }
}
