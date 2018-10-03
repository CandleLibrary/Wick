import { IOBase } from "./io";
import { Scheduler } from "../../common/scheduler";
let expr_check = (expr)=>{
    return (expr.type == 2 && typeof(expr.func) == "function");
};



export class FilterIO extends IOBase {
    constructor(source, errors, taps, template, activation, sort, filter, limit, offset, scrub, shift) {
        super(template, errors);

        this.template = template;
        this._activation_function_ = null;
        this._sort_function_ = null;
        this._filter_function_ = null;
        this._CAN_USE_ = false;
        this._CAN_FILTER_ = false;
        this._CAN_LIMIT_ = false;
        this._CAN_OFFSET_ = false;
        this._CAN_SORT_ = false;
        this._SCHD_ = 0;

        if (activation && activation.binding){
            this._activation_function_ = activation.binding._bind_(source, errors, taps, this);
        } else{
            this._CAN_USE_ = true;
        }

        if (sort && sort.binding) {
            let expr = sort.binding;
            if (expr_check(expr)){
                this._sort_function_ = expr.func;
                this._CAN_SORT_ = true;
            } 
        }else

        if (filter && filter.binding) {
            let expr = filter.binding;
            if (expr_check(expr)){
                this._filter_function_ = expr._bind_(source, errors, taps, this);
                this._filter_function_._IS_A_FILTER_ = true;
                this._CAN_FILTER_ = true;  
            } 
        }else

        if (limit && limit.binding) {
            let expr = limit.binding;
                expr.method = (expr.method == 1) ? -1 : expr.method;
                this._limit_function_ = expr._bind_(source, errors, taps, this);
                ///this._limit_function_._IS_A_FILTER_ = true;
                this._CAN_LIMIT_ = true;  
        }else

        if (offset && offset.binding) {
            let expr = offset.binding;
                expr.method = (expr.method == 1) ? -1 : expr.method;
                this._offset_function_ = expr._bind_(source, errors, taps, this);
                ///this._limit_function_._IS_A_FILTER_ = true;
                this._CAN_OFFSET_ = true;  
        }else

        if (scrub && scrub.binding) {
            let expr = scrub.binding;
                expr.method = (expr.method == 1) ? -1 : expr.method;
                this._scrub_function_ = expr._bind_(source, errors, taps, this);
                ///this._limit_function_._IS_A_FILTER_ = true;
                this._CAN_SCRUB_ = true;  
        }else

        if (shift && shift.binding) {
            let expr = shift.binding;
                expr.method = (expr.method == 1) ? -1 : expr.method;
                this._page_function_ = expr._bind_(source, errors, taps, this);
                ///this._limit_function_._IS_A_FILTER_ = true;
                this._CAN_SHIFT_ = true;  
        }
    }

    _scheduledUpdate_() {}
    
    update(){
        if(this._CAN_SORT_ || this._CAN_FILTER_){
            this.template.UPDATE_FILTER = true;
            Scheduler.queueUpdate(this.template);
        }
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

        this._CAN_USE_ = false;
        if (v) this._CAN_USE_ = true;
        this._value_ = v;

        if(this._CAN_SCRUB_)
            return this.template.scrub(this._value_, false);
        
        if(this._CAN_SORT_ || this._CAN_FILTER_ || this._CAN_SHIFT_)
            this.template.UPDATE_FILTER = true;
        
        Scheduler.queueUpdate(this.template);
    }
}