export class SourceManager {
    
    constructor(model, element) {
        this.sources = [];
        this.model = model;
        this.ele = element;
        this.index = -1;
        this._APPEND_STATE_ = false;
        this._TRANSITION_STATE_ = false;
    }

    _destroy_() {
        for (let i = 0; i < this.sources.length; i++)
            this.sources[i]._destroy_();
        this.source = null;
        this.model = null;
        this.ele = null;
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
        if(this._APPEND_STATE_ == true) return;
        
        if (this.ele.parentElement)
            this.ele.parentElement.removeChild(this.ele);
    }

    _transitionIn_() {
        if(this._TRANSITION_STATE_ === true) return;
        this._TRANSITION_STATE_ = true;
        this._APPEND_STATE_ = true;
        for (let i = 0, l = this.sources.length; i < l; i++) {

            let ast = this.sources[i].ast;

            let css = ast.css;

            let hooks = this.sources[i].hooks;

            for (let i = 0, l = hooks.length; i < l; i++) {

                let hook = hooks[i];
                let ele = hook.ele;

                if (ele.getAttribute("trs") == "in") continue;
                
                ele.setAttribute("trs", "in");

                if (css) {

                    let rule = css.getApplicableRules(ele);

                    if (hook.style) {
                        hook.style._setRule_(rule);
                    } else {
                        ele.style = rule + "";
                    }
                    //debugger
                }
            }
        }
    }

    _transitionOut_(DESTROY_ON_REMOVE) {

        if(this._TRANSITION_STATE_ === false) return;
        this._TRANSITION_STATE_ = false;

        this._APPEND_STATE_ = false;

        let transition_time = 0;

        for (let i = 0, l = this.sources.length; i < l; i++) {

            let ast = this.sources[i].ast;

            let css = ast.css;

            let hooks = this.sources[i].hooks;

            for (let i = 0, l = hooks.length; i < l; i++) {

                let hook = hooks[i];
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
                    else
                        ele.style = rule + "";
                }
            }
        }

        if (transition_time > 0) 
            setTimeout(()=>this._removeFromDOM_(), transition_time + 32);
        else
            this._removeFromDOM_();

        return transition_time;
    }

    _down_(data, changed_values) {
        for (let i = 0, l = this.sources.length; i < l; i++)
            this.sources[i]._down_(data, changed_values);
    }
}