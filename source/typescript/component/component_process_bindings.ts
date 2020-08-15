import { JSNodeType, stmt } from "@candlefw/js";

import { Component, DATA_FLOW_FLAG, VARIABLE_REFERENCE_TYPE } from "../types/types.js";
import { BindingObject, BindingType, PendingBinding } from "../types/binding";
import { getGenericMethodNode } from "./component_js_ast_tools.js";
import { binding_handlers } from "./component_default_binding_handlers.js";
import { HTMLNodeTypeLU, HTMLNode } from "../types/wick_ast_node_types.js";
import { getComponentVariableName } from "./component_set_component_variable.js";
import Presets from "../presets.js";
import { setPos } from "./component_common.js";

function createBindingName(binding_index_pos: number) {
    return `b${binding_index_pos.toString(36)}`;
}

export function runBindingHandlers(pending_binding: PendingBinding, component: Component, class_data) {
    for (const handler of binding_handlers) {

        let binding = null;

        if (handler.canHandleBinding(
            pending_binding.binding_selector,
            HTMLNodeTypeLU[pending_binding.host_node.type]
        ))
            binding = handler.prepareBindingObject(
                pending_binding.binding_selector,
                pending_binding.binding_val,
                <HTMLNode>pending_binding.host_node,
                pending_binding.html_element_index,
                component,
                class_data
            );

        if (!binding) continue;

        return { binding, pending_binding };
    }
    return { binding: null, pending_binding };
}

export function processBindings(component: Component, class_data, presets: Presets) {

    const
        { bindings: raw_bindings, } = component,

        {
            methods,
            class_cleanup_statements: clean_stmts,
            class_initializer_statements: initialize_stmts
        } = class_data,

        registered_elements: Set<number> = new Set,

        processed_bindings: { binding: BindingObject, pending_binding: PendingBinding; }[] = raw_bindings
            .map(b => runBindingHandlers(b, component, class_data))
            .sort((a, b) => a.binding.priority > b.binding.priority ? -1 : 1),

        binding_inits = [];

    let binding_count = 0;

    for (const { binding, pending_binding } of processed_bindings) {

        //binding.pos = pending_binding.binding_val.pos;

        binding.name = createBindingName(binding_count++);

        const { html_element_index: index } = pending_binding,
            {
                read_ast, write_ast,
                initialize_ast, cleanup_ast,
                type, component_variables,
                name: binding_name
            } = binding;

        /**
         * register this binding's element if it has not already been done.
         */
        if (index > -1 && !registered_elements.has(index)) {
            initialize_stmts.unshift(stmt(`this.e${index}=this.elu[${index}]`));
            registered_elements.add(index);
        }

        if (type & BindingType.WRITE && write_ast) {

            if (component_variables.size > 1) {
                //Create binding update method.

                const method = getGenericMethodNode(binding_name, "f=0", ";"),
                    [, , body] = method.nodes,
                    { nodes } = body;

                nodes.length = 0;

                for (const { name } of component_variables.values()) {

                    if (!component.root_frame.binding_type.has(name))
                        throw (binding.pos.errorMessage(`missing binding variable for ${name}`));

                    const { class_index, type } = component.root_frame.binding_type.get(name);

                    if (type & (VARIABLE_REFERENCE_TYPE.DIRECT_ACCESS
                        | VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE)
                    ) continue;

                    nodes.push(stmt(`if(this[${class_index}]==undefined)return 0;`));
                }

                body.nodes.push(write_ast);

                methods.push(method);
            }
        }

        if (type & BindingType.READ && read_ast)
            initialize_stmts.push(read_ast);

        if (initialize_ast)
            initialize_stmts.push({
                type: JSNodeType.ExpressionStatement,
                nodes: [initialize_ast],
                pos: initialize_ast.pos
            });

        if (cleanup_ast)
            clean_stmts.push(cleanup_ast);
    }

    const write_bindings = processed_bindings.filter(b => (b.binding.type & BindingType.WRITE) && !!b.binding.write_ast);

    for (const { internal_name, class_index, flags, type } of component.root_frame.binding_type.values()) {

        if (type & VARIABLE_REFERENCE_TYPE.DIRECT_ACCESS)
            continue;

        if (flags & DATA_FLOW_FLAG.WRITTEN) {

            const method = getGenericMethodNode("u" + class_index, "v,f = 0", `this[${class_index}] = v;`),

                [, , body] = method.nodes;


            for (const { binding } of write_bindings) {

                if (binding.component_variables.has(internal_name)) {

                    const { IS_OBJECT } = binding.component_variables.get(internal_name);

                    if (binding.component_variables.size <= 1) {

                        if (IS_OBJECT) {
                            const s = stmt(`if(${getComponentVariableName(internal_name, component)});`);
                            s.nodes[1] = {
                                type: JSNodeType.ExpressionStatement,
                                nodes: [binding.write_ast],
                                pos: binding.pos
                            };
                            body.nodes.push(s);
                        } else
                            body.nodes.push({
                                type: JSNodeType.ExpressionStatement,
                                nodes: [binding.write_ast],
                                pos: binding.pos
                            });
                    } else
                        body.nodes.push(setPos(stmt(`this.${binding.name}(f)`), binding.pos));
                }
            }

            if (flags & DATA_FLOW_FLAG.EXPORT_TO_PARENT)
                body.nodes.push(stmt(`/*if(!(f&${DATA_FLOW_FLAG.FROM_PARENT}))*/c.pup(${class_index}, v, f);`));
            methods.push(method);
        }
    }
}