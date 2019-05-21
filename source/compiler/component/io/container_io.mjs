import ScriptIO from "./script_io.mjs";
import spark from "@candlefw/spark";

/******************** Expressions **********************/

export default class Container extends ScriptIO {
    constructor(container, scope, errors, tap, binding, lex) {
        super(scope, errors, tap, binding, lex, {});

        this.container = container;

        //Reference to function that is called to modify the host container. 
        this.action = null;

        this.ARRAY_ACTION = false;
    }

    bindToContainer(type, container) {
        this.container = container;

        switch (type) {
            case "sort":
                this.ARRAY_ACTION = true;
                container.filters.push(this);
                this.action = this.sort;
                break;
            case "filter":
                this.ARRAY_ACTION = true;
                container.filters.push(this);
                this.action = this.filter;
                break;
            case "scrub":
                this.action = this.scrub;
                break;
            case "offset":
                this.action = this.offset;
                break;
            case "limit":
                this.action = this.limit;
                break;
            case "shift_amount":
                this.action = this.shift_amount;
                break;
        }
    }

    destroy() {
        super.destroy;
        this.container = null;
    }

    updateProp(io, val) {
        super.updateProp(io, val);
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
        let old = this.val
        this.val = super.down(v, m);

        if (this.ARRAY_ACTION){
            this.container.filterExpressionUpdate();
        }

        else if (this.val !== undefined && val !== old) {
            this.action();
            this.container.limitExpressionUpdate();
        }
    }

    containerFunction(...data) {
        return super.down(data);
    }

    scheduledUpdate() {
        this.ele.data = this.val;
    }

    filter(array) {
        return array.filter((a) => {
            return super.down([a]);
        })
    }

    sort(array) {
        let out_array=  array.sort((a, b) => super.down([a, b]));

        return out_array
    }

    scrub() {
        this.container.scrub = this.val;
    }

    offset() {
        this.container.offset_diff = this.val - this.container.offset;
        this.container.offset = this.val;
    }

    limit() {
        this.container.limit = this.val;
    }

    shift_amount() {
        this.container.shift_amount = this.val;
    }
}