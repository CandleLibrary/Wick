import {
    View
} from "../view"

function ImportDataFromDataSet(data_object, data_set_object, element) {
    if (element) {
        for (let prop in data_set_object) {
            data_object[prop] = data_set_object[prop];
            element.removeAttribute(`data-${prop}`);
        }
    } else {
        for (let prop in data_set_object) {
            data_object[prop] = data_set_object[prop];
        }
    }
}

/*
    Transitioneers
*/

import {
    Transitioneer
} from "../animation/transition/transitioneer"

let PresetTransitioneers = {
    base: Transitioneer
}

class Rivet extends View {

    constructor(parent, element, presets, data) {

        super();

        this.parent = parent;
        this.element = element;
        this.children = [];
        this.data = data;
        this.named_elements = null;
        this.active = false;
        this.export_val = null;

        this.DESTROYED = false;

        //Setting the transitioneer
        this.transitioneer = null;

        if (data.trs) {
            if (presets.transitions && presets.transitions[data.trs])
                this.transitioneer = new presets.transitions[data.trs]();
            else if (PresetTransitioneers[data.trs])
                this.transitioneer = new PresetTransitioneers[data.trs]();

            this.transitioneer.set(this.element)
        }


        ImportDataFromDataSet(this.data, element.dataset);
    }

    destructor() {

        this.DESTROYED = true;

        if (this.LOADED) {


            let t = this.transitionOut();

            for (let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];

                t = Math.max(t, child.transitionOut());
            }
            if (t > 0) {
                setTimeout(() => {
                    this.destructor();
                }, t * 1000 + 5)
            }
        } else {
            this.finalizeTransitionOut();
            this.children.forEach((c) => c.destructor());
            this.children.length = 0;
            this.data = null;

            if (this.element.parentElement)
                this.element.parentElement.removeChild(this.element);

            this.element = null;

            super.destructor()
        }
    }

    bubbleLink(link_url, child, trs_ele = {}) {
        if (this.parent) {

            if (this.data.transition)
                trs_ele[this.data.transition] = this.element;

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
            trs_ele[this.data.transition] = this.element;

        this.children.forEach((e) => {
            if (e.is == 1)
                e.gatherTransitionElements(trs_ele);
        })
    }

    copy(element, index) {
        let out_object = {};

        if (!element) {
            element = this.element.cloneNode(true);
        }

        if (this.children) {
            out_object.element = element.children[this.element];
            out_object.children = new Array(this.children.length);

            for (var i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];
                out_object.children[i] = child.copy(out_object.element);
            }
        }

        return out_object;
    }

    handleUrlUpdate(wurl) {}

    finalizeTransitionOut() {
        for (let i = 0, l = this.children.length; i < l; i++)
            this.children[i].finalizeTransitionOut();

        if (this.transitioneer) {
            this.transitioneer.finalize_out(this.element);
        }

        this.hide();
    }


    /**
      @returns {number} Time in milliseconds that the transition will take to complete.
    */
    transitionIn(index = 0) {

        this.show();

        let transition_time = 0;

        this.LOADED = true;

        for (let i = 0, l = this.children.length; i < l; i++)
            transition_time = Math.max(transition_time, this.children[i].transitionIn(index));

        if (this.transitioneer) {

            transition_time = Math.max(transition_time, this.transitioneer.set_in(this.element, this.data, index));
        }


        return transition_time;
    }

    /**
        Takes as an input a list of transition objects that can be used
    */
    transitionOut(index = 0) {

        let transition_time = 0;

        this.LOADED = false;

        if (this.transitioneer) {

            transition_time = Math.max(transition_time, this.transitioneer.set_out(this.element, this.data, index));
        }

        for (let i = 0, l = this.children.length; i < l; i++)
            transition_time = Math.max(transition_time, this.children[i].transitionOut(index));



        return transition_time;
    }

    updateDimensions() {
        for (var i = 0; i < this.children.length; i++)
            this.children[i].updateDimensions();
    }

    __update__(data, FROM_PARENT = false) {

        let r_data = this.update(data, FROM_PARENT);

        for (let i = 0, l = this.children.length; i < l; i++) {
            this.children[i].__update__(r_data || data, true);
        }
    }

    load() {

    }

    hide() {
        this.display = this.element.style.display;
        this.element.style.display = "none";
    }

    show() {
        if (this.element.style.display == "none")
            this.element.style.display = this.display;
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
    export (exports = {}) {

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
            this.export(value);
        } else if (this.parent && this.parent.add)
            this.parent.add(value)
    }
}

export {
    Rivet
}