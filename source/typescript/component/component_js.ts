import { JSNode, JSNodeType, JSNodeTypeLU, JSNodeClass, ext } from "@candlefw/js";
import { traverse, copy } from "@candlefw/conflagrate";

import { FunctionFrame } from "../types/function_frame";
import { ComponentData } from "../types/component_data";
import Presets from "../presets.js";
import { JS_handlers } from "./component_default_js_handlers.js";
import { createFrame } from "./component_create_frame.js";

function processPreamble(ast: JSNode, component: ComponentData, frame: FunctionFrame = null, DONT_ATTACH = false, TEMPORARY = DONT_ATTACH) {
    const function_frame = frame
        ? createFrame(frame, component, DONT_ATTACH, TEMPORARY)
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
 * other than defined will be the last handler that is able to modify that
 * node. Processing will then proceed to the next node in the AST.
 * 
 * Once all nodes are processed, an output AST is assigned to the function frame`s
 * `ast` property. There are no guarantees the input AST will not be modified
 * by actions taken by @JSHandlers.
 * 
*/
async function processCoreAsync(ast: JSNode, function_frame: FunctionFrame, component: ComponentData, presets: Presets, root_name: string, frame: FunctionFrame = null) {
    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(function_frame)
    ) {

        if (node.type & JSNodeClass.BLOCK) {
            const temp_ff = processPreamble(node, component, frame, true);
            await processCoreAsync(node, temp_ff, component, presets, root_name, function_frame);
            meta.skip();
        }

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

    //if(presets.BACKUP_FRAMES)
    function_frame.backup_ast = copy(function_frame.ast);

    return function_frame;
}

export function processCoreSync(ast: JSNode, function_frame: FunctionFrame, component: ComponentData, presets: Presets) {

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(function_frame)
    ) {
        if (node.type & JSNodeClass.BLOCK) {
            // const temp_ff = processPreamble(node, component, frame, true);
            // processCoreSync(node, temp_ff, component, presets, root_name, frame);
            // meta.skip();
        }

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
        processPreamble(ast, component, frame, TEMPORARY),
        component,
        presets,
        root_name
    );
}

export function processFunctionDeclarationSync(node: JSNode, component: ComponentData, presets: Presets) {
    return processCoreSync(
        node,
        processPreamble(node, component, component.root_frame),
        component,
        presets
    );
}

export function postProcessFunctionDeclarationSync(node: JSNode, component: ComponentData, presets: Presets) {
    return processCoreSync(
        node,
        processPreamble(node, component, component.root_frame, true, false),
        component,
        presets,
    );
}