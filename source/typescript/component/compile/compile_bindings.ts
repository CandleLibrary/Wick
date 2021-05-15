import { exp, JSNodeType, stmt } from "@candlefw/js";
import { setPos } from "../../common/common.js";
import { getGenericMethodNode } from "../../common/js.js";
import { getComponentVariableName } from "../../common/binding.js";
import Presets from "../../common/presets.js";
import { BindingObject, BindingType, DATA_FLOW_FLAG, IntermediateBinding, BINDING_VARIABLE_TYPE } from "../../types/binding";
import { ClassInformation } from "../../types/class_information";
import { ComponentData } from "../../types/component";
import { HTMLNode, HTMLNodeTypeLU } from "../../types/wick_ast.js";
import { binding_handlers } from "./bindings.js";


function createBindingName(binding_index_pos: number) {
    return `b${binding_index_pos.toString(36)}`;
}

export function runBindingHandlers(pending_binding: IntermediateBinding, component: ComponentData, presets: Presets, class_info: ClassInformation) {
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
                presets,
                class_info
            );

        if (!binding) continue;

        return { binding, pending_binding };
    }
    return { binding: null, pending_binding };
}

export function processBindings(component: ComponentData, class_info: ClassInformation, presets: Presets) {

    const
        { bindings: raw_bindings, root_frame: { binding_variables: binding_type } } = component,

        {
            methods,
            class_cleanup_statements: clean_stmts,
            class_initializer_statements: initialize_stmts,
            nluf_public_variables
        } = class_info,

        registered_elements: Set<number> = new Set,

        processed_bindings: { binding: BindingObject, pending_binding: IntermediateBinding; }[] = raw_bindings
            .map(b => runBindingHandlers(b, component, presets, class_info))
            .sort((a, b) => a.binding.priority > b.binding.priority ? -1 : 1),
        /**
         * All component variables that have been assigned a value
         */
        initialized_internal_variables: Set<number> = new Set;



    let binding_count = 0;

    for (const { binding, pending_binding } of processed_bindings) {

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

                binding.name = nluf_public_variables.nodes.length + "";
                //@ts-ignore
                nluf_public_variables.nodes.push(<any>exp(`c.b${binding.name}`));

                const method = getGenericMethodNode("b" + binding.name, "c=0", ";"),
                    [, , body] = method.nodes,
                    { nodes } = body;

                nodes.length = 0;

                const check_ids = [];

                for (const { name } of component_variables.values()) {

                    if (!component.root_frame.binding_variables.has(name))
                        throw (binding.pos.errorMessage(`missing binding variable for ${name}`));

                    const { class_index, type } = component.root_frame.binding_variables.get(name);

                    if (type & (BINDING_VARIABLE_TYPE.DIRECT_ACCESS
                        | BINDING_VARIABLE_TYPE.METHOD_VARIABLE)
                    ) continue;

                    check_ids.push(class_index);
                }

                if (check_ids.length > 0)
                    //@ts-ignore
                    nodes.push(<any>stmt(`if(!this.check(${check_ids.sort()}))return 0;`));

                body.nodes.push(write_ast);

                methods.push(<any>method);
            }
        }

        if (type & BindingType.READ && read_ast)
            initialize_stmts.push(read_ast);

        if (initialize_ast) {

            initialize_stmts.push({
                type: JSNodeType.ExpressionStatement,
                nodes: [<any>initialize_ast],
                pos: initialize_ast.pos
            });

            for (const [, { name }] of component_variables) {
                const type = binding_type.get(name);
                if (type && type.type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE) {
                    initialized_internal_variables.add(type.class_index | 0);
                }
            }
        }

        if (cleanup_ast)
            clean_stmts.push(cleanup_ast);
    }

    const write_bindings = processed_bindings.filter(b => (b.binding.type & BindingType.WRITE) && !!b.binding.write_ast);


    for (const { internal_name, class_index, flags, type } of component.root_frame.binding_variables.values()) {

        if (type & BINDING_VARIABLE_TYPE.DIRECT_ACCESS)
            continue;

        if (flags & DATA_FLOW_FLAG.WRITTEN) {

            const method = getGenericMethodNode("u" + class_index, "f,c", ";"),

                [, , body] = method.nodes;

            body.nodes.length = 0;


            for (const { binding } of write_bindings) {

                if (binding.component_variables.has(internal_name)) {

                    const { IS_OBJECT } = binding.component_variables.get(internal_name);

                    // TODO: Sort bindings and their input outputs to make sure dependencies are met. 

                    if (binding.component_variables.size <= 1) {

                        if (IS_OBJECT) {
                            const s = stmt(`if(${getComponentVariableName(internal_name, component)});`);
                            s.nodes[1] = {
                                type: <any>JSNodeType.ExpressionStatement,
                                nodes: [binding.write_ast],
                                pos: <any>binding.pos
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
                methods.push(<any>method);
        }
    }
}