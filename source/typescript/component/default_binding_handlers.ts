import { MinTreeNodeType, exp, stmt, renderCompressed, ext } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";
import { BindingObject, BindingHandler, BindingType } from "../types/types.js";
import { processFunctionDeclaration } from "./js.js";
import { DATA_FLOW_FLAG } from "../runtime/component_class.js";
import { VARIABLE_REFERENCE_TYPE, setVariableName } from "./set_component_variable.js";

export const binding_handlers: BindingHandler[] = [];

export function loadBindingHandler(handler: BindingHandler) {
    if (/*handler_meets_prerequisite*/ true) {
        binding_handlers.push(handler);
        binding_handlers.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
}

export function createBindingObject(type: BindingType): BindingObject {
    return {
        DEBUG: false,
        annotate: "",
        component_variables: new Set,
        type,
        cleanup_ast: null,
        read_ast: null,
        write_ast: null
    };
}

loadBindingHandler({
    priority: -Infinity,

    canHandleBinding(attribute_name, node_type) {
        return true;
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component) {

        const binding = createBindingObject(BindingType.WRITEONLY),
            component_variables = component.binding_variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {
            for (const { node, meta } of traverse(primary_ast, "nodes")) {

                if (node.type == MinTreeNodeType.IdentifierReference) {
                    if (!component_variables.has(<string>node.value))
                        continue;
                    //Pop any binding names into the binding information container. 
                    binding.component_variables.add(<string>node.value);
                }
            }

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == MinTreeNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));


            // TODO validate ON events. 
            // TODO create custom events.
            const expression = exp(`c.e${element_index}.setAttribute("${attribute_name}")`);

            expression.nodes[1].nodes.push(receiver.ast);

            binding.write_ast = expression;
        }

        return binding;
    }
});

loadBindingHandler({
    priority: -2,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "method_call";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component) {

        const binding = createBindingObject(BindingType.WRITEONLY),
            { primary_ast } = pending_binding;

        if (primary_ast) {
            binding.component_variables.add(pending_binding.value);

            binding.write_ast = primary_ast;
        }

        return binding;
    }
});


// This binding handler deals with event attributes that
// begin on{event name}.
loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "import_from_child";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READONLY);

        const { local, extern } = pending_binding, index = host_node.child_id, child_comp = host_node.component;

        if (child_comp) {

            const cv = child_comp.variables.get(extern);

            if (cv && cv.usage_flags & DATA_FLOW_FLAG.EXPORT_TO_PARENT && component.binding_variables.get(local)) {

                binding.read_ast = stmt(`c.ch[${index}].spm(${cv.class_name}, ${component.binding_variables.get(local).class_name}, ${index})`);

                binding.component_variables.add(<string>local);

                return binding;
            }

        } return null;

    }
});

// This binding handler deals with event attributes that
// begin on{event name}.
loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "export_to_child";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        const
            binding = createBindingObject(BindingType.WRITE),
            { local, extern } = pending_binding,
            index = host_node.child_id,
            comp = host_node.component;

        if (comp) {

            const cv = comp.variables.get(extern);

            if (cv && cv.usage_flags & DATA_FLOW_FLAG.FROM_PARENT) {

                binding.write_ast = stmt(`c.ch[${index}].ufp(${cv.class_name}, v, f);`);

                binding.component_variables.add(<string>local);
            }

            return binding;
        }
        return null;
    }
});


var on_count = 0;

/***********************************************
 * 
 * 
 *  'on'* event handler bindings.
 * 
 */
loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return (attribute_name.slice(0, 2) == "on");
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {


        const binding = createBindingObject(BindingType.READONLY),
            //component_names = component.binding_variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == MinTreeNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));


            const { ast } = receiver;

            // TODO validate ON events. 
            // TODO create custom events.
            let expression = null;


            if (ast.type == MinTreeNodeType.IdentifierReference)
                expression = stmt(`c.e${element_index}.addEventListener("${attribute_name.slice(2)}",c.${ast.value}.bind(c));`);
            else {

                debugger;
                const name = "on" + on_count++,

                    //Create new function method for the component
                    fn = stmt(`function ${name}(){;};`);

                fn.nodes[2].nodes = [ast];

                //                await processFunctionDeclaration(fn, component, presets);

                expression = stmt(`c.e${element_index}.addEventListener("${attribute_name.slice(2)}",c.${name}.bind(c));`);
            }


            binding.read_ast = expression;

            binding.cleanup_ast = null;
        }


        return binding;
    }
});

loadBindingHandler({
    priority: 0,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "input_value";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READWRITE),
            component_names = component.binding_variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            // TODO validate ON events. 
            // TODO create custom events.
            let expression = null;

            if (primary_ast) {
                let v = null;
                if (primary_ast.type == MinTreeNodeType.IdentifierReference) {
                    v = primary_ast.value;
                }

                const receiver = { ast: null };

                for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver)) {

                    if (node.type == MinTreeNodeType.IdentifierReference) {
                        component_names;

                        const val = node.value;

                        if (node.type == MinTreeNodeType.IdentifierReference)
                            replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));

                        if (!component_names.has(<string>val))
                            continue;


                        //Pop any binding names into the binding information container. 
                        binding.component_variables.add(<string>val);
                    }
                }

                {
                    if (primary_ast.type == MinTreeNodeType.IdentifierReference) {
                        expression = stmt(`c.e${element_index}.addEventListener("change",c.$${v}.bind(c));`);
                        binding.read_ast = expression;
                    }
                    else { }
                }

                {

                    const expression = exp(`c.e${element_index}.value = 1`);

                    expression.nodes[1] = receiver.ast;

                    binding.write_ast = expression;
                }
            }

            binding.cleanup_ast = null;
        }


        return binding;
    }
});

loadBindingHandler({
    priority: -2,

    canHandleBinding(attribute_name, node_type) {
        return !attribute_name;
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component) {

        const binding = createBindingObject(BindingType.WRITEONLY),
            component_names = component.binding_variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver)) {

                if (node.type == MinTreeNodeType.IdentifierReference) {
                    component_names;

                    const val = node.value;

                    if (node.type == MinTreeNodeType.IdentifierReference)
                        replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));

                    if (!component_names.has(<string>val))
                        continue;


                    //Pop any binding names into the binding information container. 
                    binding.component_variables.add(<string>val);
                }
            }

            const expression = exp("a=b");

            expression.nodes[0] = exp(`c.e${element_index}.data`);

            expression.nodes[1] = receiver.ast;

            binding.write_ast = expression;
        }

        //Cleanup -- Compare component_variables with locals and remove any binding that collides with a declared variable.
        //Further Cleanup -- Globals names that are already part of the global scope are removed. 
        // for (const a of container.dependent_variables.values())
        //     if (global_names.has(a))${attribute_name.slice(2)}
        //         container.dependent_variables.delete(a);

        return binding;
    }
});

// container_data
loadBindingHandler({

    priority: 100,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "data";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        // if (host_node.tag == "container") {

        const binding = createBindingObject(BindingType.WRITEONLY),
            component_names = component.binding_variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            const receiver = { ast: null };


            for (const { node, meta } of traverse(primary_ast, "nodes")) {

                if (node.type == MinTreeNodeType.IdentifierReference) {

                    const val = component.binding_variables.get(<string>node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    binding.component_variables.add(<string>node.value);
                }
            }

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == MinTreeNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));

            const expression = exp(`c.ct[${host_node.container_id}].sd(0)`);

            expression.nodes[1].nodes = [receiver.ast];

            binding.write_ast = expression;
        }

        //Cleanup -- Compare component_variables with locals and remove any binding that collides with a declared variable.
        //Further Cleanup -- Globals names that are already part of the global scope are removed. 
        // for (const a of container.dependent_variables.values())
        //     if (global_names.has(a))
        //         container.dependent_variables.delete(a);

        return binding;
        // } else return;
    }
});


// container_data
loadBindingHandler({
    priority: 100,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "filter";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        // if (host_node.tag == "container") {

        const binding = createBindingObject(BindingType.READONLY),
            component_names = component.binding_variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            for (const { node } of traverse(primary_ast, "nodes")) {

                if (node.type == MinTreeNodeType.IdentifierReference) {

                    const val = component.binding_variables.get(<string>node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    binding.component_variables.add(<string>node.value);
                }
            }

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == MinTreeNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));

            const expression = exp(`m1=>(1)`);

            expression.nodes[1] = receiver.ast;

            const stmt_ = stmt(`c.ct[${host_node.container_id}].filter = a`);

            stmt_.nodes[0].nodes[1] = expression;

            binding.read_ast = stmt_;
        }

        //Cleanup -- Compare component_variables with locals and remove any binding that collides with a declared variable.
        //Further Cleanup -- Globals names that are already part of the global scope are removed. 
        // for (const a of container.dependent_variables.values())
        //     if (global_names.has(a))
        //         container.dependent_variables.delete(a);

        return binding;
        // } else return;
    }
});