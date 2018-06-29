import {
    Case
} from "./case"

import {
    Filter
} from "./cassette/filter"

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


        //need to find the cases in the skeleton, these will be used to create reoccurring objects from the model.

        if (skeleton) {
            for (var i = 0, l = skeleton.length; i < l; i++) {
                let element = skeleton[i];

                if (element.IS_CASE)
                    this.case_constructors.push(element);

                else

                if (element.constructor == Filter)
                    this.filters.push(element.____copy____(element, this));
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
                    this.cases.slice(i, 1);
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

    update(data) {

        if (!data.____self____)
            return;

        let d = data[this.prop].get(this.range);

        let own_container = d.____self____;

        if (own_container instanceof ModelContainer) {
            own_container.pin();
            own_container.addView(this);
            this.cull(this.model.get(null))
        } else {
            own_container = data.____self____.data[this.prop]
            if (own_container instanceof ModelContainer) {
                own_container.addView(this);
                this.cull(this.model.get(null))
            }

        }

        return;
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