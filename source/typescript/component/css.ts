import { MinTreeNode, MinTreeNodeType, stmt, ext } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";
import { WickASTNodeType, WickASTNodeClass } from "../types/wick_ast_node_types.js";
import { processWickHTML_AST } from "./html.js";
import { getSetOfEnvironmentGlobalNames } from "./get_global_names.js";
import { Component } from "../types/types.js";
import makeComponent from "./component.js";
import Presets from "./presets.js";
import { DATA_FLOW_FLAG } from "../runtime/component_class.js";
import { M, e } from "@candlefw/wind/build/types/ascii_code_points";
import { JS_handlers } from "./default_js_handlers.js";



/**
 * 
 * @param node 
 * @param parent 
 * @param component 
 * @param usage_flags 
 */

export function setComponentVariable(name: string, external_name: string, component: Component, usage_flags: number) {

    //binding_variables.push(binding_variable);
    if (!component.variables.has(name)) {
        let index = component.variables.size;
        component.variables.set(name, {
            nlui: -1,
            usage_flags,
            original_name: name,
            //external_name,
            class_name: index,
            ACCESSED: 1,
            ASSIGNED: true,
        });
    }
    else {
        component.variables.get(name).usage_flags |= usage_flags;
    }
}

export function processFunctionDeclaration(node: MinTreeNode, component: Component, presets: Presets) {

    //@ts-ignore
    const temp_component = <Component>{ scripts: [], binding_variables: [], locals: new Set };

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