import compiler from "./compiler/component.mjs";

import wick_compile from "./compiler/wick.mjs";
import CompilerEnv from "./compiler/compiler_env.mjs";
//Models
import { Store } from "./model/store.mjs";
import { SchemedModel } from "./model/schemed.mjs";
import { schemes } from "./schema/schemas.mjs";
import { Model } from "./model/model.mjs";
import { ModelContainerBase } from "./model/container/base.mjs";
import { MultiIndexedContainer } from "./model/container/multi.mjs";
import { BTreeModelContainer } from "./model/container/btree.mjs";
import { ArrayModelContainer } from "./model/container/array.mjs";
import { Presets } from "./presets.mjs";
import whind from "@candlefw/whind";
const wick = compiler;




const model = (data, schema) => new SchemedModel(data, undefined, undefined, schema);
model.scheme = Object.assign((s, scheme) => (scheme = class extends SchemedModel {}, scheme.schema = s, scheme), schemes);
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
wick.scheme = model.scheme;
wick.model = model;
wick.presets = d=>new Presets(d);
wick.astCompiler = function(string){
	return wick_compile(whind(string), CompilerEnv);
};

export default wick;




