import { MinTreeNode, MinTreeNodeType } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";
import { Component } from "../types/types.js";
import Presets from "./presets.js";
import { JS_handlers } from "./default_js_handlers.js";

export const enum VARIABLE_REFERENCE_TYPE {
    INTERNAL_VARIABLE = 1,
    MODEL_VARIABLE = 2,
    API_VARIABLE = 4,

    PARENT_VARIABLE = 8
}

export function processFunctionDeclaration(node: MinTreeNode, component: Component, presets: Presets) {

    //@ts-ignore
    const temp_component = <Component>{ scripts: [], binding_variables: [], locals: new Set, variables: component.variables };

    processWickJS_AST(node, temp_component, presets);

    component.scripts.push(...temp_component.scripts.map(s => {

        s.type = "method";

        s.ast.type = MinTreeNodeType.Method;

        return s;
    }));
}

export async function processWickJS_AST(ast: MinTreeNode, component: Component, presets: Presets): Promise<MinTreeNode> {

    const
        script = { type: "root", ast: null, binding_variables: [], locals: <Set<string>>new Set() };

    component.scripts.push(script);

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(script)
    ) {

        let html_node = node;

        for (const handler of JS_handlers[Math.max((node.type >>> 24), 0)]) {

            const pending = handler.prepareJSNode(node, meta.parent, meta.skip, () => { }, component, presets);

            let result = null;

            if (pending instanceof Promise)
                result = await pending;
            else
                result = pending;

            if (result != node) {
                if (result == null || result) {

                    html_node = result;

                    meta.replace(result);

                    if (result == null)
                        continue main_loop;

                }

                continue;
            }

            break;
        }
    }

    return script.ast;
}