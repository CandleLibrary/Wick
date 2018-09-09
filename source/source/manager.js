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

    _destroy_() {
        for (let i = 0; i < this.sources.length; i++)
            this.sources[i]._destroy_();
        this.source = null;
        this.model = null;
        this.ele = null;
        this._DESTROYED_ = true;
        this.parent = null;
    }

    emit(name, value) {
        for (let i = 0; i < this.sources.length; i++)
            this.sources[i]._upImport_(name, value, { event: {} });
    }

    _appendToDOM_(element) {
        this._APPEND_STATE_ = true;
        if (!this.ele.parentElement || (this.ele.parentElement != element))
            element.appendChild(this.ele);
    }

    _removeFromDOM_() {
        if (this._APPEND_STATE_ == true) return;

        if (this.ele && this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);
    }

    _transitionIn_(transition) {
        let data = {trs_in:(typeof(transition) == "function") ? transition : transition.in}
        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._transitionIn_(data);
    }

    _transitionOut_(transition, DESTROY_ON_REMOVE) {
        if (transition) {
            let data = {trs_out:(typeof(transition) == "function") ? transition : transition.put}
            for (let i = 0, l = this.sources.length; i < l; i++)
                this.sources[i]._transitionOut_(data);
          }

        if (this._TRANSITION_STATE_ === false) {
            console.log("AAAZZZZ");
            // if (DESTROY_ON_REMOVE && !this._DESTROYED_) this._destroy_();
            return;
        }

        this._TRANSITION_STATE_ = false;

        this._APPEND_STATE_ = false;


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
                    else{
                        //ele.style = rule + "";
                    }
                }
            }
        }

        if (transition_time > 0)
            setTimeout(() => { this._removeFromDOM_(); if (DESTROY_ON_REMOVE) this._destroy_(); }, transition_time + 2);
        else {
            this._removeFromDOM_();
            if (DESTROY_ON_REMOVE) this._destroy_();
        }

        return transition_time;
    }

    _down_(data, changed_values) {
        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._down_(data, changed_values);
    }

    _update_(data, changed_values) {
        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._update_(data, changed_values);
    }

    _bubbleLink_(){
        if(this.parent && this.parent._bubbleLink_)
            this.parent._bubbleLink_(this);
        else
            debugger
    }
}