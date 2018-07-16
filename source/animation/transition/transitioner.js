import { CSS_Length } from "../../common/css/types/length"

export class Transitioner {

    constructor(data, css, trs) {
        /* extract transition information from CSS or the data */
        this.in_time = 0;
        this.out_time = 0;


        if (data.class && css) {
            let $class = data.class.split(" ")[0];

            if(trs[$class]) return trs[$class];

            let in_selector = `.${$class}[trs=in]`;
            let out_selector = `.${$class}[trs=out]`;

            let class_rule = css.getRule(`.${$class}`);
            let in_rule = css.getRule(in_selector);
            let out_rule = css.getRule(out_selector);

            if (in_rule && out_rule) {
                //look for a transition time on the main rule
                if (class_rule) {
                    let transition = class_rule.props.transition;
                    if (transition)
                        this.out_time = this.in_time = getTransitionTotalLength(transition);
                }

                let transition = in_rule.props.transition;

                if (in_rule.props.transition)
                    this.in_time = getTransitionTotalLength(in_rule.props.transition);

                if (out_rule.props.transition)
                    this.out_time = getTransitionTotalLength(out_rule.props.transition);

                trs[$class] = this;

                return this;
            }
            
            return undefined;
        }

    }

    set_in() {
        return this.in_time * (this.in_time.unit == "s") ? 1 : 1000;
    }

    set_out() {        
        return this.out_time * (this.out_time.unit == "s") ? 1 : 1000;
    }

    finalize_out() {
    }
}

function max(left, right){
    let l = left * (left.unit == "s") ? 1 : 1000;
    let r = right * (right.unit == "s") ? 1 : 1000;

    if(l < r)
        return left
    else
        return right

}

function getTransitionTotalLength(transition) {

    let f = (trs) => {
        for (let i = 0; i < 4; i++) {
            if (trs[i] instanceof CSS_Length)
                return trs[i]
        }

        return new CSS_Length(0, "s");
    }

    let time = new CSS_Length(0, "s");

    if (Array.isArray(transition[0]))
        transition.forEach((a) => { time = max(f(a), time); })
    else
        time = max(f(transition), time);

    return time;
}