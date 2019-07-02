import compiler from "./compiler/component.js";;

import wick_compile from "./compiler/wick.js";;
import CompilerEnv from "./compiler/compiler_env.js";;
//Models
import { Store } from "./model/store.js";;
import { SchemedModel } from "./model/schemed.js";;
import { schemes } from "./schema/schemas.js";;
import { Model } from "./model/model.js";;
import { ModelContainerBase } from "./model/container/base.js";;
import { MultiIndexedContainer } from "./model/container/multi.js";;
import { BTreeModelContainer } from "./model/container/btree.js";;
import { ArrayModelContainer } from "./model/container/array.js";;
import { Presets } from "./presets.js";;
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


