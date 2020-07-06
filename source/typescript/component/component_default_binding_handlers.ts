import { MinTreeNodeType, exp, stmt, MinTreeNode } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";

import { BindingObject, BindingHandler, BindingType, DATA_FLOW_FLAG, VARIABLE_REFERENCE_TYPE } from "../types/types.js";
import { setVariableName } from "./component_set_component_variable.js";
import { matchAll, SelectionHelpers } from "@candlefw/css";
import { DOMLiteral } from "../wick.js";

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
        component_variables: new Map,
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
            component_names = component.root_frame.binding_type,
            { primary_ast } = pending_binding;

        if (primary_ast) {

            for (const { node, meta: { parent } } of traverse(primary_ast, "nodes")) {

                if (node.type == MinTreeNodeType.IdentifierReference) {
                    if (!component_names.has(<string>node.value))
                        continue;
                    //Pop any binding names into the binding information container. 

                    setBindingVariable(<string>node.value, parent.type == MinTreeNodeType.MemberExpression, binding);
                }
            }

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == MinTreeNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));

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

            setBindingVariable(<string>pending_binding.value, false, binding);

            binding.write_ast = primary_ast;
        }

        return binding;
    }
});

loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "import_from_child";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READONLY),
            { local, extern } = pending_binding, index = host_node.child_id, child_comp = host_node.component;

        if (child_comp) {

            const root = child_comp.root_frame;

            const cv = root.binding_type.get(extern);

            if (cv && cv.flags == DATA_FLOW_FLAG.EXPORT_TO_PARENT && component.root_frame.binding_type.get(local)) {

                binding.read_ast = stmt(`c.ch[${index}].spm(${cv.class_index}, ${component.root_frame.binding_type.get(local).class_index}, ${index})`);

                setBindingVariable(<string>local, false, binding);

                return binding;
            }

        } return null;

    }
});

loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "export_to_child";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.WRITE),
            { local, extern } = pending_binding,
            index = host_node.child_id,
            comp = host_node.component;

        if (comp) {

            const cv = comp.root_frame.binding_type.get(extern);

            if (cv && cv.flags & DATA_FLOW_FLAG.FROM_PARENT) {

                binding.write_ast = stmt(`c.ch[${index}].ufp(${cv.class_index}, v, f);`);

                setBindingVariable(<string>local, false, binding);
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
            component_names = component.root_frame.binding_type,
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

                for (const { node, meta: { replace, parent } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver)) {

                    if (node.type == MinTreeNodeType.IdentifierReference) {
                        component_names;

                        const val = node.value;

                        if (node.type == MinTreeNodeType.IdentifierReference)
                            replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));

                        if (!component_names.has(<string>val))
                            continue;


                        //Pop any binding names into the binding information container. 
                        setBindingVariable(<string>val, parent.type == MinTreeNodeType.MemberExpression, binding);
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

function setBindingVariable(name: string, IS_OBJECT: boolean = false, binding: BindingObject) {
    if (binding.component_variables.has(name)) {
        const variable = binding.component_variables.get(name);
        variable.IS_OBJECT = !!(+variable.IS_OBJECT | +IS_OBJECT);
    } else {
        binding.component_variables.set(name, {
            name,
            IS_OBJECT
        });
    }
}

/**********************
 * 
 * Inline text bindings 
 * 
 */
loadBindingHandler({
    priority: -2,

    canHandleBinding(attribute_name, node_type) {
        return !attribute_name;
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component) {



        const binding = createBindingObject(BindingType.WRITEONLY),
            component_names = component.root_frame.binding_type,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            const receiver = { ast: null };

            for (const { node, meta: { replace, parent } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver)) {


                if (node.type == MinTreeNodeType.IdentifierReference) {
                    component_names;

                    const val = node.value;

                    if (node.type == MinTreeNodeType.IdentifierReference)
                        replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));

                    if (!component_names.has(<string>val))
                        continue;


                    //Pop any binding names into the binding information container. 
                    setBindingVariable(<string>val, parent.type == MinTreeNodeType.MemberExpression, binding);
                }
            }

            const expression = exp("a=b");

            expression.nodes[0] = exp(`c.e${element_index}.data`);

            expression.nodes[1] = receiver.ast;

            binding.write_ast = expression;
        }

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

        const binding = createBindingObject(BindingType.WRITEONLY),
            component_names = component.root_frame.binding_type,
            { primary_ast } = pending_binding;

        if (primary_ast) {

            const receiver = { ast: null };


            for (const { node, meta } of traverse(primary_ast, "nodes")) {

                if (node.type == MinTreeNodeType.IdentifierReference) {

                    const val = component_names.get(<string>node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    setBindingVariable(<string>node.value, meta.parent.type == MinTreeNodeType.MemberExpression, binding);
                }
            }

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == MinTreeNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));

            const expression = exp(`c.ct[${host_node.container_id}].sd(0)`);

            expression.nodes[1].nodes = [receiver.ast];

            binding.write_ast = expression;
        }

        return binding;
    }
});


// container_data
loadBindingHandler({
    priority: 100,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "filter";
    },

    prepareBindingObject(attribute_name, pending_binding, host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READONLY),
            component_names = component.root_frame.binding_type,
            { primary_ast, secondary_ast } = pending_binding;

        if (primary_ast) {

            for (const { node, meta: { parent } } of traverse(primary_ast, "nodes")) {

                if (node.type == MinTreeNodeType.IdentifierReference) {

                    const val = component_names.get(<string>node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    setBindingVariable(<string>node.value, parent.type == MinTreeNodeType.MemberExpression, binding);
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

        return binding;
    }
});

loadBindingHandler({
    priority: 100,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "inlined_element_id";
    },

    prepareBindingObject(attribute_name, pending_binding_node, host_node, element_index, component, presets) {


        const nodes = matchAll<DOMLiteral>(pending_binding_node.value.slice(1), component.HTML, helper);

        if (nodes.length > 0) {

            const index = host_node.nodes.indexOf(pending_binding_node);
            (<MinTreeNode><unknown>host_node).nodes[index] = (nodes.length == 1)
                ? exp(`this.elu[${nodes[0].lookup_index}];`)
                : exp(`[${nodes.map(e => `this.elu[${e.lookup_index}]`).join(",")}]`);
        }

        return null;
    }
});


const helper: SelectionHelpers<DOMLiteral> = {
    WQmatch: (ele, wq_selector) => wq_selector.val,
    getChildren: (ele) => (ele.children && ele.children.slice().map(e => Object.assign({}, e)).map(e => ((e.parent = ele), e))) || [],
    getParent: (ele) => e.parent,
    hasAttribute: (ele, name, value, sym, modifier) =>
        ele.attributes && ele.attributes
            .filter(([key]) => key == name)
            .filter(([, v]) => !value || v == value)
            .length > 0,
    hasClass: (ele, class_) =>
        ele.attributes && ele.attributes
            .filter(([key]) => key == "class")
            .filter(([, v]) => v == class_)
            .length > 0,
    hasID: (ele, id) =>
        ele.attributes && ele.attributes
            .filter(([key]) => key == "id")
            .filter(([, v]) => v == id)
            .length > 0,
    hasPseudoClass: (ele, id) => false,
    hasPseudoElement: (ele, id) => false,
    hasType: (ele, type) => ele.tag_name &&
        ele.tag_name.toUpperCase() == type.toUpperCase()
};