import {
    View
} from "../view"
import {
    Getter
} from "../getter"
import {
    Case
} from "../case"
import {
    TurnDataIntoQuery
} from "../common"

class Component extends View {
    constructor(element) {
            super();
            this.element = element;
            this.anchor = null;
            this.LOADED = false;
        }
        /*
        	Takes as an input a list of transition objects that can be used 
        */
    transitionIn(elements, query) {
    }

    transitionOut() {

    }
}

class CaseComponent extends Case {
    constructor(element, presets, model_constructors, query, WORKING_DOM) {
        super(element, presets, null, WORKING_DOM);


        //get the request id from the element.
        console.log(this.element)

        this.getter = null;
        this.model_constructor = null;

        let req = null;
        if (req = this.element.dataset.requesturl) {
            let split = req.split(/\?/)[0];
            let url = split[0],
                query = split[1];
            if (url) {
                this.getter = new Getter(url);
            }
        }

        if (!this.model) {
            let model = null;

            if ((model = this.element.dataset.schema) && (model = presets.models[model])) {
                this.model_constructor = model;
            }

            this.model = null;
        }

        console.log(this.model_constructor, model_constructors)

        this.anchor = null;
        this.LOADED = false;
    }

    /*
    	Takes as an input a list of transition objects that can be used 
    */
    transitionIn(elements, query) {

        //if(this.getter && this.model_constructor){
        if (query && this.element.dataset.import) {
            //import data from query into model.
            let imports = this.element.dataset.import;

            imports.split(",").forEach(()=>{

            })

        }

        if (!this.model) {

            this.model = new this.model_constructor();

            if (this.getter)
                this.getter.setModel(this.model);

            this.model.add(query);

            this.model.addView(this);
                //if(query)
                //	this.getter.request(TurnDataIntoQuery(query))
        } else {
            this.model.add(query);
        }
        //}

        this.show();
    }

    transitionOut() {

        this.hide();
    }
}

export {
    Component,
    CaseComponent
}