import { IOBase } from "./io";
import { Scheduler } from "../../common/scheduler";

export class FilterIO extends IOBase {
    constructor(source, errors, taps, template, activation, sort, filter) {
        super(template, errors);
        this.template = template;
        this._activation_function_ = null;
        this._sort_function_ = null;
        this._filter_function_ = null;
        this._CAN_USE_ = false;
        this._CAN_FILTER_ = false;
        this._CAN_SORT_ = false;
        this._SCHD_ = false;

        if (activation && activation.binding)
            this._activation_function_ = activation.binding._bind_(source, errors, taps, this);

        if (sort && sort.binding) {
            /** See {@link ExpressionBinding} **/
            let expr = sort.binding;
            if (expr.type == 2 && typeof(expr.func) == "function"){
                this._sort_function_ = expr.func;
                this._CAN_SORT_ = true;
            } 
        }

        if (filter && filter.binding) {
            /** See {@link ExpressionBinding} **/
            let expr = filter.binding;
            if (expr.type == 2 && typeof(expr.func) == "function"){
                this._filter_function_ = expr._bind_(source, errors, taps, this);
                this._filter_function_._IS_A_FILTER_ = true;
                this._CAN_FILTER_ = true;  
            } 
        }
    }

    _scheduledUpdate_() {
        this.template.filterUpdate();
    }
    
    update(){
        Scheduler.queueUpdate(this);
    }

    _destroy_() {
        if (this._sort_function_)
            this._sort_function_._destroy_();
        if (this._activation_function_)
            this._activation_function_._destroy_();
        if (this._filter_function_)
            this._filter_function_._destroy_();
        this._sort_function_ = null;
        this._activation_function_ = null;
        this._filter_function_ = null;
        this.template = null;
    }

    get data() {}
    set data(v) {
        let cache = this._CAN_USE_;
        this._CAN_USE_ = false;
        if (v) this._CAN_USE_ = true;

        if(cache !== this._CAN_USE_)
            this.update();
    }
}