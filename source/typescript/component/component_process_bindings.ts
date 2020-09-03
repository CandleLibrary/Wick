import { JSNodeType, stmt, exp } from "@candlefw/js";

import { VARIABLE_REFERENCE_TYPE } from "../types/variable_reference_types";
import { DATA_FLOW_FLAG } from "../types/data_flow_flags";
import { ComponentData } from "../types/component_data";
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

export function runBindingHandlers(pending_binding: PendingBinding, component: ComponentData, class_data) {
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

export function processBindings(component: ComponentData, class_data, presets: Presets) {

    const
        { bindings: raw_bindings, root_frame: { binding_type } } = component,

        {
            methods,
            class_cleanup_statements: clean_stmts,
            class_initializer_statements: initialize_stmts,
            nluf_public_variables
        } = class_data,

        registered_elements: Set<number> = new Set,

        processed_bindings: { binding: BindingObject, pending_binding: PendingBinding; }[] = raw_bindings
            .map(b => runBindingHandlers(b, component, class_data))
            .sort((a, b) => a.binding.priority > b.binding.priority ? -1 : 1),

        initialized_internal_variables = new Set;

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


            /**
             * Add a binding update function reference to the function lookup
             * table
             */

            if (component_variables.size > 1) {
                //Create binding update method.
                binding.name = nluf_public_variables.nodes.length;
                nluf_public_variables.nodes.push(exp(`c.b${binding.name}`));

                const method = getGenericMethodNode("b" + binding.name, "c=0", ";"),
                    [, , body] = method.nodes,
                    { nodes } = body;

                nodes.length = 0;

                const check_ids = [];

                for (const { name } of component_variables.values()) {

                    if (!component.root_frame.binding_type.has(name))
                        throw (binding.pos.errorMessage(`missing binding variable for ${name}`));

                    const { class_index, type } = component.root_frame.binding_type.get(name);

                    if (type & (VARIABLE_REFERENCE_TYPE.DIRECT_ACCESS
                        | VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE)
                    ) continue;

                    check_ids.push(class_index);
                }

                if (check_ids.length > 0)

                    nodes.push(stmt(`if(!this.check(${check_ids.sort()}))return 0;`));

                body.nodes.push(write_ast);

                methods.push(method);
            }
        }

        if (type & BindingType.READ && read_ast)
            initialize_stmts.push(read_ast);

        if (initialize_ast) {

            initialize_stmts.push({
                type: JSNodeType.ExpressionStatement,
                nodes: [initialize_ast],
                pos: initialize_ast.pos
            });

            for (const [, { name }] of component_variables) {
                const type = binding_type.get(name);
                if (type && type.type == VARIABLE_REFERENCE_TYPE.INTERNAL_VARIABLE) {
                    initialized_internal_variables.add(type.class_index | 0);
                }
            }
        }

        if (cleanup_ast)
            clean_stmts.push(cleanup_ast);
    }

    if (initialized_internal_variables.size > 0) {
        initialize_stmts.push(
            setPos(
                stmt(`this.u(0,0,${Array.from(initialized_internal_variables.values()).sort().join(",")});`),
                component.root_frame.ast.pos
            )
        );
    }


    const write_bindings = processed_bindings.filter(b => (b.binding.type & BindingType.WRITE) && !!b.binding.write_ast);

    for (const { internal_name, class_index, flags, type } of component.root_frame.binding_type.values()) {

        if (type & VARIABLE_REFERENCE_TYPE.DIRECT_ACCESS)
            continue;

        if (flags & DATA_FLOW_FLAG.WRITTEN) {

            const method = getGenericMethodNode("u" + class_index, "f,c", ";"),

                [, , body] = method.nodes;

            body.nodes.length = 0;


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
                        body.nodes.push(setPos(stmt(`this.call(${binding.name}, c)`), binding.pos));
                }
            }

            if (flags & DATA_FLOW_FLAG.EXPORT_TO_PARENT)
                body.nodes.push(stmt(`/*if(!(f&${DATA_FLOW_FLAG.FROM_PARENT}))*/c.pup(${class_index}, v, f);`));

            if (body.nodes.length > 0)
                methods.push(method);
        }
    }
}