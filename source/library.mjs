/** This is the entire object structure of Wick, minus the platform specific outputs found in /source/root/ */
import { Presets } from "./presets";

//Schema
import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "./schema/schemas";

//Models
import { Store } from "./model/store";
import { SchemedModel } from "./model/schemed";
import { Model } from "./model/model";
import { ModelContainerBase } from "./model/container/base";
import { MultiIndexedContainer } from "./model/container/multi";
import { BTreeModelContainer } from "./model/container/btree";
import { ArrayModelContainer } from "./model/container/array";

//Views
import { View } from "./view";

//Source
import { SourcePackage } from "./source/package";
import { Source } from "./source/source";

//SourceCompiler
import { CompileSource as Compiler } from "./source/compiler/compiler";
import { RootText } from "./source/compiler/nodes/root";
import { RootNode } from "./source/compiler/nodes/index";
import { StyleNode } from "./source/compiler/nodes/style";
import { ScriptNode } from "./source/compiler/nodes/script";
import { SourceNode } from "./source/compiler/nodes/source";
import { PackageNode } from "./source/compiler/nodes/package";
import { SVGNode } from "./source/compiler/nodes/svg";
import { SourceTemplateNode } from "./source/compiler/nodes/template";

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
    view: View,
    scheme: scheme,
    model: model,
    source: (...a) => new SourcePackage(...a)
};

core.source.compiler = Compiler;

Compiler.nodes = {
    root: RootNode,
    style: StyleNode,
    script: ScriptNode,
    text: RootText,
    source: SourceNode,
    package: PackageNode,
    template: SourceTemplateNode,
    svg:SVGNode
};

let internals = { /* Empty if production */ };

core.source.package = SourcePackage;
core.source.constructor = Source;

Object.freeze(core.source);
Object.freeze(core);

let source = core.source;

export {
    source,
    scheme,
    model,
    core,
    internals
};