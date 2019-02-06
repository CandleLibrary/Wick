import {source, scheme, model, core, internals} from "./library";

export {source};
export {scheme};
export {model};
export {core};
export {internals};

function compile(element, presets, RETURN_PROMISE){
		return new SourcePackage(element, presets, RETURN_PROMISE);
}

const wick = {
	source,
	scheme,
	model,
	core,
	internals,
	compile
};

export default wick;

import { Presets } from "./presets";
import { SchemeConstructor, DateSchemeConstructor, TimeSchemeConstructor, StringSchemeConstructor, NumberSchemeConstructor, BoolSchemeConstructor, schemes } from "./schema/schemas";
import { Store } from "./model/store";
import { SchemedModel } from "./model/schemed";
import { Model } from "./model/model";
import { ModelContainerBase } from "./model/container/base";
import { MultiIndexedContainer } from "./model/container/multi";
import { BTreeModelContainer } from "./model/container/btree";
import { ArrayModelContainer } from "./model/container/array";
import { View } from "./view";
import { SourcePackage } from "./source/package";
import { Source } from "./source/source";
import { CompileSource } from "./source/compiler/compiler";
import { RootText } from "./source/compiler/nodes/root";
import { RootNode } from "./source/compiler/nodes/index";
import { StyleNode } from "./source/compiler/nodes/style";
import { ScriptNode } from "./source/compiler/nodes/script";
import { SourceNode } from "./source/compiler/nodes/source";
import { PackageNode } from "./source/compiler/nodes/package";
import { SVGNode } from "./source/compiler/nodes/svg";
import { SourceTemplateNode } from "./source/compiler/nodes/template";

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
    schemes
};
