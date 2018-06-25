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

        for(var i = 0; i < output.length; i++){
            this.element.appendChild(output[i].element);
        }

        this.element.style.position = this.element.style.position;

        setTimeout(()=>{
            

        for (var i = 0; i < output.length; i++) {    
            output[i].transitionIn(i);
        }

        })
        //Sort and filter the output to present the results on screen.
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
        let object = data.____self____;


        if (this.model) {

            if (this.model == object) {
                debugger;
            } else {
                return null;
            }
        } else {

            let container = object.data[this.prop]

            if (container instanceof ModelContainer) {

                container.addView(this);
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