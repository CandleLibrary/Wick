import { MinTreeNode, MinTreeNodeType, MinTreeNodeClass } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";

import { Component, FunctionFrame } from "../types/types.js";
import Presets from "../presets.js";
import { JS_handlers } from "./component_default_js_handlers.js";
import { createFrame } from "./component_common.js";



export async function processFunctionDeclaration(node: MinTreeNode, component: Component, presets: Presets, root_name = "") {

    //@ts-ignore
    //const temp_component = <Component>{ CSS: [], HTML: null, frames: [], location: "", binding_variables: component.binding_variables, names: [], addBinding: component.addBinding, };

    //createFrame(null, false, temp_component);

    await processWickJS_AST(node, component, presets, root_name, component.root_frame);
    /*
    component.frames.push(...temp_component.frames.map(s => {

        s.type = "method";

        s.ast.type = MinTreeNodeType.Method;

        return s;
    }));*/
}

export async function processWickJS_AST(ast: MinTreeNode, component: Component, presets: Presets, root_name = "", frame = null, TEMPORARY = false): Promise<FunctionFrame> {

    const function_frame = frame ?
        createFrame(frame, TEMPORARY, component) :
        component.root_frame;

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .skipRoot()
        .makeReplaceable()
        .makeSkippable()
        .extract(function_frame)
    ) {
        if (node.type & MinTreeNodeClass.CLOSURE) {
            await processWickJS_AST(node, component, presets, root_name, frame, true);
            meta.skip();
        }

        for (const handler of JS_handlers[Math.max((node.type >>> 23), 0)]) {

            const pending = handler.prepareJSNode(node, meta.parent, meta.skip, component, presets, function_frame);

            let result = null;

            if (pending instanceof Promise)
                result = await pending;
            else
                result = pending;

            if (result != node) {
                if (result === null || result) {

                    meta.replace(result);

                    if (result === null)
                        continue main_loop;

                } else
                    continue;
            }

            break;
        }
    }

    return function_frame;
}