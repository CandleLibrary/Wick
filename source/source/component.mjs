import { Skeleton } from "./skeleton.mjs";
import { SourcePackage, BasePackage } from "./package.mjs";
import { ScriptNode } from "./compiler/nodes/script.mjs";
import { ScopedNode } from "./compiler/nodes/scoped.mjs";
import { SourceNode } from "./compiler/nodes/source.mjs";
import { SchemedModel } from "../model/schemed.mjs"
import { ModelBase } from "../model/base.mjs"
import { Model } from "../model/model.mjs"
import { Presets } from "../presets.mjs"
import URL from "@candlefw/url";
import whind from "@candlefw/whind";

function UID() {
    return "$ID" + (Date.now().toString(16).slice(-12) + ((Math.random() * 100000) | 0).toString(16)).slice(-16);
}
/**
 * This module allows JavaScript to be used to describe wick components. 
 */
//Bit offsets for NEED_SOURCE_BITS flag;
const SOURCE_BITS = {
    MODEL: 0,
    SCHEME: 1,
    EXPORT: 2,
    IMPORT: 3,
    PUT: 4,
}

let async_wait = 0;

export async function Component(data) {
    async_wait++;   
    const base = async_wait;

    let presets = new Presets();

    if(typeof(data) == "string"){
        const url = URL.resolveRelative(data);
        
        //Must be a JavaScript object, based on MIME and extension.
        const ext = url.path.slice(-3);

        if(ext == ".js"){
            try{
                const data = await url.fetchText(); 

                if(url.MIME == "text/javascript");
                await (new Promise(res=>{
                    (new Function("wick", data))(Component);

                    // Since we have an async function, we need some way to wait for the funciton to return be fore contining this 
                    // particular execution stack.
                    // setTimeout allows JS to wait without blocking.
                    const e = ()=>(async_wait <= base) ? res() : setTimeout(e, 0);
                    e();
                }))
            }catch(e){
                throw e;
            }
            return;
        }else if(ext == "mjs" && url.path.slice(-4) == ".mjs"){
            return;
        }else if(ext == "tml" && url.path.slice(-5) == ".html"){
            //fold data into itself to take advantage of SourcePackages automatic behavior when presented with a url
            data = {dom: await URL.resolveRelative(data).fetchText()};
        }
    }

    if (presets instanceof Presets)
        presets = presets.copy();
    

    let
        pkg = null,
        NEED_SOURCE_BITS = 0,
        tree;

    // Every tree root should be a SourceNode instance if data includes source node attributes.              
    // Create a bit field of all values that necessitate a SourceNode. 
    NEED_SOURCE_BITS |= ((typeof(data.model) !== "undefined") | 0) << SOURCE_BITS.MODEL;
    NEED_SOURCE_BITS |= ((typeof(data.scheme) !== "undefined") | 0) << SOURCE_BITS.SCHEME;
    NEED_SOURCE_BITS |= ((typeof(data.export) !== "undefined") | 0) << SOURCE_BITS.EXPORT;
    NEED_SOURCE_BITS |= ((typeof(data.import) !== "undefined") | 0) << SOURCE_BITS.IMPORT;
    NEED_SOURCE_BITS |= ((typeof(data.put) !== "undefined") | 0) << SOURCE_BITS.PUT;


    if (data.dom) { //This BasePackagecan be either a HTML string or a url. Need to check for that. 
        try {
            pkg = await new SourcePackage(data.dom, presets, true);
            tree = EnsureRootSource(pkg, NEED_SOURCE_BITS !== 0, presets);
        } catch (e) {
            throw e;
        }
    } else {
        //This object contains other information that can be appended to a component, but the component itself may not be mountable
        if (NEED_SOURCE_BITS !== 0) {
            let src = new ScriptNode();
            src.__presets__ = presets;
            let skl = new Skeleton();
            pkg = new BasePackage();

            skl.tree = src;
            pkg.skeletons.push[skl];
            tree = src;
        }
    }

    const { injects, model, scheme } = await integrateProperties(tree, presets, data);


    // TODO: If there is a component property and no Source attributes defined either 
    // in data or in the compiled tree, then extract the component from the package 
    // and discard package value.

    //Pass throughs are used to inject methods and attributes without affecting the dom. 



    // The default action with this object is to convert component back into a 
    // HTML tree string form that can be injected into the DOM of other components. 
    // Additional data can be added to this object before injection using this method.
    let return_value = function(data) {
        return tree.toString();
    }
    //This will ensure that something happens
    return_value.toString = function() { return tree.toString(); }

    Object.assign(return_value, injects, { model, scheme });

    //Unashamedly proxying the SourcePackage~mount method
    return_value.mount = function(e, m, s) { return pkg.mount(e, m, s) };

    Object.freeze(return_value);


    async_wait--;   

    return return_value;
}

// Ensure that if there is a need for a SourceNode, there is one attached to the 
// Having multiple node trees also require to be sub-trees of a SourceNode, to ensure expected 
// Component results.
function EnsureRootSource(pkg, NEED_SOURCE = false, presets) {
    let tree = null;

    if (pkg.skeletons.length > 1) NEED_SOURCE = true;

    if (NEED_SOURCE) {
        let source;
        if (pkg.skeletons.length == 1 && pkg.skeletons[0].tree instanceof SourceNode)
            tree = pkg.skeletons[0].tree
        else {
            source = new SourceNode();

            source.tag = "w-s";

            for (let i = 0; i < pkg.skeletons.length; i++)
                source.addChild(pkg.skeletons[i].tree);

            const skl = pkg.skeletons[0];

            skl.tree = source;

            pkg.skeletons = [skl];

            tree = source;
        }
    } else
        tree = pkg.skeletons[0].tree;

    tree.__presets__ = presets;

    console.log(tree)

    return tree;
}

async function integrateProperties(tree, presets, data) {
    const injects = {};
    let
        scheme = null,
        appending_inject = null;

    //Cycle through 
    for (name in data) {
        let v = data[name];
        switch (name) {
            case "inject":
                if (Array.isArray(v))
                    for (let i = 0; i < v.length; i++)
                        integrateProperties(tree, presets, v[i]);
                else
                    integrateProperties(tree, presets, v);
                break;
            case "dom":
                break;
            case "element":
                InjectElement(tree, v);
                break;
            case "tag":
                InjectTag(tree, presets, v);
                break;
            case "model":
                InjectModel(tree, v, presets);
                break;
            case "scheme":
                InjectSchema(tree, v, presets);
                break;
            case "import":
                InjectImport(tree, v);
                break;
            case "export":
                InjectExport(tree, v);
                break;
            case "put":
                InjectPut(tree, v);
                break;
            default:
                if (appending_inject = await InjectFunction(tree, name, v)) {
                    Object.assign(injects, appending_inject);
                    break;
                }
        }
    }

    return { injects, scheme };
}

function InjectElement(tree, v) {
    if (tree instanceof SourceNode)
        tree.setAttribute("element", whind(String(v)));
}

function InjectTag(tree, presets, tag_name) {

    let components = presets.components;
    if (components)
        components[tag_name] = tree;
}

function InjectModel(tree, model, presets) {
    let uid = UID();

    if (!(model instanceof ModelBase))
        model = new Model(model);

    presets.models[uid] = model;

    tree._model_name_ = uid;
}

function InjectSchema(tree, scheme, presets) {

    let uid = UID();

    let Scheme = scheme;

    if (!Scheme.prototype || Scheme.prototype !== SchemedModel){
        Scheme = class extends SchemedModel {};
        Scheme.schema = scheme;
    }

    presets.schemas[uid] = Scheme;

    tree._schema_name_ = uid;
}

function InjectImport(tree, $import) {
    if (tree instanceof SourceNode){
        const val = Array.isArray($import) ? $import.join(",") : $import;
        tree.processAttributeHook("import", whind(String(val)));
    }
}

function InjectExport(tree, $export) {
    if (tree instanceof SourceNode){
        const val = Array.isArray($export) ? $export.join(",") : $export;
        tree.processAttributeHook("export", whind(String(val)));
    }
}

function InjectPut(tree, put) {

    if (tree instanceof SourceNode){
        const val = Array.isArray(put) ? put.join(",") : put;
        tree.processAttributeHook("put", whind(String(val)));
    }
}

async function InjectFunction(tree, function_id, function_value) {

    const formal_tag = function_id.slice(0, 2);

    if (formal_tag[0] == "$" && formal_tag !== "$$") {

        const script = new ScriptNode();
        const function_name = function_id.slice(1);

        script.tag = "script";


        tree.addChild(script);

        script.processAttributeHook("on", whind(`((${function_name}))`));

        //if data is url pull that data in, other wise extract function data. 
        if (typeof function_value == "string") {
            //script.script_text = new URL().fetch()
        } else {
            script.processTextNodeHook(whind(function_value.toString().split(/[^\{]\{(.*)/)[1].slice(0, -1).trim()));
        }

        return {
            [function_id]: function_value };

    } else if (formal_tag == "$$") {

        const closure = new ScopedNode();
        const function_name = function_id.slice(2);

        tree.addChild(closure);

        closure.processAttributeHook("on", whind(`((${function_name}))`), function_value);

        return {
            [function_id]: function_value };
    }

    return null;
}
