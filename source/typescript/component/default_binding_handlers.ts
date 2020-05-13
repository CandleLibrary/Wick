import { MinTreeNodeType, exp, stmt, renderCompressed, ext } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";
import { BindingObject, BindingHandler, BindingType } from "../types/types.js";
import { processWickJS_AST, processFunctionDeclaration, VARIABLE_REFERENCE_TYPE } from "./js.js";
import { DATA_FLOW_FLAG } from "../runtime/component_class.js";

export const binding_handlers: BindingHandler[] = [];

export function loadBindingHandler(handler: BindingHandler) {
    if (/*handler_passes_prerequisit_checks*/ true) {
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
            component_variables = component.variables,
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

            // TODO validate ON events. 
            // TODO create custom events.
            const expression = exp(`c.e${element_index}.setAttribute("${attribute_name}")`);

            expression.nodes[1].nodes.push(primary_ast);

            binding.write_ast = expression;
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

        const { local, extern } = pending_binding, index = host_node.child_id, comp = host_node.component;

        const cv = comp.variables.get(extern);

        if (cv && cv.usage_flags & DATA_FLOW_FLAG.EXPORT_TO_PARENT && component.variables.get(local)) {

            // const variable = comp.variables.get(extern);

            binding.read_ast = stmt(`c.ch[${index}].spm(${cv.class_name}, ${component.variables.get(local).class_name}, ${index})`);

            binding.component_variables.add(<string>local);
            return binding;
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

        const binding = createBindingObject(BindingType.WRITE);

        const { local, extern } = pending_binding, index = host_node.child_id, comp = host_node.component;

        const cv = comp.variables.get(extern);

        if (cv && cv.usage_flags & DATA_FLOW_FLAG.FROM_PARENT) {


            // const variable = comp.variables.get(extern);


            binding.write_ast = stmt(`c.ch[${index}].ufp(${cv.class_name}, v, f);`);


            binding.component_variables.add(<string>local);
        }

        return binding;
    }
});



// This binding handler deals with event attributes that
// begin on{event name}.
loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return (attribute_name.slice(0, 2) == "on");
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READONLY),
            component_names = component.variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            for (const { node, meta } of traverse(primary_ast, "nodes")) {
                if (node.type == MinTreeNodeType.IdentifierReference) {

                    if (!component_names.has(<string>node.value))
                        continue;

                    //Pop any binding names into the binding information container. 
                    binding.component_variables.add(<string>node.value);
                }
            }

            // TODO validate ON events. 
            // TODO create custom events.
            let expression = null;

            if (primary_ast) {

                if (primary_ast.type == MinTreeNodeType.IdentifierReference)
                    expression = stmt(`c.e${element_index}.addEventListener("${attribute_name.slice(2)}",c.${primary_ast.value}.bind(c));`);
                else {

                    const name = "testName";

                    //Create new function method for the component
                    const fn = stmt(`function ${name}(){;};`);

                    fn.nodes[2].nodes = [primary_ast];

                    processFunctionDeclaration(fn, component, presets);

                    expression = stmt(`c.e${element_index}.addEventListener("${attribute_name.slice(2)}",c.${name}.bind(c));`);
                }
            }

            binding.read_ast = expression;

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
            component_names = component.variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {


            for (const { node, meta } of traverse(primary_ast, "nodes").makeMutable()) {

                if (node.type == MinTreeNodeType.IdentifierReference) {

                    if (!component_names.has(<string>node.value))
                        continue;

                    //Pop any binding names into the binding information container. 
                    binding.component_variables.add(<string>node.value);
                }
            }

            const expression = exp("a=b");

            expression.nodes[0] = exp(`c.e${element_index}.data`);

            expression.nodes[1] = primary_ast;

            binding.write_ast = expression;
        }

        //Cleanup -- Compare component_variables with locals and remove any binding that collides with a declared variable.
        //Further Cleanup -- Globals names that are already part of the global scope are removed. 
        // for (const a of container.dependent_variables.values())
        //     if (global_names.has(a))
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
            component_names = component.variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            for (const { node, meta } of traverse(primary_ast, "nodes").makeMutable()) {

                if (node.type == MinTreeNodeType.IdentifierReference) {

                    const val = component.variables.get(node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    binding.component_variables.add(<string>node.value);
                }
            }

            const expression = exp(`c.ct[${host_node.container_id}].sd(0)`);

            expression.nodes[1].nodes = [primary_ast];

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
            component_names = component.variables,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            for (const { node, meta } of traverse(primary_ast, "nodes").makeMutable()) {

                if (node.type == MinTreeNodeType.IdentifierReference) {

                    const val = component.variables.get(node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    binding.component_variables.add(<string>node.value);
                }
            }

            const expression = exp(`m1=>(1)`);

            expression.nodes[1] = primary_ast;

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