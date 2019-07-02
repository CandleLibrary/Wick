/** This is the entire object structure of Wick, minus the platform specific outputs found in /scope/root/ */
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
import { View } from "./observer.mjs";

//Scope
import { ScopePackage } from "./component/runtime/package.mjs";
import { Scope } from "./component/runtime/scope.mjs";

//ScopeCompiler
import { HTMLCompiler } from "./component/compiler/html.mjs";
import { RootText } from "./component/compiler/nodes/root.mjs";
import { RootNode } from "./component/compiler/nodes/index.mjs";
import { StyleNode } from "./component/compiler/nodes/style.mjs";
import { ScriptNode } from "./component/compiler/nodes/script.mjs";
import { ScopeNode } from "./component/compiler/nodes/scope.mjs";
import { PackageNode } from "./component/compiler/nodes/package.mjs";
import { SVGNode } from "./component/compiler/nodes/svg.mjs";
import { ScopeContainerNode } from "./component/compiler/nodes/container.mjs";

//Utilities
import { replaceEscapedHTML } from "./utils/string.mjs";

const model = (data, schema) => new SchemedModel(data, undefined, undefined, schema);
model.scheme = (s, scheme) => (scheme = class extends SchemedModel {}, scheme.schema = s, scheme);
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

const Utils = {
    replaceEscapedHTML
}

Object.freeze(scheme.constr);
Object.freeze(scheme);
Object.freeze(Presets);
Object.freeze(Utils);
Object.freeze(model.container.constr);
Object.freeze(model.container);
Object.freeze(model.any);
Object.freeze(model);

const core = {
    presets: a => new Presets(a),
    scheme: scheme,
    model: model,
    scope: (...a) => new ScopePackage(...a),
    plugin : Plugin,
    utils: Utils
};

core.scope.compiler = HTMLCompiler;

HTMLCompiler.nodes = {
    root: RootNode,
    style: StyleNode,
    script: ScriptNode,
    text: RootText,
    scope: ScopeNode,
    package: PackageNode,
    template: ScopeContainerNode,
    svg:SVGNode
};

core.scope.package = ScopePackage;
core.scope.constructor = Scope;

Object.freeze(core.scope);
Object.freeze(core);

const scope = core.scope;

export {
    scope,
    scheme,
    model,
    core,
};
