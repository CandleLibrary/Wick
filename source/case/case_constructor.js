/*
    Boring Case stuff
*/
import {
    CaseSkeleton
} from "./case_skeleton"

import {
    Case,
} from "./case"

import {
    CaseTemplate
} from "./case_template"


/* 
    Cassettes
*/
import {
    FilterLimit
} from "./cassette/filter_limit"
import {
    Cassette,
    CloseCassette
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
    Term
} from "./cassette/term"
import {
    Exporter
} from "./cassette/exporter"
import {
    ImportQuery
} from "./cassette/import_query"
import {
    DataEdit
} from "./cassette/data_edit"
import {
    Exists,
    NotExists
} from "./cassette/exists"
import {
    EpochDay,
    EpochTime,
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
    etime: EpochTime,
    eday: EpochDay,
    edate: EpochDate,
    eyear: EpochYear,
    emonth: EpochMonth,
    exists: Exists,
    not_exists: NotExists,
    data_edit: DataEdit,
    term: Term,
    limit: FilterLimit
}



function ImportDataFromDataSet(data_object, data_set_object, element) {
    if (element) {
        for (let prop in data_set_object) {
            data_object[prop] = data_set_object[prop];
            element.removeAttribute(`data-${prop}`);
        }
    } else {
        for (let prop in data_set_object)
            data_object[prop] = data_set_object[prop];
    }
}

class lvl {
    constructor(index = 0, parent = null){
        this.index = index;
        this.parent = parent;
    }

    getElement(element_root) {
        if (this.parent) {

            let element = this.parent.getElement(element_root)
            return element.children[this.index];
        }
        return element_root.children[this.index];
    }
}
/*
    This function's role is to construct a case skeleton given a template, a list of presets, and 
    and optionally a working DOM. This will return Case Skeleton that can be cloned into a new Case object. 

    @param {HTMLElement} Template
    @param {Presets} presets 
    @param {DOMElement} WORKING_DOM
*/
function CaseConstructor(Template, Presets, WORKING_DOM) {

    let skeleton;

    if (!Template)
        return null;

    if (Template.skeleton)
        return Template.skeleton;


    //TEmplate Filtration handled here.
    //Import the 
    let element = document.importNode(Template, true);

    skeleton = ComponentConstructor(null, element, Presets, WORKING_DOM)[0];

    if (!skeleton)
        return null;



    Template.skeleton = ((skeleton) => (model) => skeleton.flesh(model))(skeleton);

    return Template.skeleton;
}

function ReplaceTemplateWithElement(Template) {

}

function ComponentConstructor(parent, element, presets, WORKING_DOM, parent_lvl) {

    //Will only construct if there is a matching widget to handle the element
    var children = element.children;

    let out = [];
    var cassettes = presets.cassettes || {};

    var cassette = [];

    if (element.nodeName == "TEMPLATE") {

        children = element.content.children;

        let ele;

        if (children.length < 1) {

            if (
                (ele = WORKING_DOM.getElementById(element.classList[0])) &&
                element.nodeName == "TEMPLATE"
            ) {

                ele = ele.cloneNode(true);

                var p = element.parentElement;

                p.replaceChild(ele, element);

                return ComponentConstructor(parent, ele, presets, WORKING_DOM);

            } else

                return [];


        } else {

            ele = document.importNode(element.content, true);

            ele.attributes = element.attributes

            let p = element.parentElement;

            if (p) {

                p.replaceChild(ele, element);

                return ComponentConstructor(parent, ele, presets, WORKING_DOM);
            } else

                element = ele;
        }
    }

    var template = null;

    //Continue parsing through the DOM tree.
    for (var i = 0; i < children.length; i++) {



        let child_element = children[i];


        //We'll build a data object that will contain the data-* attributes for the object. 
        let data = {},
            NAMED = false;

        ImportDataFromDataSet(data, child_element.dataset);

        if (template) {
            ImportDataFromDataSet(data, template.dataset);
            template = null;
        }

        let class_ = data.class;

        //Named alements to be used with transition systems. 
        if (data.transition)
            NAMED = true;

        // Grab the Tgname
        let tag = child_element.tagName;
        let Constructor = null;


        switch (tag) {

            case "TEMPLATE":

                let template_children = child_element.content.children;

                var ele;

                template = child_element;

                if (template_children.length < 1) {

                    if (
                        (ele = WORKING_DOM.getElementById(child_element.classList[0])) &&
                        child_element.nodeName == "TEMPLATE"
                    ) {

                        ele = document.importNode(ele.content, true);

                        var p = child_element.parentElement;

                        p.replaceChild(ele, child_element);

                    } else {

                        template = null;

                        continue;

                    }



                } else {

                    ele = document.importNode(child_element.content, true);

                    ele.attributes = child_element.attributes

                    let p = child_element.parentElement;

                    if (p) {

                        p.replaceChild(ele, child_element);

                    }
                }
                //Since the template has been replaced by its contents, the state of children has changed. We simply need to redo parsing at this point to handle those changes
                i--;

                continue

            case "CASETEMPLATE":

                //let div = document.createElement("div");

                //var ele = child_element.cloneNode(true);

                //div.appendChild(ele);

                //element.replaceChild(ele, child_element);

                let bone = new CaseSkeleton(null, null, new lvl(i, parent_lvl), NAMED, presets);

                bone.data = data;

                let skeleton = ComponentConstructor(parent, child_element, presets, WORKING_DOM);

                bone.Constructor = ((s) => class extends CaseTemplate {
                    constructor(p, e, pr, d) {
                        super(p, e, pr, d, s);
                    }
                })(skeleton);

                parent.templates.push(bone);

                continue;

            case "CASE":

                Constructor = (class_ && cassettes[class_]) ? cassettes[class_] : Case;

                if (Constructor) {

                    if (data.model || data.schema) {
                        Constructor = ((C, m, s) => class extends C {
                            constructor(p, e, pr, d) {
                                super(p, e, pr, d);
                                this.model = presets.models[m];
                                this.schema = presets.schemas[s];
                            }
                        })(Constructor, data.model, data.schema);
                    }

                    let bone = new CaseSkeleton(child_element, Constructor, new lvl(i, parent_lvl), NAMED, presets);

                    ImportDataFromDataSet(data, element.dataset);

                    bone.data = data;

                    bone.IS_CASE = true;

                    bone.children = ComponentConstructor(bone, child_element, presets, WORKING_DOM);

                    out.push(bone);

                    continue;
                }

                break;

            case "INPUT":

                Constructor = (cassettes.input || PresetCassettes.input);

                if (Constructor) {

                    let bone = new CaseSkeleton(null, Constructor, new lvl(i, parent_lvl), NAMED, presets);

                    bone.data = data;

                    bone.children = ComponentConstructor(bone, child_element, presets, WORKING_DOM, new lvl(i, parent_lvl));

                    out.push(bone);

                } else
                    console.warn("Missing input Constructor in presets, unable to process form data!");


                break;

            case "FORM":

                Constructor = PresetCassettes.form;

                let form_class;

                if (class_ && (form_class = cassettes[class_]) && form_class.prototype instanceof Form)
                    Constructor = form_class;
                else if (cassettes.form || PresetCassettes.form)
                    Constructor = (cassettes.form || PresetCassettes.form);

                if (Constructor) {

                    let bone = new CaseSkeleton(null, Constructor, new lvl(i, parent_lvl), NAMED, presets);

                    bone.data = data;

                    out.push(bone);

                    bone.children = ComponentConstructor(bone, child_element, presets, WORKING_DOM, new lvl(i, parent_lvl));

                    continue

                } else
                    console.warn("Missing form Constructor in presets, unable to process form data!");


                break;

            default:

                if (class_ && (cassettes[class_] || PresetCassettes[class_]))
                    Constructor = (cassettes[class_] || PresetCassettes[class_]);


                if (Constructor) {

                    //console.log(element, element.children[i], data)

                    let bone = new CaseSkeleton(null, Constructor, new lvl(i, parent_lvl), NAMED, presets);

                    bone.data = data;

                    out.push(bone);

                    bone.children = ComponentConstructor(bone, child_element, presets, WORKING_DOM, new lvl(i, parent_lvl));

                    continue
                }

                break;

        }

        out = out.concat(ComponentConstructor(parent, child_element, presets, WORKING_DOM, new lvl(i, parent_lvl)));
    }


    return out;
}

export {
    CaseConstructor
};