import {
    Rivet
} from "./rivet"
import {
    Model
} from "../model/model"
import {
    Controller
} from "../controller"
import {
    Getter
} from "../getter"
import {
    Cassette
} from "./cassette/cassette"

class Case extends Rivet {

    /**
        Case constructor. Builds a Case object.
        @params [DOMElement] element - A DOM <template> element that contains a <case> element.
        @params [LinkerPresets] presets
        @params [Case] parent - The parent Case object, used internally to build Case's in a hierarchy
        @params [Model] model - A model that can be passed to the case instead of having one created or pulled from presets. 
        @params [DOM]  WORKING_DOM - The DOM object that contains templates to be used to build the case objects. 
    */
    constructor(parent = null, data, presets) {

        super(parent, data, presets)

        this.USE_SECURE = presets.USE_HTTPS;
        this.named_elements = {};
        this.template = null;
        this.prop = null;
        this.url = null;
        this.presets = presets;
        this.receiver = null;
        this.query = {};
        this.REQUESTING = false;
        this.exports = null;


        this.filter_list = [];
        this.templates = [];
        this.filters = [];
        this.is = 0;
    }

    destructor() {

        this.parent = null;

        if (this.receiver)
            this.receiver.destructor();

        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].destructor();

        super.destructor();
    }

    /**
        Sets up Model connection or creates a new Model from a schema.
    */
    load(model) {
        
        if (this.data.url) {
            //import query info from the wurl
            let str = this.data.url;
            let cassettes = str.split(";");
            this.data.url = cassettes[0];

            for (var i = 1; i < cassettes.length; i++) {
                let cassette = cassettes[i];

                switch (cassette[0]) {
                    case "p":
                        //TODO
                        this.url_parent_import = cassette.slice(1)
                        break;
                    case "q":
                        this.url_query = cassette.slice(1);
                        break;
                    case "<":
                        this.url_return = cassette.slice(1);
                }
            }
        }

        this.prop = this.data.prop;

        if (this.data.export) this.exports = this.data.export;

        if (this.model) {
            model = this.model;
            this.model = null;
        }

        if (model && model instanceof Model) {

            if (this.schema) {
                /* Opinionated Case - Only accepts Models that are of the same type as its schema.*/
                if (model.constructor != this.schema) {
                    //throw new Error(`Model Schema ${this.model.schema} does not match Case Schema ${presets.schemas[this.data.schema].schema}`)
                }else
                    this.schema = null;
                
            }
            this.model = null;
        } 

        if (this.schema) 
            model = new this.schema();

        model.addView(this);

        if (this.model) {
            if (this.data.url) {
                this.receiver = new Getter(this.data.url, this.url_return);
                this.receiver.setModel(model);
                this.____request____();
            }
        } else 
            throw new Error(`No Model could be found for Case constructor! Case schema "${this.data.schema}", "${this.presets.schemas[this.data.schema]}"; Case model "${this.data.model}", "${this.presets.models[this.data.model]}";`);

        for (var i = 0; i < this.children.length; i++) 
            this.children[i].load(this.model);
    }

    ____request____(query) {

        this.receiver.get(query, null, this.USE_SECURE).then(() => {
            this.REQUESTING = false;
        });
        this.REQUESTING = true;
    }

    export (exports) {

        this.updateSubs(this.children, exports, true);

        super.export(exports);
    }

    updateSubs(cassettes, data, IMPORT = false) {

        for (var i = 0, l = cassettes.length; i < l; i++) {
            
            let cassette = cassettes[i];
            
            if (cassette instanceof Case)
                cassette.update(data, true);
            else {
                let r_val;

                if (IMPORT) {

                    if (cassette.data.import && data[cassette.data.import]) {
                        r_val = cassette.update(data, true);

                        if (r_val) {
                            this.updateSubs(cassette.children, r_val);
                            continue;
                        }
                    }
                } else {
                    /** 
                        Overriding the model data happens when a cassette returns an object instead of undefined. This is assigned to the "r_val" variable
                        Any child cassette of the returning cassette will be fed "r_val" instead of "data".
                    */

                    r_val = cassette.update(data, true);
                }


                this.updateSubs(cassette.children, r_val || data, IMPORT);
            }
        }
    }

    up(data){
        this.model.add(data);
    }

    update(data, changed_values) {
        this.__down__(data, changed_values);
    }


    handleUrlUpdate(wurl) {
        let query_data = null;
        /* 
            This part of the function will import data into the model that is obtained from the query string 
        */
        if (wurl && this.data.import) {
            query_data = {};
            if (this.data.import == "null") {
                query_data = wurl.getClass();
                console.log(query_data)
            } else {
                var l = this.data.import.split(";")
                for (var i = 0; i < l.length; i++) {
                    let n = l[i].split(":");

                    let class_name = n[0];
                    let p = n[1].split("=>");
                    var key_name = p[0];
                    var import_name = p[1];
                    if (class_name == "root") class_name = null;
                    query_data[import_name] = wurl.get(class_name, key_name);
                }
            }
        }

        if (wurl && this.data.url) {

            let query_data = {};
            if (this.url_query) {
                var l = this.url_query.split(";")
                for (var i = 0; i < l.length; i++) {
                    let n = l[i].split(":");
                    let class_name = n[0];
                    let p = n[1].split("=>");
                    var key_name = p[0];
                    var import_name = p[1];
                    if (class_name == "root") class_name = null;
                    query_data[import_name] = wurl.get(class_name, key_name);
                }
            }

            this.____request____(query_data)
        }

        if (!this.model) {

            this.model = new this.model_constructor();


            if (this.getter)
                this.getter.setModel(this.model);

            this.model.addView(this);
        }

        if (query_data) {
            if (!this.model.add(query_data)) {
                this.update(this.model.get());
            }
        } else
            this.update(this.model.get());
    }

    transitionIn(index = 0) {

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionIn(index));

        transition_time = Math.max(transition_time, super.transitionIn(index));

       this.updateDimensions();

        return transition_time;
    }

    /**
        Takes as an input a list of transition objects that can be used
    */
    transitionOut(index = 0, DESTROY = false) {

        let transition_time = 0;

        for (let i = 0, l = this.templates.length; i < l; i++)
            transition_time = Math.max(transition_time, this.templates[i].transitionOut(index));

        transition_time = Math.max(transition_time, super.transitionOut(index, DESTROY));

        return transition_time;
    }

    finalizeTransitionOut() {

        for (let i = 0, l = this.templates.length; i < l; i++)
            this.templates[i].finalizeTransitionOut();

        super.finalizeTransitionOut();
    }

    setActivating() {
        if (this.parent)
            this.parent.setActivating();
    }

    getNamedElements(named_elements) {
        for (let comp_name in this.named_elements) 
            named_elements[comp_name] = this.named_elements[comp_name];
    }
}

class CustomCase extends Case {
    constructor(element, data = {}, presets = {}) {
        super(null, element, data, presets)
    }
}

export {
    Case,
    CustomCase
}