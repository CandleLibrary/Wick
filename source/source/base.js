import { View } from "../view/view"

import { AnyModel } from "../model/model"

/* Transitioners */

import { Transitioner } from "../animation/transition/transitioner"

export class SourceBase extends View {

    constructor(parent = null, data = {}, presets = {}, element = null) {

        super();

        if(element){
            if(data.class)
                element.classList.value = data.class;
        }

        this.parent = parent;
        this.ele = element;
        this.children = [];
        this.data = data;
        this.named_elements = null;
        this.active = false;
        this.export_val = null;

        this.DESTROYED = false;
        this.ACTIVE = false;

        this.IS_SOURCE = true;

        //Setting the transitioner
        this.trs = null//new Transitioner(this.ele);

        this.addToParent();
    }

    addToParent() {
        if (this.parent) this.parent.children.push(this);
    }

    destroy() {

        this.DESTROYED = true;

        if (this.LOADED) {


            let t = this.transitionOut();

            for (let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];

                t = Math.max(t, child.transitionOut());
            }

            if (t > 0)
                setTimeout(() => { this.destroy(); }, t * 1000 + 5)


        } else {
            this.finalizeTransitionOut();
            this.children.forEach((c) => c.destroy());
            this.children.length = 0;
            this.data = null;

            if (this.ele && this.ele.parentElement)
                this.ele.parentElement.removeChild(this.ele);

            this.ele = null;

            super.destroy()
        }
    }

    bubbleLink(link_url, child, trs_ele = {}) {

        if (this.parent) {

            if (this.data.transition)
                trs_ele[this.data.transition] = this.ele;

            for (var i = 0, l = this.children.length; i < l; i++) {

                let ch = this.children[i];

                if (ch !== child)
                    ch.gatherTransitionElements(trs_ele);
            }

            this.parent.bubbleLink(link_url, this, trs_ele)
        } else {
            history.pushState({}, "ignored title", link_url);
            window.onpopstate();
        }
    }

    getNamedElements(named_elements) {}

    gatherTransitionElements(trs_ele) {

        if (this.data.transition && !trs_ele[this.data.transition])
            trs_ele[this.data.transition] = this.ele;

        this.children.forEach((e) => {
            if (e.is == 1)
                e.gatherTransitionElements(trs_ele);
        })
    }

    copy(element, index) {
        debugger

        let out_object = {};

        if (!element)
            element = this.ele.cloneNode(true);

        if (this.children) {
            out_object.ele = element.children[this.ele];
            out_object.children = new Array(this.children.length);

            for (let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];
                out_object.children[i] = child.copy(out_object.ele);
            }
        }

        return out_object;
    }

    finalizeTransitionOut() {

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].finalizeTransitionOut();

        if (this.trs)
            this.trs.finalize_out(this.ele);

        this.hide();
    }


    /**
      @returns {number} Time in milliseconds that the transition will take to complete.
    */
    transitionIn(index = 0) {

        this.show();

        let transition_time = 0;

        this.ACTIVE = true;

        if(this.ele)
            this.ele.setAttribute("trs","in");

        if(this.trs)
            transition_time = this.trs.set_in(this.ele, this.data);
        /*
        for (let i = 0, l = this.children.length; i < l; i++)
            transition_time = Math.max(transition_time, this.children[i].transitionIn(index));
        */
        return transition_time;
    }

    /**
        Takes as an input a list of transition objects that can be used
    */
    transitionOut(index = 0, DESTROY = false) {

        let transition_time = 0;

        this.ACTIVE = false;

        if(this.ele)
            this.ele.setAttribute("trs","in");

        if (this.trs)
            transition_time = Math.max(transition_time, this.trs.set_out(this.ele, this.data, index));

        for (let i = 0, l = this.children.length; i < l; i++)
            transition_time = Math.max(transition_time, this.children[i].transitionOut(index));

        if (DESTROY)
            setTimeout(() => {
                this.finalizeTransitionOut();
                this.destroy();
            }, transition_time * 1000);

        return transition_time;
    }

    updateDimensions() {

        for (var i = 0; i < this.children.length; i++)
            this.children[i].updateDimensions();
    }

    /**
        Called by  parent when data is update and passed down from further up the graph. 
        @param {(Object | Model)} data - Data that has been updated and is to be read. 
        @param {Array} changed_properties - An array of property names that have been updated. 
        @param {Boolean} IMPORTED - True if the data did not originate from the model watched by the parent Source. False otherwise.
    */
    __down__(data, changed_properties = null, IMPORTED = false) {

        let r_val = this.down(data, changed_properties, IMPORTED);

        if (r_val)(data = r_val, IMPORTED = true);

        for (let i = 0, l = this.children.length; i < l; i++){
            let child = this.children[i]
            child.__down__(data, changed_properties, (child.IS_SOURCE) ? true : IMPORTED);
        }
    }

    down(data, changed_properties = null, IMPORTED) {}

    /**
        Called by  parent when data is update and passed up from a leaf. 
        @param {(Object | Model)} data - Data that has been updated and is to be read. 
        @param {Array} changed_properties - An array of property names that have been updated. 
        @param {Boolean} IMPORTED - True if the data did not originate from the model watched by the parent Source. False otherwise.
    */
    __up__(data) {

        if (this.parent)
            this.parent(up);
    }

    up(data) {

        if (data)
            this.__up__(data)
    }

    __update__(data, FROM_PARENT = false) {

        let r_data = this.update(data, FROM_PARENT);

        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].__update__(r_data || data, true);
    }

    load(model) {
        for (var i = 0; i < this.children.length; i++)
            this.children[i].load(model);
    }

    hide() {

        if (this.ele) {

            this.display = this.ele.style.display;
            this.ele.style.display = "none";
        }
    }

    show() {

        if (this.ele)
            if (this.ele.style.display == "none")
                this.ele.style.display = this.display;
    }

    __updateExports__(data) {

        if (this.data.export && data[this.data.export])
            this.export_val = data[this.data.export];
    }

    __getExports__(exports) {

        if (this.export_val)
            exports[this.data.export] = this.export_val;
    }

    /**
        Exports data stored from updateExports() into a an Object exports and calls it's parent's export function, passing exports
    */
    export (exports = new AnyModel) {

        if (this.parent && this.parent.export) {


            this.__getExports__(exports)

            for (let i = 0, l = this.children.length; i < l; i++)
                this.children[i].__getExports__(exports);

            this.parent.export(exports);
        }
    }

    import (data) {

        if (this.model)
            this.model.add(data);

        this.export(data);
    }

    updateExports(data) {

        if (this.data.export && data[this.data.export])
            this.export = data[this.data.export];
    }

    add(value) {

        if (this.model) {
            this.model.add(value);
            this.export(this.model);
        } else if (this.parent && this.parent.add)
            this.parent.add(value)
    }
}