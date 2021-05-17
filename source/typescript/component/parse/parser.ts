import { copy, traverse } from "@candlefw/conflagrate";
import { CSSNode } from "@candlefw/css";
import { JSNode, JSNodeType, JSNodeTypeLU } from "@candlefw/js";
import { getBindingRefCount, getRootFrame } from "../../common/binding.js";
import { createFrame } from "../../common/frame.js";
import Presets from "../../common/presets.js";
import { ComponentData, ComponentStyle } from "../../types/component";
import { FunctionFrame } from "../../types/function_frame";
import { ContainerDomLiteral, DOMLiteral } from "../../types/html";
import {
    HTMLContainerNode,
    HTMLNode,
    HTMLNodeClass,
    HTMLNodeType,
    HTMLTextNode,
    WICK_AST_NODE_TYPE_BASE
} from "../../types/wick_ast.js";
import { html_handlers } from "./html.js";
import { JS_handlers } from "./js.js";


export function getFunctionFrame(
    ast: JSNode,
    component: ComponentData,
    frame: FunctionFrame = null,
    DONT_ATTACH = false,
    TEMPORARY = DONT_ATTACH
) {
    const function_frame = frame
        ? createFrame(frame,
            component, DONT_ATTACH, TEMPORARY)
        : component.root_frame;

    if (ast.type == JSNodeType.FunctionDeclaration)
        function_frame.name = <string>ast.nodes[0].value;

    function_frame.ast = ast;

    return function_frame;
}
/**[API] 
 * This function is responsible for processing a JavaScript AST. It processes
 * AST nodes in a single top-down, depth-first pass. 
 * 
 * Each node is processed by a dedicated @JSHandler that can opt to transform 
 * the node, replace it, or ignore it. If more than one handler is able to
 * process a given node type, then the @JSHandler that first returns a value
 * other than undefined will be the last handler that is able to modify that
 * node. Processing will then proceed to the next node in the tree.
 * 
 * Once all nodes are processed, an output AST is assigned to the function frame`s
 * `ast` property. There are no guarantees the input AST will not be modified
 * by actions taken by @JSHandlers.
 * 
*/
export async function processCoreAsync(
    ast: JSNode,
    function_frame: FunctionFrame,
    component: ComponentData,
    presets: Presets
) {
    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(function_frame)
    ) {

        for (const handler of JS_handlers[Math.max((node.type >>> 23), 0)]) {

            const pending = handler.prepareJSNode(node, meta.parent, meta.skip, component, presets, function_frame);

            let result = null;

            if (pending instanceof Promise) result = await pending;
            else result = pending;

            if (result != node) {
                if (result === null || result) {

                    meta.replace(result);

                    if (result === null)
                        continue main_loop;

                } else
                    continue;
            } break;
        }
    }

    function_frame.backup_ast = copy(function_frame.ast);

    incrementBindingRefCounters(function_frame);

    return function_frame;
}

function incrementBindingRefCounters(function_frame: FunctionFrame) {

    const root = getRootFrame(function_frame);

    for (const [name, count] of getBindingRefCount(function_frame).entries()) {
        if (root.binding_variables.has(name))
            root.binding_variables.get(name).ref_count += count;
    }
}

export function processCoreSync(
    ast: JSNode,
    function_frame: FunctionFrame,
    component: ComponentData,
    presets: Presets
) {

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(function_frame)
    ) {
        for (const handler of JS_handlers[Math.max((node.type >>> 23), 0)]) {

            const pending = handler.prepareJSNode(node, meta.parent, meta.skip, component, presets, function_frame);

            let result = null;

            if (pending instanceof Promise) {
                result = {
                    type: JSNodeType.StringLiteral,
                    quote_type: "\"",
                    value: `Waiting on promise for [${JSNodeTypeLU[node.type]}]. Use processFunctionDeclaration instead of processFunctionDeclarationSync to correctly parse this AST structure.`,
                    pos: node.pos
                };
            }
            else result = pending;

            if (result != node) {
                if (result === null || result) {

                    meta.replace(result);

                    if (result === null)
                        continue main_loop;

                } else
                    continue;
            } break;
        }
    }

    function_frame.backup_ast = copy(function_frame.ast);

    incrementBindingRefCounters(function_frame);

    return function_frame;
}

export function processNodeSync(ast: JSNode, function_frame: FunctionFrame, component: ComponentData, presets: Presets) {

    const extract = { ast: null };

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(extract)
    ) {

        for (const handler of JS_handlers[Math.max((node.type >>> 23), 0)]) {

            const pending = handler.prepareJSNode(node, meta.parent, meta.skip, component, presets, function_frame);

            let result = null;

            if (pending instanceof Promise) {
                result = {
                    type: JSNodeType.StringLiteral,
                    quote_type: "\"",
                    value: `Waiting on promise for [${JSNodeTypeLU[node.type]}]. Use processFunctionDeclaration instead of processFunctionDeclarationSync to correctly parse this ast structure.`,
                    pos: node.pos
                };
            }
            else result = pending;

            if (result != node) {
                if (result === null || result) {

                    meta.replace(result);

                    if (result === null)
                        continue main_loop;

                } else
                    continue;
            } break;
        }
    }

    return extract.ast;
}

export async function processFunctionDeclaration(node: JSNode, component: ComponentData, presets: Presets, root_name = "") {
    return await processWickJS_AST(node, component, presets, root_name, component.root_frame);
}

export async function processWickJS_AST(ast: JSNode, component: ComponentData, presets: Presets, root_name = "", frame = null, TEMPORARY = false): Promise<FunctionFrame> {
    return await processCoreAsync(
        ast,
        getFunctionFrame(ast, component, frame, TEMPORARY),
        component,
        presets,
        root_name
    );
}

export function postProcessFunctionDeclarationSync(node: JSNode, component: ComponentData, presets: Presets) {
    return processCoreSync(
        node,
        getFunctionFrame(node, component, component.root_frame, true, false),
        component,
        presets,
    );
}

function buildExportableDOMNode(
    ast: HTMLNode & {
        component_name?: string;
        slot_name?: string;
        data?: any;
        id?: number;
        ele_id?: number;
        name_space?: number;
    }): DOMLiteral {

    const node: DOMLiteral = <DOMLiteral>{ pos: ast.pos };

    node.tag_name = ast.tag || "";

    if (ast.slot_name)
        node.slot_name = ast.slot_name;


    if (ast.IS_BINDING)
        node.is_bindings = true;

    if (ast.component_name)
        node.component_name = ast.component_name;


    if (ast.is_container) {

        const
            ctr = <ContainerDomLiteral>node,
            ctr_ast = <HTMLContainerNode>ast;

        ctr.is_container = true;
        ctr.component_names = ctr_ast.component_names;
        ctr.container_id = ctr_ast.container_id;
        ctr.component_attribs = ctr_ast.component_attributes;

        if (ctr.tag_name == "CONTAINER")
            ctr.tag_name = "DIV";
    }

    if (ast.attributes && ast.attributes.length > 0) {

        node.attributes = [];

        for (const attrib of ast.attributes)
            node.attributes.push([attrib.name, attrib.value]);

    }

    /***
     * DOM
     */

    if (ast.nodes && ast.nodes.length > 0) {
        node.children = [];
        for (const child of ast.nodes)
            node.children.push(buildExportableDOMNode(child));
    }

    node.element_index = ast.id;

    if (ast.data) {
        node.data = ast.data;

    } else if (ast.name_space > 0) {
        node.namespace_id = ast.name_space || 0;
    }

    node.comp = ast.comp;

    return node;
}

async function loadHTMLImports(ast: HTMLNode, component: ComponentData, presets: Presets) {
    if (ast.import_list)
        for (const import_ of <HTMLNode[]>(ast.import_list)) {
            for (const handler of html_handlers[(HTMLNodeType.HTML_IMPORT >>> 23) - WICK_AST_NODE_TYPE_BASE]) {
                if (! await handler.prepareHTMLNode(import_, ast, import_, 0, () => { }, null, component, presets)) break;
            }
        }
}


export async function processWickHTML_AST(ast: HTMLNode, component: ComponentData, presets: Presets): Promise<HTMLNode> {
    //Process the import list

    //@ts-ignore
    await loadHTMLImports(ast, component, presets);

    //Process the ast and return a node that  
    const receiver: {
        ast: HTMLNode & {
            component_name?: string;
            slot_name?: string;
            data?: any;
            id?: number;
            ele_id?: number;
            name_space?: number;
        };
    } = { ast: null },
        attribute_handlers = html_handlers[Math.max((HTMLNodeType.HTMLAttribute >>> 23) - WICK_AST_NODE_TYPE_BASE, 0)];

    let last_element = null, ele_index = -1;

    //Remove content-less text nodes.
    for (const { node, meta: { prev, next, mutate } } of traverse(ast, "nodes")
        .makeMutable()
        .filter("type", HTMLNodeType.HTMLText)
    ) {
        if (node.type == HTMLNodeType.HTMLText) {
            const text = <HTMLTextNode>node;

            text.data = (<string>text.data).replace(/[ \n]+/g, " ");

            if (text.data == ' ') {
                if (prev && prev.type == HTMLNodeType.WickBinding
                    && next && next.type == HTMLNodeType.WickBinding)
                    continue;

                mutate(null);
            }
        }
    }

    main_loop:
    for (const { node, meta: { replace, parent, skip } } of traverse(ast, "nodes")
        .makeReplaceable()
        .makeSkippable()
        .extract(receiver)
    ) {

        let html_node = node;


        for (const handler of html_handlers[Math.max((node.type >>> 23) - WICK_AST_NODE_TYPE_BASE, 0)]) {

            const
                pending = handler.prepareHTMLNode(node, parent, last_element, ele_index, skip, () => { }, component, presets),
                result = (pending instanceof Promise) ? await pending : pending;

            if (result != node) {
                if (result === null || result) {

                    html_node = <HTMLNode>result;

                    replace(<HTMLNode>result);

                    if (result === null)
                        continue main_loop;
                } else
                    continue;
            }

            break;
        }

        if (html_node.type & HTMLNodeClass.HTML_ELEMENT || html_node.type == HTMLNodeType.WickBinding)
            html_node.id = ++ele_index;

        if (!html_node.comp)
            html_node.comp = component.name;

        //Process Attributes of HTML Elements.
        if (html_node.type & HTMLNodeClass.HTML_ELEMENT) {

            last_element = html_node;

            for (const { node: attrib, meta: meta2 } of traverse(html_node, "attributes").skipRoot().makeMutable()) {

                for (const handler of attribute_handlers) {

                    let result = handler.prepareHTMLNode(
                        attrib,
                        meta2.parent,
                        meta2.parent,
                        ele_index,
                        () => { },
                        replace,
                        component,
                        presets
                    );

                    if (result instanceof Promise)
                        result = await result;

                    if (result != html_node) {
                        if (result === null || result)
                            meta2.mutate(<HTMLNode>result);
                        else
                            continue;
                    }

                    break;
                }
            }
        }
    }


    if (receiver.ast) {

        component.HTML = buildExportableDOMNode(receiver.ast);
        if (
            receiver.ast.component_name
        ) {
            const sup_component = presets.components.get(receiver.ast.component_name);

            component.root_ele_claims = [...sup_component.root_ele_claims, component.name];
        } else {
            component.root_ele_claims = [component.name];
        }
    }

    return receiver.ast;
}



export function processWickCSS_AST(ast: HTMLNode, component: ComponentData, presets: Presets, url: string = ""): Promise<void> {
    //Extract style sheet and add to the components stylesheets
    if (url)
        if (presets.styles.has(url)) {
            component.CSS.push(presets.styles.get(url));
            return;
        }

    const [stylesheet] = <CSSNode[]><unknown>ast.nodes,
        style: ComponentStyle = {
            data: stylesheet,
            INLINE: !url,
            location: url
        };
    if (url)
        presets.styles.set(url, style);

    component.CSS.push(style);
}