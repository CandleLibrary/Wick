import { core } from "./library.mjs";
import { Component } from "./source/component.mjs";
import { Presets } from "./presets.mjs";
import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "./schema/schemas.mjs";
import { Store } from "./model/store.mjs";
import { SchemedModel } from "./model/schemed.mjs";
import { Model } from "./model/model.mjs";
import { ModelContainerBase } from "./model/container/base.mjs";
import { MultiIndexedContainer } from "./model/container/multi.mjs";
import { BTreeModelContainer } from "./model/container/btree.mjs";
import { ArrayModelContainer } from "./model/container/array.mjs";
import { View } from "./view.mjs";
import { BasePackage } from "./source/base_package.mjs";
import { SourcePackage } from "./source/package.mjs";
import { Source } from "./source/source.mjs";
import { CompileSource } from "./source/compiler/compiler.mjs";
import { RootText } from "./source/compiler/nodes/root.mjs";
import { RootNode } from "./source/compiler/nodes/index.mjs";
import { StyleNode } from "./source/compiler/nodes/style.mjs";
import { ScriptNode } from "./source/compiler/nodes/script.mjs";
import { SourceNode } from "./source/compiler/nodes/source.mjs";
import { PackageNode } from "./source/compiler/nodes/package.mjs";
import { SVGNode } from "./source/compiler/nodes/svg.mjs";
import { SourceContainerNode } from "./source/compiler/nodes/container.mjs";
import polyfill from "./polyfill.mjs"

const wick = Component;

export {
    Presets,
    Store,
    SchemedModel,
    Model,
    ModelContainerBase,
    MultiIndexedContainer,
    BTreeModelContainer,
    ArrayModelContainer,
    View,
    BasePackage,
    SourcePackage,
    Source,
    CompileSource,
    RootText,
    RootNode,
    StyleNode,
    ScriptNode,
    SourceNode,
    PackageNode,
    SourceContainerNode,
    SVGNode,
    SchemeConstructor,
    DateSchemeConstructor,
    TimeSchemeConstructor,
    StringSchemeConstructor,
    NumberSchemeConstructor,
    BoolSchemeConstructor,
    Component
};

Object.assign(wick, core)

wick.polyfill = polyfill;

export default wick;
