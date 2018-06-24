import {
    Rivet
} from "./rivet"
import {
    Model
} from "./model/model"
import {
    Controller
} from "./controller"
import {
    Getter
} from "./getter"
import {
    Cassette,
    CloseCassette,
    ImportDataFromDataSet
} from "./cassette/cassette"
import {
    Form
} from "./cassette/form"
import {
    Input
} from "./cassette/input"
import {
    Filter
} from "./cassette/filter"
import {
    Exporter
} from "./cassette/exporter"
import {
    ImportQuery
} from "./cassette/import_query"
import {
    Exists,
    NotExists
} from "./cassette/exists"
import {
    EpochDay,
    EpochDate,
    EpochMonth,
    EpochYear,
    EpochToDateTime
} from "./cassette/epoch"

let PresetCassettes = {
    raw: Cassette,
    cassette: Cassette,
    form: Form,
    input: Input,
    export: Exporter,
    iquery: ImportQuery,
    edt: EpochToDateTime,
    eday: EpochDay,
    edate: EpochDate,
    eyear: EpochYear,
    emonth: EpochMonth,
    exists: Exists,
    not_exists: NotExists
}
/*
class CaseParentView extends Rivet {
    constructor(Case) {
        super();
        this.case = Case;
    }

    destructor() {
        if (this.case)
            this.case.destructor();
        super.destructor();
    }

    update(data) {
        if (this.case)
            this.case.updateFromParent(data);
    }

    updateDimensions() {
        if (this.case)
            this.case.updateDimensions();
    }
}
*/

class Case extends Rivet {
    /**
        Case constructor. Builds a Case object.
        @params [DOMElement] element - A DOM <template> element that contains a <case> element.
        @params [LinkerPresets] presets
        @params [Case] parent - The parent Case object, used internally to build Case's in a hierarchy
        @params [Model] model - A model that can be passed to the case instead of having one created or pulled from presets. 
        @params [DOM]  WORKING_DOM - The DOM object that contains templates to be used to build the case objects. 
    */
    constructor(element, presets, parent = null, model = null, WORKING_DOM) {

        super(parent, 
            (element.nodeName == "TEMPLATE") ? 
                document.importNode(element.content, true).children[0] :
                element
        )

        if(element.nodeName == "TEMPLATE")
            ImportDataFromDataSet(this.data, element.dataset);

        if (!element) {
            console.warn("No element has been supplied to this Case constructor!");
            return undefined;
        }

        if (!presets) {
            console.warn("No preset object has been supplied to this Case constructor!");
            return undefined;
        }

        this.USE_SECURE = presets.USE_HTTPS;
        this.named_cassettes = {};
        this.template = null;
        this.prop = null;
        this.url = null;
        //this.parent_view = null;
        this.receiver = null;
        this.query = {};
        this.TEMPLATE_HANDLER = false;
        this.REQUESTING = false;
        this.cl = presets;
        this.exports = null;
        this.filter_list = [];
        this.is = 0;

        var return_object = this;

        


        for (let prop in this.data) {
            if ((this.data[prop] == "" || !this.data[prop]) && parent) {
                this.data[prop] = parent.data[prop];
            }
        }

        if (this.element.tagName == "CASE") {

            var children = this.element.children;

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

            for (var i = 0; i < children.length; i++) {
                var child = children[i];

                var cassette = ComponentConstructor(this, child, presets, this.named_cassettes, this, WORKING_DOM);

                if (cassette)
                    this.children = this.children.concat(cassette);
            }


            if (this.data.prop)
                this.prop = this.data.prop;

            if (this.data.export)
                this.exports = this.data.export;

            if (model && model instanceof Model) {

                if (this.data.schema && presets.schemas[this.data.schema]) {
                    /* Opinionated Case - Only accepts Models that are of the same type as its schema.*/
                    if (model.schema != presets.schemas[this.data.schema]) {
                        throw new Error(`Model Schema ${this.model.schema} does not match Case Schema ${presets.schemas[this.data.schema].schema}`)
                    }
                }


                model.addView(this);

                if (this.data.url) {
                    this.receiver = new Getter(this.data.url, this.url_return);
                    this.receiver.setModel(model);
                    this.request();
                }


            } else if (this.data.model) {

                if (presets.models[this.data.model])
                    presets.models[this.data.model].addView(this);

            } else if (this.data.schema && presets.schemas[this.data.schema]) {

                var model = new presets.schemas[this.data.schema]();

                //this.parent_view = new CaseParentView(this);

                model.addView(this);

                if (this.data.url) {
                    this.receiver = new Getter(this.data.url, this.url_return);
                    this.receiver.setModel(model);
                    this.request();
                }
            }

            if (!this.model) {
                this.destructor();
                throw new Error(`No Model could be found for Case constructor! Case schema "${this.data.schema}", "${presets.schemas[this.data.schema]}"; Case model "${this.data.model}", "${presets.models[this.data.model]}";`);
            }

            this.setModel(this.model);

            return return_object;
        } else {
            throw new Error(`Case may only be constructed out of <case></case> elements. Received a ${element} in the case constructor!`)
            return undefined;
        }
    }

    destructor() {

        this.parent = null;

        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].destructor();
            }
        }

        this.children = null;

        if (this.element.parentElement)
            this.element.parentElement.removeChild(this.element);

        this.element = null;

        if (this.receiver)
            this.receiver.destructor();
    }

    request(query) {

        this.receiver.get(query, null, this.USE_SECURE).then(() => {
            this.REQUESTING = false;
        });
        this.REQUESTING = true;
    }

    updateSubs(cassettes, data, IMPORT = false) {

        for (var i = 0, l = cassettes.length; i < l; i++) {
            let cassette = cassettes[i];
            if (cassette.is == 0)
                cassette.update(data, true);
            else {
                let r_val;

                if (IMPORT) {

                    if (cassette.import_prop && data[cassette.import_prop]) {
                        r_val = cassette.update(data);

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

                    r_val = cassette.update(data);


                }


                this.updateSubs(cassette.children, r_val || data, IMPORT);
            }
        }
    }

    update(data, IMPORT = false) {

        if (!IMPORT) {

            if (!data) {
                if (this.data_cache)
                    data = this.data_cache
                else return;
            }

            this.data_cache = data;

            this.updateDimensions();
        }


        this.updateSubs(this.children, data, IMPORT)

        if (IMPORT) return;

        this.REQUESTING = false;

        if (this.TEMPLATE_HANDLER && this.template) {

            //cassettes for each data element

            //This by default should be an array of Model objects
            var result = data[this.prop].get();


            for (var j = 0; j < this.filter_list.length; j++) {
                let filter = this.filter_list[j];

                result = result.filter((a) => {
                    return filter(a.get());
                });
            }


            //We should establish filtering mechanisms here to remove unneeded data.


            //Need to isolate new results from existing, and cull existing that do not match results.

            for (var j = 0; j < this.children.length; j++) {

                var cassette = this.children[j];

                cassette.destructor();
            }

            this.children.length = 0;

            for (var i = 0; i < result.length; i++) {
                //check for existing matche

                var temp_ele = document.importNode(this.template.content, true).children[0];

                try {

                    var d = new Case(temp_ele, this.cl, this, result[i].____self____);

                    this.element.appendChild(temp_ele);

                    this.children.push(d);

                } catch (e) {
                    console.warn(e)
                }
            }
        }
    }

    setModel(model) {

        if (this.prop && (model.schema[this.prop] instanceof Array)) {
            //This case will create sub templates from from each entry in the array
            this.TEMPLATE_HANDLER = true;

            return;
        }

        if (this.prop && model.schema[this.prop] && model.schema[this.prop].prototype instanceof Model) {
            model = model.data[this.prop];
        }

        for (var i = 0; i < this.children.length; i++) {
            this.children[i].setModel(model);
        }

        super.setModel(model);
    }

    updateDimensions() {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].updateDimensions();
        }
    }

    close(named_cassettes) {}

    hide() {
        this.close(this.named_cassettes);
        this.display = this.element.style.display;
        this.element.style.display = "none";
    }

    show() {
        if (this.element.style.display == "none")
            this.element.style.display = this.display;
    }

    export (t = {}) {

        if (this.exports && this.model)
            t[this.exports] = this.model.get()[this.exports];


        if (this.parent)
            this.parent.import(t);
    }

    import (data) {

        if (this.model)
            this.model.add(data);

        this.export(data);
    }

    setActivating() {
        if (this.parent)
            this.parent.setActivating();
    }
}

function ComponentConstructor(parent, element, presets, named_list, parentCase, WORKING_DOM) {
    //Will only construct if there is a matching widget to handle the element

    var cassette = [];
    var cassettes = presets.cassettes;

    var class_ = element.dataset.class;
    var tag = element.tagName;

    if (element.dataset.transition) 
        named_list[element.dataset.transition] = element;
    

    //Case of a Sub Case, hehe
    if (tag == "CASE") {
        var constructor = (class_ && cassettes[class_]) ?
            cassettes[class_] : Case;
        return [new constructor(element, presets, parentCase, null, WORKING_DOM)];
    }

    //Case of a template
    if (tag == "TEMPLATE") {
        //If the template is empty, Check the working DOM for another TEMPLATE element whose ID matches this elements first class name
        if (element.innerHTML == "") {
            let ele;

            if (ele = WORKING_DOM.getElementById(element.classList[0])) {
                ele = ele.cloneNode(true);

                for (let prop in element.dataset)
                    ele.dataset[prop] = element.dataset[prop];

                var c = new Case(ele, presets, parentCase, null, WORKING_DOM);
                //Import the element into the DOM tree, replacing the existing TEMPLATE element.
                var p = element.parentElement;

                p.replaceChild(c.element, element);

                return [c];
            }

        }

        if (!parent.template) parent.template = element;

        return [];
    }

    //Case of input, if parent is form
    if (tag == "INPUT" && element.dataset.prop) {
        if (cassettes.input || PresetCassettes.input) {
            cassette = [new(cassettes.input || PresetCassettes.input)(parentCase, element)];
        } else {
            console.warn("Missing input constructor in presets, unable to process form data!");
        }
    } else

    //Case of form, a special case of Component
    if (tag == "FORM") {
        let form_class = PresetCassettes.form;
        if (class_ && (form_class = cassettes[class_]) && form_class.prototype instanceof Form) {
            cassette = [new form_class(parentCase, element)];
        } else if (cassettes.form || PresetCassettes.form) {
            cassette = [new(cassettes.form || PresetCassettes.form)(parentCase, element)];
        } else {
            console.warn("Missing form constructor in presets, unable to process form data!");
        }


    } else

    //Case of Component
    if (class_ && (cassettes[class_] || PresetCassettes[class_])) {
        cassette = [new(cassettes[class_] || PresetCassettes[class_])(parentCase, element)];
    }
    //Continue parsing through the DOM tree.

    var children = element.children;

    for (var i = 0; i < children.length; i++) {

        var c_cassettes = ComponentConstructor(cassette[0] || parent, children[i], presets, named_list, parentCase, WORKING_DOM);

        if (cassette) {
            if (cassette[0] && cassette[0].children) {
                cassette[0].children = cassette[0].children.concat(c_cassettes);
            } else {
                cassette = cassette.concat(c_cassettes);
            }
        }
    }

    return cassette;
}

export {
    Case,
    Cassette,
    Filter,
    Form
}