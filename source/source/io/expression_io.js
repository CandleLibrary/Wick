import { TemplateString } from "./io";
/******************** Expressions **********************/

export class ExpressionIO extends TemplateString {

    constructor(source, errors, taps, element, binds, func) {
        super(source, errors, taps, element, binds);
        this._expr_function_ = func;
        this._value_ = "";
        this._filter_expression_ = null;
        this._bl_ = this.binds.length;
    }

    _destroy_(){
        this._expr_function_ = null;
        this._value_ = null;
        this._filter_expression_ = null;
        this._bl_ = null;
        super._destroy_();
    }

    set _IS_A_FILTER_(v) {
        if (v == true) {
            var model_arg_index = -1;

            for (let i = 0, l = this._bl_; i < l; i++) {
                let bind = this.binds[i];
                if (bind.parent._prop_ == "model" || bind.parent._prop_ == "m") {
                    model_arg_index = i;
                    break;
                }
            }

            this._filter_expression_ = (source) => {
                const args = [];
                for (let i = 0, l = this._bl_; i < l; i++) {
                    if (i == model_arg_index) { args.push(source.model); continue; }
                    args.push(this.binds[i]._value_);
                }
                return this._expr_function_.apply(null, args);
            };
        }
    }

    get _IS_A_FILTER_() { return typeof(this._filter_expression_) == "function"; }

    _scheduledUpdate_() {
        if (this._IS_A_FILTER_) {
            this.ele.update();
        } else {
            const args = [];
            for (let i = 0; i < this.binds.length; i++)
                args.push(this.binds[i]._value_);
            this._value_ = this._expr_function_.apply(null, args);
            this.ele.data = this._value_;
        }
    }
}

export class InputExpresionIO extends ExpressionIO{
    _scheduledUpdate_() {
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