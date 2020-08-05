import { MinTreeNode, MinTreeNodeType, MinTreeNodeClass, ext } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";

import { Component, FunctionFrame } from "../types/types.js";
import Presets from "../presets.js";
import { JS_handlers } from "./component_default_js_handlers.js";
import { createFrame } from "./component_common.js";

function processPreamble(ast: MinTreeNode, component: Component, frame: FunctionFrame = null, TEMPORARY = false) {
    const function_frame = frame ?
        createFrame(frame, TEMPORARY, component) :
        component.root_frame;

    if (ast.type == MinTreeNodeType.FunctionDeclaration)
        function_frame.name = <string>ast.nodes[0].value;

    return function_frame;
}

async function processCoreAsync(ast: MinTreeNode, function_frame: FunctionFrame, component: Component, presets: Presets, root_name: string, frame: FunctionFrame = null) {
    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(function_frame)
    ) {
        if (node.type & MinTreeNodeClass.CLOSURE) {
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
    return function_frame;
}

function processCoreSync(ast: MinTreeNode, function_frame: FunctionFrame, component: Component, presets: Presets, root_name: string, frame: FunctionFrame = null) {

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(function_frame)
    ) {
        if (node.type & MinTreeNodeClass.CLOSURE) {
            // const temp_ff = processPreamble(node, component, frame, true);
            // processCoreSync(node, temp_ff, component, presets, root_name, frame);
            // meta.skip();
        }

        for (const handler of JS_handlers[Math.max((node.type >>> 23), 0)]) {

            const pending = handler.prepareJSNode(node, meta.parent, meta.skip, component, presets, function_frame);

            let result = null;

            if (pending instanceof Promise) {
                result = {
                    type: MinTreeNodeType.StringLiteral,
                    quote_type: "\"",
                    value: `Waiting on promise for [${MinTreeNodeType[node.type]}]. Use processFunctionDeclaration instead of processFunctionDeclarationSync to correctly parse this ast structure.`,
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

    return function_frame;
}
export async function processFunctionDeclaration(node: MinTreeNode, component: Component, presets: Presets, root_name = "") {
    return await processWickJS_AST(node, component, presets, root_name, component.root_frame);
}

export async function processWickJS_AST(ast: MinTreeNode, component: Component, presets: Presets, root_name = "", frame = null, TEMPORARY = false): Promise<FunctionFrame> {
    return await processCoreAsync(
        ast,
        processPreamble(ast, component, frame, TEMPORARY),
        component,
        presets,
        root_name
    );
}

export function processFunctionDeclarationSync(node: MinTreeNode, component: Component, presets: Presets, root_name = "") {
    return processCoreSync(
        node,
        processPreamble(node, component, component.root_frame),
        component,
        presets,
        root_name
    );
}