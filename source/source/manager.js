export class SourceManager {

    constructor(model, element) {
        this.sources = [];
        this.model = model;
        this.ele = element;
        this.index = -1;
        this._APPEND_STATE_ = false;
        this._TRANSITION_STATE_ = false;
        this._DESTROYED_ = false;
        this.parent = null;
    }

    get element() {
        if (!this.ele)
            this.ele = this.sources[0].ele;
        return this.ele;
    }

    destroy() {
        for (let i = 0; i < this.sources.length; i++)
            this.sources[i].destroy();
        this.source = null;
        this.model = null;
        this.ele = null;
        this._DESTROYED_ = true;
        this.parent = null;
    }

    emit(name, value) {
        for (let i = 0; i < this.sources.length; i++)
            this.sources[i]._upImport_(name, value, {
                event: {}
            });
    }

    appendToDOM(element, before_element) {
        this._APPEND_STATE_ = true;
        if (before_element)
            element.insertBefore(this.element, before_element);
        else
            element.appendChild(this.element);
    }

    _removeFromDOM_() {

        if (this._APPEND_STATE_ == true) return;

        if (this.ele && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);
    }

    transitionIn(transition, transition_name = "trs_in") {

        if (transition) {
            let data = {};

            data[transition_name] = transition;

            this.update(data);
        }

        this._TRANSITION_STATE_ = true;
    }

    transitionOut(transition, transition_name = "trs_out", DESTROY_ON_REMOVE = false) {

        this._APPEND_STATE_ = false;

        if (this._TRANSITION_STATE_ === false) {
            // if (DESTROY_ON_REMOVE && !this._DESTROYED_) this.destroy();
            this._removeFromDOM_();
            return;
        }

        let transition_time = 0;

        if (transition) {
            let data = {};

            data[transition_name] = transition;

            this.update(data);

            if (transition.trs)
                transition_time = transition.trs.out_duration;
            else
                transition_time = transition.out_duration;
        }


        this._TRANSITION_STATE_ = false;


        /*
        for (let i = 0, l = this.sources.length; i < l; i++) {

            let ast = this.sources[i].ast;

            let css = ast.css;

            let hooks = this.sources[i].hooks;

            for (let i = 0, l = hooks.length; i < l; i++) {

                let hook = hooks[i];

                if (!hook) continue;
                let ele = hook.ele;

                if (ele.getAttribute("trs") == "out") continue;
                ele.setAttribute("trs", "out");

                if (css) {
                    let rule = css.getApplicableRules(ele);

                    for (let name in rule.props)
                        if (name == "transition")
                            for (let i = 0, prop = rule.props[name]; i < prop.length; i++) {
                                let sub_prop = prop[i];
                                if (!isNaN(sub_prop))
                                    transition_time = Math.max(transition_time, sub_prop.milliseconds);

                            }

                    if (hook.style)
                        hook.style._setRule_(rule);
                    else {
                        //ele.style = rule + "";
                    }
                }
            }
        }*/

        if (transition_time > 0)
            setTimeout(() => {
                this._removeFromDOM_();
                if (DESTROY_ON_REMOVE) this.destroy();
            }, transition_time + 2);
        else {
            this._removeFromDOM_();
            if (DESTROY_ON_REMOVE) this.destroy();
        }

        return transition_time;
    }

    _upImport_(prop_name, data, meta) {
        if (this.parent)
            this.parent.up(prop_name, data, meta, this);
    }

    down(data, changed_values) {
        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i].down(data, changed_values);
    }

    update(data, changed_values) {
        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i].update(data, changed_values);
    }

    bubbleLink() {
        if (this.parent && this.parent.bubbleLink)
            this.parent.bubbleLink(this);
        else
            debugger
    }
}