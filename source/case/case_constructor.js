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
    not_exists: NotExists,
    data_edit: DataEdit,
    term: Term
}

/*
    This function's role is to construct a case skeleton given a template, a list of presets, and 
    and optionally a working DOM. This will return Case Skeleton that can be cloned into a new Case object. 
*/

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

function ComponentConstructor(parent, element, presets, WORKING_DOM) {

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
                ele = WORKING_DOM.getElementById(element.classList[0]) &&
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

    //Continue parsing through the DOM tree.
    for (var i = 0; i < children.length; i++) {

        let child_element = children[i];

        //We'll build a data object that will contain the data-* attributes for the object. 
        let data = {},
            NAMED = false;

        ImportDataFromDataSet(data, child_element.dataset);

        let class_ = data.class;

        //Named alements to be used with transition systems. 
        if (data.transition)
            NAMED = true;

        // Grab the Tgname
        let tag = child_element.tagName;
        let Constructor = null;

        switch (tag) {

            case "TEMPLATE":

                let div = document.createElement("div");

                let ele = document.importNode(child_element.content, true);

                div.appendChild(ele);

                element.replaceChild(div, child_element);

                let bone = new CaseSkeleton(null, null, i, NAMED, presets);

                bone.data = data;

                let skeleton = ComponentConstructor(parent, div, presets, WORKING_DOM);

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

                    let bone = new CaseSkeleton(child_element, Constructor, i, NAMED, presets);

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

                    let bone = new CaseSkeleton(null, Constructor, i, NAMED, presets);

                    bone.data = data;

                    bone.children = ComponentConstructor(bone, child_element, presets, WORKING_DOM);

                    out.push(bone);

                } else
                    console.warn("Missing input Constructor in presets, unable to process form data!");


                break;

            case "FORM":

                Constructor = PresetCassettes.form;

                if (class_ && (form_class = cassettes[class_]) && form_class.prototype instanceof Form)
                    Constructor = form_class(parentCase, child_element);
                else if (cassettes.form || PresetCassettes.form)
                    Constructor = (cassettes.form || PresetCassettes.form);



                if (Constructor) {

                    let bone = new CaseSkeleton(null, Constructor, i, NAMED, presets);

                    bone.data = data;

                    out.push(bone);

                    bone.children = ComponentConstructor(bone, child_element, presets, bone, WORKING_DOM);

                    continue

                } else
                    console.warn("Missing form Constructor in presets, unable to process form data!");


                break;

            default:

                if (class_ && (cassettes[class_] || PresetCassettes[class_]))
                    Constructor = (cassettes[class_] || PresetCassettes[class_]);


                if (Constructor) {

                    let bone = new CaseSkeleton(null, Constructor, i, NAMED, presets);

                    bone.data = data;

                    out.push(bone);

                    bone.children = ComponentConstructor(bone, child_element, presets, WORKING_DOM);

                    continue
                }

                break;

        }

        out = out.concat(ComponentConstructor(parent, child_element, presets, WORKING_DOM));
    }


    return out;
}

export {
    CaseConstructor
};