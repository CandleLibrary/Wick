import { MinTreeNode, MinTreeNodeType } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";
import { Component } from "../types/types.js";
import Presets from "./presets.js";
import { JS_handlers } from "./default_js_handlers.js";



export async function processFunctionDeclaration(node: MinTreeNode, component: Component, presets: Presets, root_name = "") {



    //@ts-ignore
    const temp_component = <Component>{ CSS: [], HTML: null, function_blocks: [], location: "", binding_variables: component.binding_variables, names: [] };

    await processWickJS_AST(node, temp_component, presets, root_name);

    component.function_blocks.push(...temp_component.function_blocks.map(s => {

        s.type = "method";

        s.ast.type = MinTreeNodeType.Method;

        //s.root_name = root_name;

        return s;
    }));
}

export async function processWickJS_AST(ast: MinTreeNode, component: Component, presets: Presets, root_name = ""): Promise<MinTreeNode> {

    const
        function_block = { root_name, type: "root", ast: null, input_binding_variables: [], output_binding_variables: [] };

    component.function_blocks.push(function_block);

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(function_block)
    ) {

        let js_node = node;

        for (const handler of JS_handlers[Math.max((node.type >>> 24), 0)]) {

            const pending = handler.prepareJSNode(node, meta.parent, meta.skip, () => { }, component, presets, function_block);

            let result = null;

            if (pending instanceof Promise)
                result = await pending;
            else
                result = pending;

            if (result != node) {
                if (result === null || result) {

                    js_node = result;

                    meta.replace(result);

                    if (result === null)
                        continue main_loop;

                } else
                    continue;
            }

            break;
        }
    }

    return function_block.ast;
}