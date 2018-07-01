import {
    Case
} from "./case"

import {
    Filter
} from "./cassette/filter"

import {
    Term
} from "./cassette/term"

import {
    ModelContainer
} from "../model/model_container"

class CaseTemplate extends Case {

    /**
        CaseTemplate constructor. Builds a CaseTemplate object.
      */

    constructor(parent = null, element, presets, data, skeleton) {
        //replace element with a template area

        super(parent, element, presets, data);


        this.cases = [];
        this.case_constructors = [];
        this.filters = [];
        this.range = null;
        this.terms = [];

        this.prop_elements = []


        //need to find the cases in the skeleton, these will be used to create reoccurring objects from the model.

        if (skeleton) {
            for (var i = 0, l = skeleton.length; i < l; i++) {
                let ele = skeleton[i];

                if (ele.IS_CASE)
                    this.case_constructors.push(ele);

                else {

                    if (ele.Constructor == Filter)
                        this.filters.push(ele.____copy____(element, this));

                    if (ele.Constructor == Term)
                        this.terms.push(ele.____copy____(element, this));
                }
            }
        }

        let div = document.createElement("div");

        element.parentElement.replaceChild(div, element);

        this.element = div;

        this.prop = this.data.prop;
    }

    filterUpdate() {

        let output = this.cases.slice();

        for (let l = this.filters.length, i = 0; i < l; i++) {
            output = this.filters[i].filter(output);
        }

        for (var i = 0; i < output.length; i++) {
            this.element.appendChild(output[i].element);
        }

        this.element.style.position = this.element.style.position;

        setTimeout(() => {


                for (var i = 0; i < output.length; i++) {
                    output[i].transitionIn(i);
                }

            })
            //Sort and filter the output to present the results on screen.
    }

    cull(new_items) {
        if (new_items.length == 0) {

            for (let i = 0, l = this.cases.length; i < l; i++)
                this.cases[i].destructor();


            this.cases.length = 0;

        } else {

            let exists = new Map(new_items.map(e => [e, true]));

            var out = [];

            for (let i = 0, l = this.cases.length; i < l; i++)
                if (!exists.has(this.cases[i].model)) {
                    this.cases[i].destructor();
                    this.cases.splice(i, 1);
                    l--;
                    i--;
                } else
                    exists.set(this.cases[i].model, false);


            exists.forEach((v, k, m) => {
                if (v) out.push(k);
            });

            if (out.length > 0)
                this.added(out);
        }
    }

    load(model) {

    }

    removed(items) {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            for (let j = 0; j < this.cases.length; j++) {
                let Case = this.cases[j];

                if (Case.model == item) {
                    this.cases.splice(j, 1);
                    Case.dissolve();
                    break;
                }
            }
        }

        this.filterUpdate();
    }

    added(items) {

        for (let i = 0; i < items.length; i++) {
            let Case = this.case_constructors[0].flesh(items[i]);
            this.cases.push(Case);
        }

        this.filterUpdate();
    }

    revise() {
        if (this.cache)
            this.update(this.cache);
    }


    getTerms() {

        let out_terms = [];

        for (let i = 0, l = this.terms.length; i < l; i++) {
            out_terms.push(this.terms[i].term);
        }

        if (out_terms.length == 0)
            return null;

        return out_terms;
    }

    update(data, IMPORT = false) {

        if (IMPORT) {

            for (let i = 0, l = this.terms.length; i < l; i++) {
                this.terms[i].update(data);
            }

        } else {

            if (!data.____self____)
                return;

            this.cache = data;

            let own_container = data[this.prop].get(this.getTerms());

            if (own_container instanceof ModelContainer) {
                own_container.pin();
                own_container.addView(this);
                this.cull(this.model.get(this.getTerms(), true))
            } else {
                own_container = data.____self____.data[this.prop]
                if (own_container instanceof ModelContainer) {
                    own_container.addView(this);
                    this.cull(this.model.get(this.getTerms(), true))
                }

            }
        }
    }

    transitionIn(elements, wurl) {

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionIn(elements, wurl));

        Math.max(transition_time, super.transitionIn());

        return transition_time;
    }

    /**
        Takes as an input a list of transition objects that can be used
    */
    transitionOut() {

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionOut());

        Math.max(transition_time, super.transitionOut());

        return transition_time;
    }

}

export {
    CaseTemplate
}