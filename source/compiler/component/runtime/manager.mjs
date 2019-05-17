export class ScopeManager {

    constructor(model, element) {
        this.scopes = [];
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
            this.ele = this.scopes[0].ele;
        return this.ele;
    }

    destroy() {
        this.update({dismounted:true});

        for (let i = 0; i < this.scopes.length; i++){
            this.scopes[i].destroy();
        }
        this.scope = null;
        this.model = null;
        this.ele = null;
        this._DESTROYED_ = true;
        this.parent = null;
    }

    emit(name, value) {
        for (let i = 0; i < this.scopes.length; i++)
            this.scopes[i].upImport(name, value, {
                event: {}
            });
    }

    appendToDOM(element, before_element) {
        this._APPEND_STATE_ = true;
        this.mount


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
            let data = {[transition_name]:transition};

            this.update(data);

            if (transition.trs)
                transition_time = transition.trs.out_duration;
            else
                transition_time = transition.out_duration;
        }


        this._TRANSITION_STATE_ = false;
        
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

    upImport(prop_name, data, meta) {
        if (this.parent)
            this.parent.up(prop_name, data, meta, this);
        else
            this.up(prop_name, data, meta)
    }

    up(prop_name, data, meta) {

    }

    down(data, changed_values) {
        for (let i = 0; i < this.scopes.length; i++)
            this.scopes[i].down(data, changed_values);
    }

    update(data, changed_values) {
        for (let i = 0; i < this.scopes.length; i++)
            this.scopes[i].update(data, changed_values);
    }

    bubbleLink() {
        if (this.parent && this.parent.bubbleLink)
            this.parent.bubbleLink(this);
        else
            debugger
    }

    scopeLoaded() {
        this.update({ mounted: true });
    }
}
