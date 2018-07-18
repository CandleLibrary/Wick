//Just for fun ☺
const wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";

//Presets

import { Presets } from "../common/presets"

//Schema

import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, Schemes } from "../schema/schemas"

//Models

import { Model } from "../model/model"

import { AnyModel } from "../model/any"

import { ModelContainerBase } from "../model/container/base"

import { MultiIndexedContainer } from "../model/container/multi"

import { BTreeModelContainer } from "../model/container/btree"

import { ArrayModelContainer } from "../model/container/array"

//Views

import { View } from "../view/view"

//Source

import { SourceBase } from "../source/base"

import { SourceConstructor } from "../source/constructor"

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
 *    Creates a new Router instance, passing any presets from the client.
 *    It will then wait for the document to complete loading then starts the Router and loads the current page into the Router.
 *
 *    Note: This function should only be called once. Any subsequent calls will not do anything.
 *    @method startRouting
 *    @param {Object | Presets} presets - An object of configuration data to pass to the Presets. {@link Presets}.
 */

function startRouting(presets = {}) {

    if (DEBUGGER) console.log(presets)

    if (LINKER_LOADED) return;

    LINKER_LOADED = true;

    let router = new Router(new Presets(presets));

    window.addEventListener("load", () => {

        router.loadPage(
            router.loadNewPage(document.location.pathname, document),
            new WURL(document.location),
            false
        );
    })

    console.log(`${wick_vanity}Copyright 2018 Anthony C Weathersby\nhttps://gitlab.com/anthonycweathersby/wick`)
}
/**
 * A proxy for {wick.core.model.Model} 
 *
 * @type  {Model}
 * @memberof module:wick
 */
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



//Construct Schema Exports
const schema = Object.create(Schemes);
schema.constr = SchemeConstructor;
schema.constr.bool = BoolSchemeConstructor;
schema.constr.number = NumberSchemeConstructor;
schema.constr.string = StringSchemeConstructor;
schema.constr.date = DateSchemeConstructor;
schema.constr.time = TimeSchemeConstructor;

Object.freeze(schema.constr);
Object.freeze(schema);
Object.freeze(Presets);
Object.freeze(model.container.constr);
Object.freeze(model.container);
Object.freeze(model.any);
Object.freeze(model);

const core = {
    Common,
    common: Common,
    animation:Animation,
    view: { View },
    css: {
        parser: CSSParser
    },
    schema: {
        instances: Schemes,
        SchemeConstructor,
        DateSchemeConstructor,
        TimeSchemeConstructor,
        StringSchemeConstructor,
        NumberSchemeConstructor,
        BoolSchemeConstructor
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
        SourceBase,
        SourceConstructor
    }
}

Object.freeze(core);

const any = model.any;

export {
    Presets,
    core,
    schema,
    model,
    any,
    startRouting
}