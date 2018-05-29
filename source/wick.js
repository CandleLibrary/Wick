/**
	Light it up!
*/

import {
    View
} from "./view"

import {
    ArrayModelContainer,
    BinaryTreeModelContainer,
    DateModelContainer,
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
    Component,
    Linker
} from "./linker/linker"

import * as Animation from "./animation/animation"

import * as Common from "./common"

/** Case and Cassetes **/

import {Case, Cassette} from "./case"



let LINKER_LOADED = false;

/**
*    Creates a new {Linker} instance, passing any presets from the client.
*    It will then wait for the document to load, and once loaded, will start the linker and load the current page into the linker.
*
*    Note: This function should only be called once. Any subsequent calls will not do anything.
*
*    @param {LinkerPresets} presets - An object of user defined Wick objects.
*/

function light(presets){

    if(LINKER_LOADED) return;

    LINKER_LOADED = true;

    let link = new Linker(presets);

    window.addEventListener("load", ()=>{
        link.loadNewPage(document.location.pathname, document);
        link.parseURL(document.location.pathname, document.location.search);
    })

    console.log("The Wick has been lit")
}

/*** Exports ***/

export {
    Animation,
    ArrayModelContainer,
    BinaryTreeModelContainer,
    Controller,
    Case,
    Cassette,
    Common,
    Component,
    DateModelContainer,
    Getter,
    Model,
    ModelContainer,
    Setter,
    View,
    light
}
