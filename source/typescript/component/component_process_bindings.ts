import { MinTreeNodeType, exp, stmt } from "@candlefw/js";

import { BindingObject, Component, BindingType, DATA_FLOW_FLAG } from "../types/types.js";
import { getGenericMethodNode } from "./component_js_ast_tools.js";
import { binding_handlers } from "./component_default_binding_handlers.js";
import { WickASTNodeType } from "../types/wick_ast_node_types.js";
import Presets from "../presets.js";
import { setVariableName } from "./component_set_component_variable.js";

function createBindingName(binding_index_pos: number) {
    return `b${binding_index_pos.toString(36)}`;
}

export function processBindings(component: Component, class_data, presets: Presets) {

    const
        { bindings: raw_bindings, } = component,

        {
            methods: class_methods,
            class_cleanup_statements: clean_stmts,
            class_initializer_statements: initialize_stmts
        } = class_data,

        registered_elements: Set<number> = new Set,

        processed_bindings: BindingObject[] = [],

        binding_inits = [];

    let
        binding_count = 0;


    for (const pending_binding of raw_bindings) {

        binding_count++;

        for (const handler of binding_handlers) {

            if (
                handler.canHandleBinding(
                    pending_binding.attribute_name,
                    WickASTNodeType[pending_binding.host_node.type]
                )
            ) {

                const
                    index = pending_binding.html_element_index,

                    binding = handler.prepareBindingObject(
                        pending_binding.attribute_name,
                        pending_binding.binding_node,
                        pending_binding.host_node,
                        index,
                        component,
                        class_data
                    );

                if (!binding) continue;

                const { read_ast, write_ast, initialize_ast, cleanup_ast, type, component_variables }
                    = binding;


                binding.pos = pending_binding.binding_node.pos;

                binding.name = createBindingName(binding_count);

                processed_bindings.push(binding);

                const { name: binding_name } = binding;

                /**
                 * register this binding's element if it has not already been done.
                 */
                if (index > -1 && !registered_elements.has(index)) {
                    initialize_stmts.push(stmt(`this.e${index}=this.elu[${index}]`));
                    registered_elements.add(index);
                }

                if (type & BindingType.WRITE && write_ast) {

                    if (component_variables.size > 1) {
                        //Create binding update method.

                        const method = getGenericMethodNode(binding_name, "", ";"),
                            [, , body] = method.nodes,
                            { nodes } = body;

                        nodes.length = 0;

                        for (const { name } of component_variables.values()) {

                            if (!component.root_frame.binding_type.has(name))
                                throw (binding.pos.errorMessage(`missing binding variable for ${name}`));

                            const { class_index } = component.root_frame.binding_type.get(name);

                            nodes.push(stmt(`if(this[${class_index}]==undefined)return 0;`));
                        }

                        body.nodes.push(write_ast);

                        class_methods.push(method);
                    }
                }


                if (type & BindingType.READ && read_ast)
                    binding_inits.push(read_ast);


                if (initialize_ast)
                    initialize_stmts.push({
                        type: MinTreeNodeType.ExpressionStatement,
                        nodes: [initialize_ast],
                        pos: initialize_ast.pos
                    });

                if (cleanup_ast)
                    clean_stmts.push(cleanup_ast);

                break;
            }

        }
    }

    initialize_stmts.push(...binding_inits);

    for (const v of component.root_frame.binding_type.values()) {

        const { internal_name, class_index, flags } = v, output = [];

        if (flags & DATA_FLOW_FLAG.WRITTEN) {

            // In here, update any binding that rely on this and only this value. If there
            // are bindings that need a set of variables to exist in order to activate,
            // create a binding update function and add a call to that method here. 
            const method = getGenericMethodNode("u" + class_index, "v,f = 0", `this[${class_index}] = v;`),

                [, args, body] = method.nodes;

            for (const binding of processed_bindings) {

                if (
                    (binding.type & BindingType.WRITE)
                    && binding.component_variables.has(internal_name)
                    && binding.write_ast
                ) {
                    const variable = binding.component_variables.get(internal_name);

                    if (binding.component_variables.size <= 1) {

                        if (variable.IS_OBJECT) {
                            const s = stmt(`if(${setVariableName(internal_name, component)});`);
                            s.nodes[1] = {
                                type: MinTreeNodeType.ExpressionStatement,
                                nodes: [binding.write_ast],
                                pos: binding.pos
                            };
                            body.nodes.push(s);
                        } else {
                            body.nodes.push({
                                type: MinTreeNodeType.ExpressionStatement,
                                nodes: [binding.write_ast],
                                pos: binding.pos
                            });
                        }
                    } else {
                        // Need to update the binding method for a multi
                        // dependency binding.
                        //body.nodes.push(stmt(`this.addFutureCall(${binding.name})`));
                        body.nodes.push(stmt(`this.${binding.name}()`));
                    }
                }
            }

            if (v.flags & DATA_FLOW_FLAG.EXPORT_TO_PARENT) {
                body.nodes.push(stmt(`/*if(!(f&${DATA_FLOW_FLAG.FROM_PARENT}))*/c.pup(${class_index}, v, f);`));
            }

            class_methods.push(method);
        }
    }

    return class_methods;
}