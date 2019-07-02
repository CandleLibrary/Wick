import { core } from "./library.js";
import { JSCompiler } from "./component/compiler/js.js";
import { Presets } from "./presets.js";
import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "./schema/schemas.js";
import { Store } from "./model/store.js";
import { SchemedModel } from "./model/schemed.js";
import { Model } from "./model/model.js";
import { ModelContainerBase } from "./model/container/base.js";
import { MultiIndexedContainer } from "./model/container/multi.js";
import { BTreeModelContainer } from "./model/container/btree.js";
import { ArrayModelContainer } from "./model/container/array.js";
import { View } from "./observer.js";
import { Scope } from "./component/runtime/scope.js";
import { ScopePackage } from "./component/runtime/package.js";
import { HTMLCompiler } from "./component/compiler/html.js";
import { RootText } from "./component/compiler/nodes/root.js";
import { RootNode } from "./component/compiler/nodes/index.js";
import { StyleNode } from "./component/compiler/nodes/style.js";
import { ScriptNode } from "./component/compiler/nodes/script.js";
import { ScopeNode } from "./component/compiler/nodes/scope.js";
import { PackageNode } from "./component/compiler/nodes/package.js";
import { SVGNode } from "./component/compiler/nodes/svg.js";
import { ScopeContainerNode } from "./component/compiler/nodes/container.js";
import whind from "@candlefw/whind";

const wick = JSCompiler;

Object.assign(wick, core, {
    classes: {
        Presets,
        Store,
        SchemedModel,
        Model,
        ModelContainerBase,
        MultiIndexedContainer,
        BTreeModelContainer,
        ArrayModelContainer,
        View,
        ScopePackage,
        Scope,
        HTMLCompiler,
        RootText,
        RootNode,
        StyleNode,
        ScriptNode,
        ScopeNode,
        PackageNode,
        ScopeContainerNode,
        SVGNode,
        SchemeConstructor,
        DateSchemeConstructor,
        TimeSchemeConstructor,
        StringSchemeConstructor,
        NumberSchemeConstructor,
        BoolSchemeConstructor
    },

    toString: () => `CandleFW Wick 2019`
})

wick.whind = whind;
Object.freeze(wick);

export default wick;
