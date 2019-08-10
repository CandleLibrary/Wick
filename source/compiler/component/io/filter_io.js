import spark from "@candlefw/spark";
import { IOBase } from "./io";

let expr_check = (expr) => {
    return (expr.type == 2 && typeof(expr.func) == "function");
};



export class FilterIO extends IOBase {
    constructor(scope, errors, taps, container, activation, sort, filter, limit, offset, scrub, shift) {
     
        super(container, errors);

        this.container = container;
        this._activation_function_ = null;
        this._sort_function_ = null;
        this.filter_function = null;
        this.CAN_USE = false;
        this.CAN_FILTER = false;
        this._CAN_LIMIT_ = false;
        this._CAN_OFFSET_ = false;
        this.CAN_SORT = false;
        this._SCHD_ = 0;
        
        if (activation && activation.binding) {
            this._activation_function_ = activation.binding._bind_(scope, errors, taps, this);
        } else {
            this.CAN_USE = true;
        }

        if (sort && sort.binding) {
            let expr = sort.binding;
            if (expr_check(expr)) {
                this._sort_function_ = (m1, m2) => expr.func(m1.model, m2.model);
                this.CAN_SORT = true;
            }
        } else

        if (filter && filter.binding) {
            let expr = filter.binding;
            if (expr_check(expr)) {
                this.filter_function = expr._bind_(scope, errors, taps, this);
                this.filter_function._IS_A_FILTER_ = true;
                this.CAN_FILTER = true;
            }
        } else

        if (limit && limit.binding) {
            let expr = limit.binding;
            expr.method = (expr.method == 1) ? -1 : expr.method;
            this._limit_function_ = expr._bind_(scope, errors, taps, this);
            this._CAN_LIMIT_ = true;
        } else

        if (offset && offset.binding) {
            this._CAN_OFFSET_ = true;
            if (offset.binding.type == 1) {
                this._value_ = parseInt(offset.binding.val);
            } else {
                let expr = offset.binding;
                expr.method = (expr.method == 1) ? -1 : expr.method;
                this._offset_function_ = expr._bind_(scope, errors, taps, this);
            }
        } else

        if (scrub && scrub.binding) {
            
        
            let expr = scrub.binding;
            expr.method = (expr.method == 1) ? -1 : expr.method;
            this._scrub_function_ = expr._bind_(scope, errors, taps, this);
            this._CAN_SCRUB_ = true;
        } else

        if (shift && shift.binding) {
            let expr = shift.binding;
            expr.method = (expr.method == 1) ? -1 : expr.method;
            this._page_function_ = expr._bind_(scope, errors, taps, this);
            this._CAN_SHIFT_ = true;
        }
    }

    scheduledUpdate() {}

    update() {
        if (this.CAN_SORT || this.CAN_FILTER) {
            this.container.UPDATE_FILTER = true;
            spark.queueUpdate(this.container);
        }
    }

    destroy() {
        if (this._sort_function_)
            this._sort_function_.destroy();
        if (this._activation_function_)
            this._activation_function_.destroy();
        if (this.filter_function)
            this.filter_function.destroy();
        this._sort_function_ = null;
        this._activation_function_ = null;
        this.filter_function = null;
        this.container = null;
    }

    get data() {}
    set data(v) {

        this.CAN_USE = false;
        if (v) this.CAN_USE = true;
        this._value_ = v;

        if (this._CAN_SCRUB_)
            return this.container.scrub(parseFloat(this._value_), false);

        if (this.CAN_SORT || this.CAN_FILTER || this._CAN_SHIFT_)
            this.container.UPDATE_FILTER = true;

        spark.queueUpdate(this.container);
    }
}
