import { TemplateString, BooleanIO } from "./io.mjs";
import { NOOPTap } from "../tap/tap.mjs";

/******************** Expressions **********************/

export class ExpressionIO extends TemplateString {

    constructor(scope, errors, taps, element, binds, func) {
        super(scope, errors, taps, element, binds);
        this._expr_function_ = func;
        this._value_ = null;
        this._filter_expression_ = null;
        this._bl_ = this.binds.length;
    }

    destroy() {
        this._bl_ = null;
        this._filter_expression_ = null;
        this._value_ = null;
        this._expr_function_ = null;
        super.destroy();
    }

    set _IS_A_FILTER_(v) {
        if (v == true) {
            var model_arg_index = -1;
            var index_arg_index = -1;

            for (let i = 0, l = this._bl_; i < l; i++) {
                let bind = this.binds[i];
                if (bind.parent.prop == "model" || bind.parent.prop == "m") {
                    model_arg_index = i;
                }

                if (bind.parent.prop == "index" || bind.parent.prop == "i") {
                    index_arg_index = i;
                }
            }

            this._filter_expression_ = (scope, index) => {
                const args = [];

                for (let i = 0, l = this._bl_; i < l; i++) {
                    if (i == model_arg_index) { args.push(scope.model); continue; }
                    if (i == index_arg_index) { args.push(index); continue; }
                    args.push(this.binds[i]._value_);
                }

                return this._expr_function_.apply(null, args);
            };
        }
    }

    get _IS_A_FILTER_() { return typeof(this._filter_expression_) == "function"; }

    scheduledUpdate() {
        if (this._IS_A_FILTER_) {
            this.ele.update();
        } else {

            const args = [];

            for (let i = 0; i < this.binds.length; i++) {
                if (this.binds[i]._value_ === null) return;
                args.push(this.binds[i]._value_);
            }

            this._value_ = this._expr_function_.apply(null, args);
            this.ele.data = this._value_;
        }
    }
}

export class AttribExpressionIO extends ExpressionIO {
    
    constructor(scope, errors, taps, element, binds, func, attrib) {
        super(scope, errors, taps, element, binds, func);
        this.attrib = attrib;
    }

    destroy(){
        this.attrib = "";
        super.destroy();
    }

    scheduledUpdate() {
        const args = [];

        for (let i = 0; i < this.binds.length; i++) {
            if (this.binds[i]._value_ === null) return;
            args.push(this.binds[i]._value_);
        }

        this._value_ = this._expr_function_.apply(null, args);
        this.ele.setAttribute(this.attrib, this._value_);
    }
}

export class BooleanExpressionIO extends ExpressionIO {
    constructor(scope, errors, taps, element, binds, func) {
        super(scope, errors, taps, element, binds, func);
        Object.assign(this, new this.constr(scope, errors, NOOPTap, element))
    }

    destroy(){
        BooleanIO.prototype.destroy.apply(this);
        super.destroy();
    }

    scheduledUpdate() {
        const args = [];
        for (let i = 0; i < this.binds.length; i++)
            args.push(this.binds[i]._value_);
        this.boolDown(this._expr_function_.apply(null, args));
    }
}
BooleanExpressionIO.prototype.constr = BooleanIO.prototype.constructor;
BooleanExpressionIO.prototype.boolDown = BooleanIO.prototype.down;

export class InputExpressionIO extends ExpressionIO {
    scheduledUpdate() {
        if (this._IS_A_FILTER_) {
            this.ele.update();
        } else {
            const args = [];
            for (let i = 0; i < this.binds.length; i++)
                args.push(this.binds[i]._value_);

            this._value_ = this._expr_function_.apply(null, args);
            this.ele.value = this._value_;
        }
    }
}
