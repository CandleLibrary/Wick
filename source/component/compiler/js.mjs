import URL from "@candlefw/url";
import whind from "@candlefw/whind";

//Runtime
import { ScopePackage } from "../runtime/package.mjs";
import { BasePackage } from "../runtime/base_package.mjs";

//Nodes
import { RootNode } from "./nodes/root.mjs";
import { ScriptNode } from "./nodes/script.mjs";
import { ScopedNode } from "./nodes/scoped.mjs";
import { ScopeNode } from "./nodes/scope.mjs";
import { ScopeContainerNode } from "./nodes/container.mjs";

//Model
import { SchemedModel } from "../../model/schemed.mjs"
import { ModelBase } from "../../model/base.mjs"
import { Model } from "../../model/model.mjs"

//General
import { Presets } from "../../presets.mjs"
import { Plugin } from "../../plugin.mjs"
import { getFunctionBodyString } from "../../utils/get_function_body.mjs"

const
    UID = () => "$ID" + (Date.now().toString(16).slice(-12) + ((Math.random() * 100000) | 0).toString(16)).slice(-16),

    //Bit offsets for NEED_SCOPE_BITS flag;
    SCOPE_BITS = {
        MODEL: 0,
        SCHEME: 1,
        EXPORT: 2,
        IMPORT: 3,
        PUT: 4,
        ARRAY_MODEL: 5,
        FUNCTION_MODEL: 6,
    };



export const JSCompiler = (data, presets) => createComponentWithJSSyntax(data, presets, document.location.toString())

/**
 * This module allows JavaScript to be used to describe wick components. 
 */
async function createComponentWithJSSyntax(data, presets = new Presets(), locale = "", stack = [], async_wait = { waiting: 0 }) {

    const
        base = ++async_wait.waiting,
        rs_base = stack.length,
        DATA_IS_STRING = typeof(data) == "string";

    let url = data;

    if ((DATA_IS_STRING && (url = URL.resolveRelative(data, locale))) || data instanceof URL) {

        const
            //Must be a JavaScript object, based on MIME and extension.
            ext = url.ext;

        if (ext == "js") {

            try {
                //Attempt to load data. If this fails, than data is not a URL or the resource (does not exist / is not accessible).
                const data = await url.fetchText();

                if (url.MIME == "text/javascript");

                await (new Promise(async res => {

                    const out = (data) => createComponentWithJSSyntax(data, presets, url, stack, async_wait);

                    (new Function("wick", "url", data))(Object.assign(out, JSCompiler), url);


                    // Since we have an async function, we need some way to wait for the function to 
                    // return be fore contining this particular execution stack.
                    // setTimeout allows JS to wait without blocking.
                    function e() {
                        if (async_wait.waiting <= base) {
                            res();
                            clearInterval(id);
                        }
                    };

                    let id = setInterval(e, 0);
                }))

                let rvalue = null;

                while (stack.length > rs_base)
                    rvalue = stack.shift();

                async_wait--;

                return rvalue;
            } catch (e) {
                console.log.log(e)
            }
        } else if (ext == "mjs") {
            return; //Todo, parse using import syntax
        } else if (ext == "html") {
            // fold data into itself to take advantage of ScopePackages automatic behavior when 
            // presented with a url
            data = { dom: await url.fetchText() };

            //Make sure we treat the previous fetch as the new url base.
            locale = url;
        }


    }

    if (DATA_IS_STRING || data instanceof HTMLElement)
        data = { dom: data };

    let
        pkg = null,
        NEED_SCOPE_BITS = 0,
        NEED_CONTAINER_BITS = 0,
        tree,
        container,
        container_scope;

    // Every tree root should be a ScopeNode instance if data includes scope node attributes.              
    // Create a bit field of all values that necessitate a ScopeNode. 

    NEED_SCOPE_BITS |= ((typeof(data.model) !== "undefined") | 0) << SCOPE_BITS.MODEL;
    NEED_SCOPE_BITS |= ((typeof(data.scheme) !== "undefined") | 0) << SCOPE_BITS.SCHEME;
    NEED_SCOPE_BITS |= ((typeof(data.export) !== "undefined") | 0) << SCOPE_BITS.EXPORT;
    NEED_SCOPE_BITS |= ((typeof(data.import) !== "undefined") | 0) << SCOPE_BITS.IMPORT;
    NEED_SCOPE_BITS |= ((typeof(data.put) !== "undefined") | 0) << SCOPE_BITS.PUT;
    //NEED_CONTAINER_BITS |= ((typeof(data.model) === "function") | 0) << SCOPE_BITS.FUNCTION_MODEL;
    NEED_CONTAINER_BITS |= (Array.isArray(data.model) | 0) << SCOPE_BITS.ARRAY_MODEL;

    // If the model or scheme is an array, then the resulting component root should be either a 
    // ContainerNode or a ContainerNode wrapped inside a ScopeNode.

    if (data.dom && (typeof(data.dom) == "string" || data.dom.tagName == "TEMPLATE")) {

        let val = data.dom;

        if (typeof(data.dom) == "string") {

            const url = URL.resolveRelative(data.dom, locale);

            if (url && url.ext == "html")
                val = await url.fetchText()
        }

        try {
            pkg = await new ScopePackage(val, presets, true, locale);

            //Throw any errors generated by package creation. 
            //TODO - implement error system.
            if (pkg.HAVE_ERRORS)
                throw pkg.errors[0]

            var { scope_tree, container_tree, container_scope_tree } = EnsureRootScope(pkg, NEED_SCOPE_BITS, NEED_CONTAINER_BITS, presets);
        } catch (e) {
            throw e;
        }

    } else {

        // This object contains other information that can be appended to a component, but the 
        // component itself may not be mountable
        if (NEED_SCOPE_BITS !== 0) {
            let src = new ScriptNode();

            src.__presets__ = presets;

            pkg = new BasePackage();

            pkg.asts = [src];

            var scope_tree = src;
        }
    }

    const { injects, model, scheme } = await integrateProperties(scope_tree, container_tree, container_scope_tree, presets, data);


    // TODO: If there is a component property and no Scope attributes defined either 
    // in data or in the compiled tree, then extract the component from the package 
    // and discard package value.

    //Pass throughs are used to inject methods and attributes without affecting the dom. 

    // The default action with this object is to convert component back into a 
    // HTML tree string form that can be injected into the DOM of other components. 
    // Additional data can be added to this object before injection using this method.
    let return_value = (data) => scope_tree.toString();

    return_value.toString = async function(model = {}) {

        if (model) {

            let scope = scope_tree.build(null, null, presets, [], null, null, true);

            scope.load(model);

            //Wait one tick to update any IOs that are dependent on spark
            await (new Promise(res => setTimeout(res, 1)));

            return scope.ele.toString()
        }

        return scope_tree.toString();
    }

    Object.assign(return_value, injects, { model, scheme, get tree() { return scope_tree } });

    //Unashamedly proxying the ScopePackage~mount method
    return_value.mount = (e, m, s, mgr) => pkg.mount(e, m, s, mgr);

    Object.freeze(return_value);


    async_wait.waiting--;

    stack.push(return_value);

    return return_value;
}

function checkFlag(FLAG_BITS, flag_bit_offset) {
    return !!(FLAG_BITS >> flag_bit_offset & 1);
}
// Ensure that if there is a need for a ScopeNode, there is one set as the root of the tree 
// Having multiple node trees also require them to be sub-trees of a ScopeNode, to ensure expected 
// Component results.
function EnsureRootScope(pkg, NEED_SCOPE_BITS, NEED_CONTAINER_BITS, presets) {

    let
        scope_tree = null,
        container_tree = null,
        container_scope_tree = null,
        tree = null;

    if (pkg.asts.length > 1) NEED_SCOPE_BITS |= 0x1000000;

    if (NEED_SCOPE_BITS || NEED_CONTAINER_BITS) {
        if (pkg.asts.length == 1 && pkg.asts[0] instanceof ScopeNode)
            scope_tree = pkg.asts[0]
        else {
            let scope = new ScopeNode();

            scope.tag = "w-s";

            for (let i = 0; i < pkg.asts.length; i++)
                scope.addChild(pkg.asts[i]);

            scope.__presets__ = presets;

            pkg.asts = [scope];

            scope_tree = scope;
        }
    } else
        scope_tree = pkg.asts[0];

    if (NEED_CONTAINER_BITS) {
        //Wrap existing scope into a container
        container_tree = new ScopeContainerNode();
        container_tree.__presets__ = presets;
        container_tree.tag = "w-c";
        container_tree.package = new BasePackage();
        container_tree.package.READY = true;
        container_tree.package.asts = pkg.asts;

        pkg.asts = [container_tree];

        container_scope_tree = container_tree.package.asts[0];
        scope_tree = container_scope_tree;

        /*SCOPE_BITS = {
            MODEL: 0,
            SCHEME: 1,
            EXPORT: 2,
            IMPORT: 3,
            PUT: 4,
            ARRAY_MODEL: 5,
            FUNCTION_MODEL: 6,
        }*/

        if (
            checkFlag(NEED_SCOPE_BITS, SCOPE_BITS.MODEL) ||
            checkFlag(NEED_SCOPE_BITS, SCOPE_BITS.IMPORT) ||
            checkFlag(NEED_SCOPE_BITS, SCOPE_BITS.EXPORT) ||
            checkFlag(NEED_SCOPE_BITS, SCOPE_BITS.PUT)
        ) {
            const scope = new ScopeNode();

            scope.tag = "w-s";

            scope.addChild(container_tree);

            scope.__presets__ = presets;

            pkg.asts = [scope];

            scope_tree = scope;
        }
    }


    return { scope_tree, container_tree, container_scope_tree };
}

async function integrateProperties(src, cntr, cntr_src, presets, data) {
    const injects = {};
    let
        scheme = null,
        appending_inject = null;

    //Cycle through 
    for (let name in data) {
        let v = data[name];
        switch (name) {
            case "filter":
                break;
            case "inject":
                if (Array.isArray(v))
                    for (let i = 0; i < v.length; i++)
                        integrateProperties(src, presets, v[i]);
                else
                    integrateProperties(src, presets, v);
                break;
            case "dom":
                break;
            case "element":
                InjectElement(cntr_src || src, v);
                break;
            case "tag":
                InjectTag(src, presets, v);
                break;
            case "model":
                InjectModel(src, cntr, v, presets);
                break;
            case "scheme":
                InjectSchema(cntr_src || src, v, presets);
                break;
            case "import":
                InjectImport(src, v);
                if (cntr_src)
                    InjectImport(cntr_src, v);
                break;
            case "export":
                InjectExport(src, v);
                if (cntr_src)
                    InjectExport(cntr_src, v);
                break;
            case "put":
                InjectPut(src, v);
                if (cntr_src)
                    InjectPut(cntr_src, v);
                break;
            default:
                if (appending_inject = await InjectFunction(src, name, v)) {
                    Object.assign(injects, appending_inject);
                    break;
                }
        }
    }

    return { injects, scheme };
}

function InjectElement(tree, v) {
    if (tree instanceof ScopeNode)
        tree.setAttribute("element", whind(String(v)));
}

function InjectTag(tree, presets, tag_name) {

    let components = presets.components;
    if (components)
        components[tag_name] = tree;
}

function InjectModel(src_tree, container_tree, model, presets) {
    if (typeof(model) == "string" && presets.models[model]) {
        src_tree._model_name_ = model;
    } else {
        if (container_tree) {
            if (!Array.isArray(model) || model.length == 0)
                throw new Error("Expecting an array value in for model");
            let offset = 0;

            if (model.length > 1) {
                offset++;

                let uid = UID(),
                    m = model[0];

                if (!(m instanceof ModelBase))
                    m = new Model(m);

                presets.models[uid] = m;

                src_tree._model_name_ = uid;
            }

            if (typeof(model[offset]) !== "string")
                throw new Error("Expecting a string expression inside array");

            container_tree.processTextNodeHook(whind(`((${model[offset]}))`))

        } else {

            let uid = UID();

            if (!(model instanceof ModelBase))
                model = new Model(model);

            presets.models[uid] = model;

            src_tree._model_name_ = uid;
        }
    }
}

function InjectSchema(tree, scheme, presets) {

    let
        uid = UID(),
        Scheme = scheme;

    if (!Scheme.prototype || !(Scheme.prototype instanceof SchemedModel)) {
        Scheme = class extends SchemedModel {};
        Scheme.schema = scheme;
    }

    presets.schemas[uid] = Scheme;

    tree._schema_name_ = uid;
}

function InjectImport(tree, $import) {
    if (tree instanceof ScopeNode) {
        const val = Array.isArray($import) ? $import.join(",") : $import;
        tree.processAttributeHook("import", whind(String(val)));
    }
}

function InjectExport(tree, $export) {
    if (tree instanceof ScopeNode) {
        const val = Array.isArray($export) ? $export.join(",") : $export;
        tree.processAttributeHook("export", whind(String(val)));
    }
}

function InjectPut(tree, put) {

    if (tree instanceof ScopeNode) {
        const val = Array.isArray(put) ? put.join(",") : put;
        tree.processAttributeHook("put", whind(String(val)));
    }
}

async function InjectFunction(tree, function_id, function_value) {

    const formal_tag = function_id.slice(0, 2);

    if (formal_tag[0] == "$" && formal_tag !== "$$") {

        const
            script = new ScriptNode(),
            function_name = function_id.slice(1);

        script.tag = "script";


        tree.addChild(script);

        script.processAttributeHook("on", whind(`((${function_name}))`));

        //if data is url pull that data in, other wise extract function data. 
        if (typeof function_value == "string") {
            //script.script_text = new URL().fetch()
        } else {
            script.processTextNodeHook(whind(getFunctionBodyString(function_value)));
        }

        return {
            [function_id]: function_value
        };

    } else if (formal_tag == "$$") {

        const closure = new ScopedNode();
        const function_name = function_id.slice(2);

        tree.addChild(closure);

        closure.processAttributeHook("on", whind(`((${function_name}))`), function_value);

        return {
            [function_id]: function_value
        };
    }

    return null;
}

//Url Importing is extended to allow Component function to resolve HTML/JS/MJS url requests
RootNode.prototype.processFetchHook = function(lexer, OPENED, IGNORE_TEXT_TILL_CLOSE_TAG, parent, url) {
    let path = this.url.path,
        CAN_FETCH = true;

    //make sure URL is not already called by a parent.
    while (parent) {
        if (parent.url && parent.url.path == path) {
            console.warn(`Preventing recursion on rescope ${this.url.path}`);
            CAN_FETCH = false;
            break;
        }
        parent = parent.par;
    }

    if (CAN_FETCH) {
        return this.url.fetchText().then(async (text) => {
            const { ext, data } = await Plugin.extensionParse(this.url.ext, text);

            let lexer = whind(data);
            if (ext == "html")
                return this.parseRunner(lexer, true, IGNORE_TEXT_TILL_CLOSE_TAG, this, this.url);
            else if (ext == "js") {

                if (this.tag == "script")
                    return this.parseRunner(lexer, true, IGNORE_TEXT_TILL_CLOSE_TAG, this, this.url);

                const tree = (await JSCompiler(this.url, this.presets)).tree;

                this.addChild(tree);

                return this;
            } else if (ext == "mjs") {
                debugger
            }
        }).catch((e) => {
            return this;
        });
    }
    return null;
};
