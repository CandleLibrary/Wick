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
import {
    DataTemplate
} from "./data_template"


/**
    Handles the transition of separate elements.
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

    getNamedElements(named_elements) {
        let children = this.element.children;

        for (var i = 0; i < children.length; i++) {
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
    constructor(error_message, presets) {
        var div = document.createElement("div");
        div.innerHTML = `<h2>WICK</h2><h3> This Wick component has failed!</h3> <h4>Error Message</h4><p>${error_message.stack}</p><p>Please contact the website maintainers to address the problem.</p> ${presets.error_contact}`;
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

            if (req = this.data.requesturl) {
                let split = req.split(/\?/)[0];
                let url = split[0],
                    query = split[1];
                if (url)
                    this.getter = new Getter(url);

            }

            if(this.data.model_template && this.data.schema){
                var template = WORKING_DOM.getElementById(this.data.model_template, true);
                console.log(template, WORKING_DOM)
                if(template){
                    new DataTemplate(template, this.model, this.element);
                }
            }

            if (!this.model) {
                debugger
                let model = null;
                if ((model = this.data.schema) && (model = presets.schemas[model])) {
                    this.model_constructor = model;
                } else {

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
    transitionIn(elements, wurl) {

        let query_data = null;
         /* 
            This part of the function will import data into the model that is obtained from the query string 
        */   
        if (wurl && this.data.import) {
            query_data = {};
            if(this.data.import == "null"){
                query_data = wurl.getClass();
            }else{
                var l = this.data.import.split(";")
                for(var i = 0; i < l.length; i++){
                    let n = l[i].split(":");

                    let class_name = n[0];
                    let p = n[1].split("=>");
                    var key_name = p[0];
                    var import_name = p[1];
                    query_data[import_name] = wurl.get(class_name, key_name);
                }
            }
        }

        if (wurl && this.data.url) {
            debugger
            query_data = {};
            if(this.url_query){
                var l = this.url_query.split(";")
                for(var i = 0; i < l.length; i++){
                    let n = l[i].split(":");
                    let class_name = n[0];
                    let p = n[1].split("=>");
                    var key_name = p[0];
                    var import_name = p[1];
                    if(import_name == "root") import_name = null;
                    query_data[import_name] = wurl.get(class_name, key_name);
                }
            }
            debugger
            this.request(query_data)
        }

        if (!this.model) {

            debugger
            this.model = new this.model_constructor();
            

            if (this.getter)
                this.getter.setModel(this.model);

            this.model.addView(this);
        }

        if(query_data)
           this.model.add(query_data);
        else
            this.update(this.model.get());
       
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