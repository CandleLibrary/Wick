import { copy, traverse } from "@candlelib/conflagrate";
import { CSSNode } from "@candlelib/css";
import { JSFunctionDeclaration, JSNode, JSNodeType, JSNodeTypeLU } from "@candlelib/js";
import URI from '@candlelib/uri';
import {
    ComponentData, ComponentStyle, FunctionFrame, HTMLNode,
    HTMLNodeClass,
    HTMLNodeType,
    HTMLTextNode,
    PresetOptions,
    WICK_AST_NODE_TYPE_BASE

} from "../../types/all.js";
import { getBindingRefCount, getRootFrame } from "../common/binding.js";
import { createParseFrame } from "../common/frame.js";
import { buildExportableDOMNode } from "../common/html.js";
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
        ? createParseFrame(frame,
            component, DONT_ATTACH, TEMPORARY)
        : component.root_frame;

    if (ast.type == JSNodeType.FunctionDeclaration)
        function_frame.method_name = <string>ast.nodes[0].value;

    function_frame.ast = <JSFunctionDeclaration>ast;

    return function_frame;
}

export function incrementBindingRefCounters(function_frame: FunctionFrame) {

    const root = getRootFrame(function_frame);

    for (const [name, count] of getBindingRefCount(function_frame).entries())

        if (root.binding_variables.has(name))

            root.binding_variables.get(name).ref_count += count;
}

export async function processFunctionDeclaration(node: JSNode, component: ComponentData, presets: PresetOptions, root_name = "") {
    return await processWickJS_AST(node, component, presets, root_name, component.root_frame);
}

export async function processWickJS_AST(ast: JSNode, component: ComponentData, presets: PresetOptions, root_name = "", frame = null, TEMPORARY = false): Promise<FunctionFrame> {
    return await processCoreAsync(
        ast,
        getFunctionFrame(ast, component, frame, TEMPORARY),
        component,
        presets
    );
}

export function postProcessFunctionDeclarationSync(node: JSNode, component: ComponentData, presets: PresetOptions) {
    return processCoreSync(
        node,
        getFunctionFrame(node, component, component.root_frame, true, false),
        component,
        presets,
    );
}

export async function processCoreAsync(
    ast: JSNode,
    function_frame: FunctionFrame,
    component: ComponentData,
    presets: PresetOptions
) {

    function_frame.backup_ast = copy(ast);

    function_frame.ast = <JSFunctionDeclaration>(await processNodeAsync(ast, function_frame, component, presets, true));



    incrementBindingRefCounters(function_frame);


    return function_frame;
}

export function processCoreSync(
    ast: JSNode,
    function_frame: FunctionFrame,
    component: ComponentData,
    presets: PresetOptions
) {

    function_frame.backup_ast = copy(ast);

    function_frame.ast = <JSFunctionDeclaration>processNodeSync(ast, function_frame, component, presets, true);

    incrementBindingRefCounters(function_frame);

    return function_frame;
}

export function processNodeSync(
    ast: JSNode,
    function_frame: FunctionFrame,
    component: ComponentData,
    presets: PresetOptions,
    SKIP_ROOT: boolean = false
) {

    const gen = processNodeGenerator(ast, function_frame, component, presets, SKIP_ROOT);

    let val = gen.next();

    while (val.done == false) {
        const { node } = val.value;
        val = gen.next(<JSNode>{
            type: JSNodeType.StringLiteral,
            quote_type: "\"",
            value: `
                Waiting on promise for [${JSNodeTypeLU[val.value.node.type]}]. Use 
                and await processNodeAsync instead of processNodeSync 
                to correctly parse this ast structure.`.replace(/\n/g, "\\n"),
            pos: node.pos
        });
    }
    return val.value;
}
/**
 * Process a single node through the JSParseHandlers
 * @param ast 
 * @param function_frame 
 * @param component 
 * @param presets 
 * @param SKIP_ROOT 
 * @returns 
 */
export async function processNodeAsync(
    ast: JSNode,
    function_frame: FunctionFrame,
    component: ComponentData,
    presets: PresetOptions,
    SKIP_ROOT: boolean = false
) {
    const gen = processNodeGenerator(ast, function_frame, component, presets, SKIP_ROOT);

    let val = gen.next();

    while (val.done == false)
        val = gen.next(await val.value.promise);

    return val.value;
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
*/
export function* processNodeGenerator(
    ast: JSNode,
    function_frame: FunctionFrame,
    component: ComponentData,
    presets: PresetOptions,
    SKIP_ROOT: boolean = false
): Generator<{ promise: Promise<JSNode | void>; node: JSNode; }, JSNode, JSNode | void> {

    const extract = { ast: null };

    SKIP_ROOT = !SKIP_ROOT;

    for (const { node, meta } of traverse(ast, "nodes")
        .makeReplaceable()
        .makeSkippable()
        .extract(extract)
    ) {
        if (!SKIP_ROOT) {
            SKIP_ROOT = true;
            continue;
        }

        for (const handler of JS_handlers[Math.max((node.type >>> 23), 0)]) {

            const
                pending = handler.prepareJSNode(node, meta.parent, meta.skip, component, presets, function_frame),
                result = (pending instanceof Promise)
                    ? yield { promise: pending, node }
                    : pending;

            if (result === undefined)
                continue;
            else if (result != node)
                meta.replace(<any>result);


            break;
        }
    }

    return extract.ast;
}

async function loadHTMLImports(ast: HTMLNode, component: ComponentData, presets: PresetOptions) {
    if (ast.import_list)
        for (const import_ of <HTMLNode[]>(ast.import_list)) {
            for (const handler of html_handlers[(HTMLNodeType.HTML_IMPORT >>> 23) - WICK_AST_NODE_TYPE_BASE]) {
                if (! await handler.prepareHTMLNode(import_, ast, import_, 0, () => { }, component, presets)) break;
            }
        }
}

export async function processWickHTML_AST(ast: HTMLNode,
    component: ComponentData,
    presets: PresetOptions,
    USE_AS_PRIMARY_HTML: boolean = true
): Promise<HTMLNode> {
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

    let last_element = null, ele_index = component.element_counter;

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
                pending = handler.prepareHTMLNode(node, parent, last_element, ele_index, skip, component, presets),
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

    component.element_counter = ele_index;

    if (receiver.ast) {

        if (USE_AS_PRIMARY_HTML)
            component.HTML = buildExportableDOMNode(receiver.ast);
        else
            component.INLINE_HTML.push(receiver.ast);

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



export function processWickCSS_AST(
    ast: HTMLNode,
    component: ComponentData,
    presets: PresetOptions,
    url: URI = component.location,
    host_node_index: number = 1,
): Promise<void> {
    //Extract style sheet and add to the components stylesheets

    const INLINE = url != component.location;

    if (!INLINE)
        if (presets.styles.has(url + "")) {
            component.CSS.push(presets.styles.get(url + ""));
            return;
        }

    const [stylesheet] = <CSSNode[]><unknown>ast.nodes,
        style: ComponentStyle = {
            data: stylesheet,
            location: url,
            container_element_index: host_node_index
        };

    if (!INLINE)
        presets.styles.set(url + "", style);

    component.CSS.push(style);
}