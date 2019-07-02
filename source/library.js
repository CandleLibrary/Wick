/** This is the entire object structure of Wick, minus the platform specific outputs found in /scope/root/ */
import { Presets } from "./presets.js";

//Schema
import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "./schema/schemas";

//Models
import { Store } from "./model/store.js";
import { SchemedModel } from "./model/schemed.js";
import { Model } from "./model/model.js";
import { ModelContainerBase } from "./model/container/base.js";
import { MultiIndexedContainer } from "./model/container/multi.js";
import { BTreeModelContainer } from "./model/container/btree.js";
import { ArrayModelContainer } from "./model/container/array.js";

//Plugin Handler
import { Plugin } from "./plugin.js";

//Views
import { View } from "./observer.js";

//Scope
import { ScopePackage } from "./component/runtime/package.js";
import { Scope } from "./component/runtime/scope.js";

//ScopeCompiler
import { HTMLCompiler } from "./component/compiler/html.js";
import { RootText } from "./component/compiler/nodes/root.js";
import { RootNode } from "./component/compiler/nodes/index.js";
import { StyleNode } from "./component/compiler/nodes/style.js";
import { ScriptNode } from "./component/compiler/nodes/script.js";
import { ScopeNode } from "./component/compiler/nodes/scope.js";
import { PackageNode } from "./component/compiler/nodes/package.js";
import { SVGNode } from "./component/compiler/nodes/svg.js";
import { ScopeContainerNode } from "./component/compiler/nodes/container.js";

//Utilities
import { replaceEscapedHTML } from "./utils/string.js";

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
