import ScriptIO from "./script_io.js";

/******************** Expressions **********************/

export default class ExpressionIO extends ScriptIO {

    get type () { return "ExpressionIO"}

    static stamp(id, scope, binding){
        (binding.args.map(e=>scope.addActivation(e.name)));
        return scope.addExpressionConst(binding.origin_val);
    }

    constructor(ele, scope, errors, tap, binding, lex, pinned) {
        super(scope, errors, tap, binding, lex, pinned);
        this.ele = ele;
        this.old_val = null;
        this._SCHD_ = 0;
        this.ACTIVE = true;
    }

    updateProp(io, val) {
        super.updateProp(io, val);
        this.down();
    }

    scheduledUpdate() {
        this.val = super.scheduledUpdate();

        if(this.val !== this.old_val){
            this.old_val = this.val;
            this.ele.data = this.val;
        }
    }
}
