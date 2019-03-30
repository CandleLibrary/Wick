/** This is the entire object structure of Wick, minus the platform specific outputs found in /source/root/ */
import { Presets } from "./presets.mjs";

//Schema
import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "./schema/schemas";

//Models
import { Store } from "./model/store.mjs";
import { SchemedModel } from "./model/schemed.mjs";
import { Model } from "./model/model.mjs";
import { ModelContainerBase } from "./model/container/base.mjs";
import { MultiIndexedContainer } from "./model/container/multi.mjs";
import { BTreeModelContainer } from "./model/container/btree.mjs";
import { ArrayModelContainer } from "./model/container/array.mjs";

//Plugin Handler
import { Plugin } from "./plugin.mjs";

//Views
import { View } from "./view.mjs";

//Source
import { SourcePackage } from "./source/package.mjs";
import { Source } from "./source/source.mjs";

//SourceCompiler
import { CompileSource as Compiler } from "./source/compiler/compiler.mjs";
import { RootText } from "./source/compiler/nodes/root.mjs";
import { RootNode } from "./source/compiler/nodes/index.mjs";
import { StyleNode } from "./source/compiler/nodes/style.mjs";
import { ScriptNode } from "./source/compiler/nodes/script.mjs";
import { SourceNode } from "./source/compiler/nodes/source.mjs";
import { PackageNode } from "./source/compiler/nodes/package.mjs";
import { SVGNode } from "./source/compiler/nodes/svg.mjs";
import { SourceContainerNode } from "./source/compiler/nodes/container.mjs";

const model = (data, schema) => new SchemedModel(data, undefined, undefined, schema);
model.scheme = (schema, sm) => (sm = class extends SchemedModel {}, sm.schema = schema, sm);
model.constr = SchemedModel;
model.any = (data) => new Model(data);
model.any.constr = Model;
model.container = {
    multi: MultiIndexedContainer,
    array: ArrayModelContainer,
    btree: BTreeModelContainer,
    constr: ModelContainerBase
};
model.store = (data) => new Store(data);

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
    presets: a => new Presets(a),
    scheme: scheme,
    model: model,
    source: (...a) => new SourcePackage(...a),
    plugin : Plugin
};

core.source.compiler = Compiler;

Compiler.nodes = {
    root: RootNode,
    style: StyleNode,
    script: ScriptNode,
    text: RootText,
    source: SourceNode,
    package: PackageNode,
    template: SourceContainerNode,
    svg:SVGNode
};

core.source.package = SourcePackage;
core.source.constructor = Source;

Object.freeze(core.source);
Object.freeze(core);

const source = core.source;

export {
    source,
    scheme,
    model,
    core,
};
