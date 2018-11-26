import { source, scheme, model, core, internals, anim } from "./config/library";

const wick_vanity = "\ \(\ \ \(\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \)\n\ \)\\\)\)\(\ \ \ \'\ \(\ \ \ \ \ \ \ \ \ \ \(\ \/\(\n\(\(\_\)\(\)\\\ \)\ \ \)\\\ \ \ \ \(\ \ \ \ \)\\\(\)\)\n\_\(\(\)\)\\\_\)\(\)\(\(\_\)\ \ \ \)\\\ \ \(\(\_\)\\\n\\\ \\\(\(\_\)\/\ \/\ \(\_\)\ \ \(\(\_\)\ \|\ \|\(\_\)\n\ \\\ \\\/\\\/\ \/\ \ \|\ \|\ \/\ \_\|\ \ \|\ \/\ \/\n\ \ \\\_\/\\\_\/\ \ \ \|\_\|\ \\\_\_\|\ \ \|\_\\\_\\\n";


let LINKER_LOADED = false;


/**
 *    Creates a new Router instance, passing any presets from the client.
 *    It will then wait for the document to complete loading then starts the Router and loads the current page into the Router.
 *
 *    Note: This function should only be called once. Any subsequent calls will not do anything.
 *    @method startRouting
 *    @param {Object} presets_options - An object of configuration data to pass to the Presets. {@link Presets}.
 */
function startRouting(preset_options = {}) {

    if (LINKER_LOADED) return;

    LINKER_LOADED = true;

    let presets = core.presets(preset_options);

    let router = new core.network.router(presets);

    window.addEventListener("load", () => {
        //router.parseURL(document.location)
        router.loadNewPage(document.location.pathname, document, new core.network.url(document.location), false).then(page =>
            router.loadPage(page, new core.network.url(document.location), true)
        );
        /*
            router.loadNewPage(document.location.pathname, document),
            new core.network.url(document.location),
            false
        );
        */
    });

    console.log(`${wick_vanity}Copyright 2018 Anthony C Weathersby\nhttps://github.com/galactrax/wick`);

    wick.router = router;

    return { presets, router };
}



import { Presets } from "../common/presets";
import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "../schema/schemas";
import { Store } from "../model/store";
import { SchemedModel } from "../model/schemed";
import { Model } from "../model/model";
import { ModelContainerBase } from "../model/container/base";
import { MultiIndexedContainer } from "../model/container/multi";
import { BTreeModelContainer } from "../model/container/btree";
import { ArrayModelContainer } from "../model/container/array";
import { View } from "../view/view";
import { SourcePackage } from "../source/package";
import { Source } from "../source/source";
import { CompileSource } from "../source/compiler/compiler";
import { RootText } from "../source/compiler/nodes/root";
import { RootNode } from "../source/compiler/nodes/index";
import { StyleNode } from "../source/compiler/nodes/style";
import { ScriptNode } from "../source/compiler/nodes/script";
import { SourceNode } from "../source/compiler/nodes/source";
import { PackageNode } from "../source/compiler/nodes/package";
import { SVGNode } from "../source/compiler/nodes/svg";
import { SourceTemplateNode } from "../source/compiler/nodes/template";
import { CSSParser, CSSRootNode, CSSSelector, CSSRule } from "../common/css/root";
import { Router } from "../network/router";
import { Animation } from "../animation/animation";
import { Transitioneer } from "../animation/transitioneer";
import * as Common from "../common/common";
import { Scheduler } from "../common/scheduler";

export default {
    anim,
    source,
    scheme,
    model,
    core,
    internals,
    startRouting,
}

export { anim,
 source ,
 scheme ,
 model ,
 core ,
 internals ,
 startRouting ,
    Presets,
    Store,
    SchemedModel,
    Model,
    ModelContainerBase,
    MultiIndexedContainer,
    BTreeModelContainer,
    ArrayModelContainer,
    View,
    SourcePackage,
    Source,
    CompileSource,
    RootText,
    RootNode,
    StyleNode,
    ScriptNode,
    SourceNode,
    PackageNode,
    SourceTemplateNode,
    SVGNode,
    SchemeConstructor, 
    DateSchemeConstructor, 
    TimeSchemeConstructor, 
    StringSchemeConstructor, 
    NumberSchemeConstructor, 
    BoolSchemeConstructor, 
    schemes,
    CSSParser, 
    CSSRootNode, 
    CSSSelector, 
    CSSRule,
    Router,
    Animation,
Transitioneer,
Scheduler,
Common
};