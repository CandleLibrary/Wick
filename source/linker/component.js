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


/**
    Handles the transition of seperate elements.
*/
class Component extends View {
    constructor(element) {
            super();
            this.element = element;
            this.anchor = null;
            this.LOADED = false;
        }
    /**
      	Takes as an input a list of transition objects that can be used
    */
    transitionIn(elements, query) {
        this.LOADED = true;
    }
    /**
      @returns {number} Time in milliseconds that the transtion will take to complete.
    */
    transitionOut() {
        this.LOADED = false;
        return 0;
    }

    getNamedElements(named_elements){
        let children = this.element.children;

        for(var i = 0; i < children.length; i++){
            let child = children[i];

            if (child.dataset.transform) {
                named_elements[child.dataset.transform] = child;
            }
        }
    }
}

/**
    This is a fallback component if constructing a CaseComponent or normal Component throws an error.
*/


class FailedComponent extends Component {
    constructor(error_messge, presets){
        var div = document.createElement("div");
        div.innerHTML = `<h2>WICK</h2><h3> This Wick component has failed!</h3> <h4>Error Message</h4><p>${error_messge}</p><p>Please contact the website maintainers to address the problem.</p> ${presets.error_contact}`;
        super(div);
    }
}
/**
    This Component extends the Case class.
*/
class CaseComponent extends Case {
    constructor(element, presets, model_constructors, query, WORKING_DOM) {
        super(element, presets, null, WORKING_DOM);

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
            if ((model = this.element.dataset.schema) && (model = presets.schemas[model])) {
                this.model_constructor = model;
            }else{

                /**
                    There is no model or schema set for this Case object. This will result in undefined behavior, as all cases are intended to be associated with a model. Thus, we'll kill this case construction and throw a warning about it.
                */
                var error = `No model found in the presets for this component which requires${(this.data.model)?` a model named:  "${this.data.model}"`: ` a schema named: "${this.data.schema}"`}.`;

                console.warn(error)

                return new FailedComponent(error, presets);
            }

            this.model = null;
        }

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
        this.LOADED = true;
        this.show();
    }

    transitionOut() {
        this.LOADED = false;
        this.hide();
    }

    getNamedElements(named_elements){
        for(let comp_name in this.named_components){
            named_elements[comp_name] = this.named_components[comp_name];
        }
    }
}

export {
    Component,
    CaseComponent,
    FailedComponent
}
