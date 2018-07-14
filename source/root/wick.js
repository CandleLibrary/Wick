const wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";
// JSDOC Setup
/**
    The built in string object.
    @external String
    @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String}

    JS Object
    @external Object
    @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object}
    
    DOM HTML Element
    @external HTMLElement
    @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
*/

//Schema

import { SchemaConstructor, DateSchemaConstructor, TimeSchemaConstructor, StringSchemaConstructor, NumberSchemaConstructor, BoolSchemaConstructor, schema as Schemas } from "../schema/schemas"

//Models

import { Model, AnyModel } from "../model/model"

import { ModelContainerBase } from "../model/container/base"

import { MultiIndexedContainer } from "../model/container/multi"

import { BTreeModelContainer } from "../model/container/btree"

import { ArrayModelContainer } from "../model/container/array"

//Views

import { View } from "../view/view"

//Source

import { SourceBase } from "../source/base"

import { CustomSource } from "../source/source"

import { SourceConstructor } from "../source/constructor"

import { Filter } from "../source/cassette/filter"

import { Form } from "../source/cassette/form"

import { Cassette } from "../source/cassette/cassette"

//CSS

import { CSSParser } from "../common/css/parser/parser"

//Network

import { Getter } from "../network/getter"

import { Setter } from "../network/setter"

//Routing

import { WURL } from "../network/router/wurl"

import { Router, URL } from "../network/router/router"

//Other

import * as Animation from "../animation/animation"

import * as Common from "../common/common"

let LINKER_LOADED = false;
let DEBUGGER = true;

/**
 *    Creates a new {Router} instance, passing any presets from the client.
 *    It will then wait for the document to load, and once loaded, will start the linker and load the current page into the linker.
 *
 *    Note: This function should only be called once. Any subsequent calls will not do anything.
 *
 *    @param {Object} presets - An object of user defined Wick objects.
 */

function startRouting(presets) {

    /**
      The static field in presets are all Component-like objects constructors that are defined by the client
      to be used by Wick for custom components.

      The constructors must support several Component based methods in ordered to be accepted for use. These methods include:
        transitionIn
        transitionOut
        setModel
        unsetModel
    */

    if (presets.static) {
        for (let component_name in presets.static) {

            let component = presets.static[component_name];

            let a = 0,
                b = 0,
                c = 0,
                d = 0,
                e = 0;

            if ((a = (component.prototype.transitionIn && component.prototype.transitionIn instanceof Function)) &&
                (b = (component.prototype.transitionOut && component.prototype.transitionOut instanceof Function)) &&
                (c = (component.prototype.setModel && component.prototype.setModel instanceof Function)) &&
                (d = (component.prototype.unsetModel && component.prototype.unsetModel instanceof Function)))
                this.addStatic(component_name, component);
            else
                console.warn(`Static component ${component_name} lacks correct component methods, \nHas transitionIn function:${a}\nHas transitionOut functon:${b}\nHas set model function:${c}\nHas unsetModel function:${d}`);
        }
    }

    /** TODO
        @define PageParser

        A page parser will parse templates before passing that data to the Source handler.
    */
    if (presets.parser) {
        for (let parser_name in presets.page_parser) {
            let parser = presets.page_parser[parser_name];
        }
    }

    /**
        Schemas provide the constructors for Models
    */
    if (presets.schemas) {

        presets.schemas.any = AnyModel;

    } else {
        presets.schemas = {
            any: AnyModel
        };
    }

    if (presets.models) {

    } else {
        presets.models = {};
    }

    if (DEBUGGER) console.log(presets)

    if (LINKER_LOADED) return;

    LINKER_LOADED = true;

    //Pass in the presets or a plain object if presets is undefined.

    let link = new Router(presets || {});

    window.addEventListener("load", () => {

        link.loadPage(
            link.loadNewPage(document.location.pathname, document),
            new WURL(document.location),
            false
        );
    })

    console.log(`${wick_vanity}Copyright 2018 Anthony C Weathersby\nhttps://gitlab.com/anthonycweathersby/wick`)
}

/**
    Exports 
*/

//Construct Model Exports
const model = Model;

model.any = (data) => new AnyModel(data);
model.any.constr = AnyModel;
model.container = {
    multi: (...args) => new MultiIndexedContainer(...args),
    array: (...args) => new ArrayModelContainer(...args),
    btree: (...args) => new BTreeModelContainer(...args),
    constr: ModelContainerBase
}

model.container.constr.multi = MultiIndexedContainer;
model.container.constr.array = ArrayModelContainer;
model.container.constr.btree = BTreeModelContainer;

Object.freeze(model.container.constr);
Object.freeze(model.container);
Object.freeze(model.any);
Object.freeze(model);

//Construct Schema Exports
const schema = Object.create(Schemas);
schema.constr = SchemaConstructor;
schema.constr.bool = BoolSchemaConstructor;
schema.constr.number = NumberSchemaConstructor;
schema.constr.string = StringSchemaConstructor;
schema.constr.date = DateSchemaConstructor;
schema.constr.time = TimeSchemaConstructor;

Object.freeze(schema.constr);
Object.freeze(schema);


const core = {
    Common,
    Animation,
    view: { View },
    css: {
        parser: CSSParser
    },
    schema: {
        instances: Schemas,
        SchemaConstructor,
        DateSchemaConstructor,
        TimeSchemaConstructor,
        StringSchemaConstructor,
        NumberSchemaConstructor,
        BoolSchemaConstructor
    },
    model: {
        Model,
        AnyModel,
        ModelContainerBase,
        MultiIndexedContainer,
        ArrayModelContainer,
        BTreeModelContainer
    },
    network: {
        router: {
            WURL,
            URL,
            Router
        },
        Getter,
        Setter,
    },
    source: {
        CustomSource,
        SourceBase,
        SourceConstructor,
        Cassette,
        Form,
        Filter
    }
}

Object.freeze(core);

const any = model.any;

export {
    core,
    schema,
    model,
    any,
    startRouting
}