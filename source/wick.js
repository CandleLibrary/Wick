/**
	Light it up!
*/
import {
    WURL
} from "./linker/wurl"
import {
    View
} from "./view"

import {
    ArrayModelContainer,
    BTreeModelContainer,
    MultiIndexedContainer,
    Model,
    ModelContainer
} from "./model/model"

import {
    Controller
} from "./controller"

import {
    Getter
} from "./getter"

import {
    Setter
} from "./setter"

import {
    Linker,
    URL
} from "./linker/linker"

import * as Animation from "./animation/animation"

import * as Common from "./common"

let wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";

import {
    CustomCase
} from "./case/case"

import {
    Rivet
} from "./case/rivet"

import {
    CaseConstructor
} from "./case/case_constructor"

import{
    Filter
} from "./case/cassette/filter"

import{
    Form
} from "./case/cassette/form"

import {
    Cassette
} from "./case/cassette/cassette"

import {
    SchemaType,
    schema
} from "./schema/schemas"

let LINKER_LOADED = false;
let DEBUGGER = true;

/**
 *    Creates a new {Linker} instance, passing any presets from the client.
 *    It will then wait for the document to load, and once loaded, will start the linker and load the current page into the linker.
 *
 *    Note: This function should only be called once. Any subsequent calls will not do anything.
 *
 *    @param {LinkerPresets} presets - An object of user defined Wick objects.
 */

function light(presets) {
    if (DEBUGGER) console.log(presets)

    if (LINKER_LOADED) return;

    LINKER_LOADED = true;

    //Pass in the presets or a plain object if presets is undefined.

    let link = new Linker(presets || {});

    window.addEventListener("load", () => {
        link.loadPage(
            link.loadNewPage(document.location.pathname, document),
            new WURL(document.location),
            false
        );
    })

    console.log(`${wick_vanity}Copyright 2018 Anthony C Weathersby\nhttps://gitlab.com/anthonycweathersby/wick`)
}

/*** Exports ***/

export {
    URL,
    Animation,
    ArrayModelContainer,
    BTreeModelContainer,
    MultiIndexedContainer,
    Controller,
    CustomCase,
    Rivet,
    CaseConstructor,
    Cassette,
    Form,
    Filter,
    Common,
    Getter,
    Linker,
    Model,
    ModelContainer,
    Setter,
    View,
    light,
    SchemaType,
    schema
}