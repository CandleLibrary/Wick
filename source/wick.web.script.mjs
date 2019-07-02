import { core } from "./library.mjs";
import { JSCompiler } from "./component/compiler/js.mjs";
import { Presets } from "./presets.mjs";
import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "./schema/schemas.mjs";
import { Store } from "./model/store.mjs";
import { SchemedModel } from "./model/schemed.mjs";
import { Model } from "./model/model.mjs";
import { ModelContainerBase } from "./model/container/base.mjs";
import { MultiIndexedContainer } from "./model/container/multi.mjs";
import { BTreeModelContainer } from "./model/container/btree.mjs";
import { ArrayModelContainer } from "./model/container/array.mjs";
import { View } from "./observer.mjs";
import { Scope } from "./component/runtime/scope.mjs";
import { ScopePackage } from "./component/runtime/package.mjs";
import { HTMLCompiler } from "./component/compiler/html.mjs";
import { RootText } from "./component/compiler/nodes/root.mjs";
import { RootNode } from "./component/compiler/nodes/index.mjs";
import { StyleNode } from "./component/compiler/nodes/style.mjs";
import { ScriptNode } from "./component/compiler/nodes/script.mjs";
import { ScopeNode } from "./component/compiler/nodes/scope.mjs";
import { PackageNode } from "./component/compiler/nodes/package.mjs";
import { SVGNode } from "./component/compiler/nodes/svg.mjs";
import { ScopeContainerNode } from "./component/compiler/nodes/container.mjs";
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
