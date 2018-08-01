//Just for fun ☺
const wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";

//Presets

import { Presets } from "../common/presets"

//Schema

import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "../schema/schemas"

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

import { SourcePackage } from "../source/package"

//CSS

import { CSSParser } from "../common/css/root"

//HTML

import { HTMLParser } from "../common/html/root"

//Network

import { Getter } from "../network/getter"

import { Setter } from "../network/setter"

//Routing

import { WURL } from "../network/wurl"

import { Router } from "../network/router/router"

//Other

import { Lexer } from "../common/string_parsing/lexer"

//import { LexerBetaString } from "../common/string_parsing/lexer_beta_string"
//import { LexerBetaArray } from "../common/string_parsing/lexer_beta_array"

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

    return presets;
}



/**
 * A proxy for {wick.core.model.Model} 
 *
 * @type  {Model}
 * @memberof module:wick
 */

/**
 * Model Factory Constructor
 * Creates a new Model or AnyModel and returns the new object.
 * If a `schema` is given as second argument, creates a new anonymous model constructor extending Model and returns an instance of the extended model.
 *
 * @param      {object | Model | AnyModel}    data    Data to add the new model.
 * @param      {Object}    schema  an object of schemes to apply to the model.
 * @param      {Function}  temp    For `internal` use only.
 * @return     {Model | AnyModel}    If a `schema` is provided, returns the new Model based on the schema, otherwise returns an AnyMode.
 * @memberof module:wick
 */
const model = (data, schema, temp = null) => (schema) ? (temp = (class extends Model {}), temp.schema = schema, new temp(data)) : new AnyModel(data);
model.constr = Model;
model.any = (data) => new AnyModel(data);
model.any.constr = AnyModel;
model.container = {
    multi: MultiIndexedContainer,
    array: ArrayModelContainer,
    btree: BTreeModelContainer,
    constr: ModelContainerBase
};
//Construct Schema Exports
const scheme = Object.create(schemes);
scheme.constr = SchemeConstructor;
scheme.constr.bool = BoolSchemeConstructor;
scheme.constr.number = NumberSchemeConstructor;
scheme.constr.string = StringSchemeConstructor;
scheme.constr.date = DateSchemeConstructor;
scheme.constr.time = TimeSchemeConstructor;

Object.freeze(scheme.constr);
Object.freeze(scheme);
Object.freeze(Presets);
Object.freeze(model.container.constr);
Object.freeze(model.container);
Object.freeze(model.any);
Object.freeze(model);

const core = {
    presets: (...a) => new Presets(...a),
    common: Common,
    lexer: (string, INCLUDE_WHITE_SPACE_TOKENS) => new Lexer(string, INCLUDE_WHITE_SPACE_TOKENS),
    animation: Animation,
    view: View,
    css: CSSParser,
    html:HTMLParser,
    scheme: scheme,
    model: model,
    network: {
        url: WURL,
        router: Router,
        getter: Getter,
        setter: Setter,
    },
    source: (...a) => new SourcePackage(...a)
};

let internals = {/* Empty if production */}

if(DEBUGGER){
    //internals.lexer = Lexer;
    //internals.lexer_beta_string = LexerBetaString;
    //internals.lexer_beta_array = LexerBetaArray;
}

core.source.base = SourceBase
core.source.package = SourcePackage

Object.freeze(core.source);
Object.freeze(core);

let source = core.source;

export {
    startRouting,
    source,
    scheme,
    model,
    core,
    internals
}