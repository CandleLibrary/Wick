import { JSNodeType, exp, stmt, JSNode } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";
import { matchAll } from "@candlefw/css";

import { DATA_FLOW_FLAG, VARIABLE_REFERENCE_TYPE, FunctionFrame, Component } from "../types/types.js";
import { BindingObject, BindingHandler, BindingType } from "../types/binding";
import { getComponentVariableName, getComponentVariable } from "./component_set_component_variable.js";
import { DOMLiteral } from "../wick.js";
import { processFunctionDeclarationSync } from "./component_js.js";
import { css_selector_helpers } from "./component_css_selector_helpers.js";
import { setPos } from "./component_common.js";

export const binding_handlers: BindingHandler[] = [];


function setFrameAsBindingActive(frame: FunctionFrame, class_information) {
    if (!frame.index)
        frame.index = class_information.nlu_index++;
}

export function loadBindingHandler(handler: BindingHandler) {
    if (/*handler_meets_prerequisite*/ true) {
        binding_handlers.push(handler);
        binding_handlers.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
}

export function createBindingObject(type: BindingType, priority: number = 0): BindingObject {
    return {
        DEBUG: false,
        annotate: "",
        component_variables: new Map,
        type,
        cleanup_ast: null,
        read_ast: null,
        write_ast: null,
        priority
    };
}

function addNewMethodFrame(function_node: JSNode, component: Component, presets) {
    processFunctionDeclarationSync(function_node, component, presets);
}

function getFrameFromName(name: string, component: Component) {
    return component.frames.filter(({ name: n }) => n == name)[0] || null;
}

function setIdentifierReferenceVariables(root_node: JSNode, component: Component, binding: BindingObject): JSNode {

    const receiver = { ast: null }, component_names = component.root_frame.binding_type;

    for (const { node, meta: { replace, parent } } of traverse(root_node, "nodes")
        .makeReplaceable()
        .extract(receiver)) {

        if (node.type == JSNodeType.IdentifierReference) {

            const val = node.value;

            if (!component_names.has(<string>val))
                continue;

            replace(Object.assign({}, node, { value: getComponentVariableName(node.value, component) }));

            //Pop any binding names into the binding information container. 
            setBindingVariable(<string>val, parent && parent.type == JSNodeType.MemberExpression, binding);
        }
    }

    return receiver.ast;
}


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

/*************************************************************************************
* ██████   █████  ████████  █████      ███████ ██       ██████  ██     ██ 
* ██   ██ ██   ██    ██    ██   ██     ██      ██      ██    ██ ██     ██ 
* ██   ██ ███████    ██    ███████     █████   ██      ██    ██ ██  █  ██ 
* ██   ██ ██   ██    ██    ██   ██     ██      ██      ██    ██ ██ ███ ██ 
* ██████  ██   ██    ██    ██   ██     ██      ███████  ██████   ███ ███  
*/

loadBindingHandler({
    priority: -Infinity,

    canHandleBinding(attribute_name, node_type) {
        return true;
    },

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component) {

        const binding = createBindingObject(BindingType.WRITEONLY),
            component_names = component.root_frame.binding_type,
            { primary_ast } = binding_node_ast;


        if (primary_ast) {

            for (const { node, meta: { parent } } of traverse(primary_ast, "nodes")) {

                if (node.type == JSNodeType.IdentifierReference) {
                    if (!component_names.has(<string>node.value))
                        continue;
                    //Pop any binding names into the binding information container. 

                    setBindingVariable(<string>node.value, parent && parent.type == JSNodeType.MemberExpression, binding);
                }
            }

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver)) {

                if (node.type == JSNodeType.IdentifierReference) {
                    replace(Object.assign({}, node, { value: getComponentVariableName(node.value, component) }));
                }
            }

            const expression = exp(`this.e${element_index}.setAttribute("${attribute_name}")`);

            setPos(expression, primary_ast.pos);

            expression.nodes[1].nodes.push(receiver.ast);

            binding.write_ast = expression;
        }

        return binding;
    }
});

loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "import_from_child";
    },

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READONLY),
            { local, extern } = binding_node_ast,
            index = host_node.child_id, child_comp = host_node.component;

        if (child_comp) {

            const root = child_comp.root_frame;

            const cv = root.binding_type.get(extern);

            if (cv && cv.flags == DATA_FLOW_FLAG.EXPORT_TO_PARENT && component.root_frame.binding_type.get(local)) {

                binding.read_ast = stmt(`this.ch[${index}].spm(${cv.class_index}, ${component.root_frame.binding_type.get(local).class_index}, ${index})`);

                setPos(binding.read_ast.pos, host_node.pos);

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

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.WRITE),
            { local, extern } = binding_node_ast,
            index = host_node.child_id,
            comp = host_node.component;

        if (comp) {

            const cv = comp.root_frame.binding_type.get(extern);

            if (cv && cv.flags & DATA_FLOW_FLAG.FROM_PARENT) {

                binding.write_ast = stmt(`this.ch[${index}].ufp(${cv.class_index}, v, f);`);

                setPos(binding.write_ast, host_node.pos);

                setBindingVariable(<string>local, false, binding);
            }

            return binding;
        }
        return null;
    }
});



function setBindingAndRefVariables(root_node: JSNode, component: Component, binding: BindingObject): JSNode {

    const receiver = { ast: null }, component_names = component.root_frame.binding_type;

    for (const { node, meta: { replace, parent } } of traverse(root_node, "nodes")
        .makeReplaceable()
        .extract(receiver)) {

        if (node.type == JSNodeType.IdentifierReference || node.type == JSNodeType.IdentifierBinding) {

            const val = node.value;

            if (!component_names.has(<string>val))
                continue;

            replace(Object.assign({}, node, { value: getComponentVariableName(node.value, component) }));

            //Pop any binding names into the binding information container. 
            setBindingVariable(<string>val, parent && parent.type == JSNodeType.MemberExpression, binding);
        }
    }

    //Convert to call
    const node = receiver.ast;

    return node;
}


loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "binding_initialization";
    },

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.WRITE);

        const [ref, expr] = (<JSNode><unknown>binding_node_ast).nodes;

        const comp_var = component.root_frame.binding_type.get(<string>ref.value);

        const converted_expression = setIdentifierReferenceVariables(expr, component, binding);

        const d = exp(`this.u${comp_var.class_index}(a)`);

        setPos(d, binding_node_ast.pos);

        d.nodes[1].nodes[0] = converted_expression;

        binding.initialize_ast = d;
        //binding.initialize_ast = setBindingAndRefVariables(binding_node_ast, component, binding);

        return binding;
    }
});

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

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READONLY),
            { primary_ast, secondary_ast } = binding_node_ast;

        if (primary_ast) {

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == JSNodeType.IdentifierReference) {

                    //   replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));
                }

            const { ast } = receiver;

            let expression = null;

            if (ast.type == JSNodeType.IdentifierReference) {
                let name = ast.value;

                const frame = getFrameFromName(name, component);

                if (frame && frame.index)
                    name = "f" + frame.index;

                expression = stmt(`this.e${element_index}.addEventListener("${attribute_name.slice(2)}",this.${name}.bind(this));`);

                frame.ATTRIBUTE = true;
            }
            else {
                const name = "n" + element_index,

                    //Create new function method for the component
                    fn = stmt(`function ${name}(){;};`);

                fn.nodes[2].nodes = [ast];

                addNewMethodFrame(fn, component, presets);

                expression = stmt(`this.e${element_index}.addEventListener("${attribute_name.slice(2)}",this.${name}.bind(this));`);
            }

            setPos(expression, primary_ast.pos);


            binding.read_ast = expression;

            binding.cleanup_ast = null;
        }


        return binding;
    }
});

/***********************************************
 * 
 * 
 *  Bound function activation bindings.
 * 
 */
loadBindingHandler({
    priority: -1,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "watched_frame_method_call";
    },

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        const [, { nodes: [frame_id, ...other_id] }] = binding_node_ast.nodes;

        const frame = getFrameFromName(frame_id.value, component),
            binding = createBindingObject(BindingType.READWRITE);

        if (!frame)
            frame_id.pos.throw(`Cannot find function for reference ${frame_id.value}`);

        if (frame.ATTRIBUTE) return null;

        for (const id of other_id) setBindingVariable(<string>id.value, false, binding);
        for (const id of frame.input_names) setBindingVariable(id, false, binding);

        setFrameAsBindingActive(frame, presets);

        binding.write_ast = exp(`this.addFutureCall(${frame.index})`);

        setPos(binding.write_ast, binding_node_ast.pos);

        return binding;
    }
});

loadBindingHandler({
    priority: -2,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "method_call";
    },

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component) {

        const binding = createBindingObject(BindingType.WRITEONLY),
            { primary_ast } = binding_node_ast
            ;

        if (primary_ast) {

            setBindingVariable(<string>binding_node_ast
                .value, false, binding);

            binding.write_ast = primary_ast;
        }

        return binding;
    }
});

loadBindingHandler({
    priority: 0,

    canHandleBinding(attribute_name, node_type) {
        return attribute_name == "input_value";
    },

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READWRITE),
            { primary_ast } = binding_node_ast;

        if (primary_ast) {

            const ast = setIdentifierReferenceVariables(primary_ast, component, binding);

            //Pop any binding names into the binding information container. 

            if (primary_ast.type == JSNodeType.IdentifierReference) {
                let name = <string>primary_ast.value;
                const frame = getFrameFromName(name, component);
                if (frame) {
                    if (frame && frame.index) name = "f" + frame.index;

                    binding.initialize_ast = setPos(
                        stmt(`this.e${element_index}.addEventListener("input",this.$${name}.bind(this));`),
                        primary_ast.pos
                    );
                } else {

                    const { class_index } = getComponentVariable(name, component);

                    binding.initialize_ast = setPos(
                        stmt(`this.e${element_index}.addEventListener("input",e=>this.u${class_index}(e.target.value));`),
                        primary_ast.pos
                    );
                }
            }

            binding.write_ast = setPos(
                exp(`this.e${element_index}.value = 1`),
                primary_ast.pos
            );

            binding.write_ast.nodes[1] = ast;

            binding.cleanup_ast = null;
        }

        return binding;
    }
});
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

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component) {

        const binding = createBindingObject(BindingType.WRITEONLY),
            component_names = component.root_frame.binding_type,
            { primary_ast, secondary_ast } = binding_node_ast;

        if (primary_ast) {

            const ast = setIdentifierReferenceVariables(primary_ast, component, binding);

            const expression = exp("a=b");

            expression.nodes[0] = exp(`this.e${element_index}.data`);

            expression.nodes[1] = ast;

            setPos(expression, primary_ast.pos);

            binding.write_ast = expression;
        }

        return binding;
    }
});

/*********************************************
 *  ██████  ██████  ███    ██ ████████  █████  ██ ███    ██ ███████ ██████  
 * ██      ██    ██ ████   ██    ██    ██   ██ ██ ████   ██ ██      ██   ██ 
 * ██      ██    ██ ██ ██  ██    ██    ███████ ██ ██ ██  ██ █████   ██████  
 * ██      ██    ██ ██  ██ ██    ██    ██   ██ ██ ██  ██ ██ ██      ██   ██ 
 *  ██████  ██████  ██   ████    ██    ██   ██ ██ ██   ████ ███████ ██   ██ 
 */

// container_data
loadBindingHandler({

    priority: 100,

    canHandleBinding: (attribute_name, node_type) => attribute_name == "data",

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const binding = createBindingObject(BindingType.WRITEONLY),
            component_names = component.root_frame.binding_type,
            { primary_ast } = binding_node_ast;

        if (primary_ast) {

            const receiver = { ast: null };

            for (const { node, meta } of traverse(primary_ast, "nodes")) {

                if (node.type == JSNodeType.IdentifierReference) {

                    const val = component_names.get(<string>node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    setBindingVariable(
                        <string>node.value,
                        !!meta.parent && meta.parent.type == JSNodeType.MemberExpression,
                        binding
                    );
                }
            }

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == JSNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: getComponentVariableName(node.value, component) }));

            const expression = exp(`this.ct[${host_node.container_id}].sd(0)`);

            setPos(expression, primary_ast.pos);

            expression.nodes[1].nodes = [receiver.ast];

            binding.write_ast = expression;
        }

        return binding;
    }
});

// container_data
loadBindingHandler({
    priority: 100,

    canHandleBinding: (attribute_name, node_type) => attribute_name == "filter",

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        const binding = createBindingObject(BindingType.READONLY),
            component_names = component.root_frame.binding_type,
            { primary_ast, secondary_ast } = binding_node_ast
            ;

        if (primary_ast) {

            for (const { node, meta: { parent } } of traverse(primary_ast, "nodes")) {

                if (node.type == JSNodeType.IdentifierReference) {

                    const val = component_names.get(<string>node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    setBindingVariable(<string>node.value, parent.type == JSNodeType.MemberExpression, binding);
                }
            }

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == JSNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: getComponentVariableName(node.value, component) }));

            const expression = setPos(exp(`m1 => (1)`), primary_ast.pos);

            expression.nodes[1] = receiver.ast;

            setPos(expression, primary_ast.pos);

            const stmt_ = setPos(stmt(`this.ct[${host_node.container_id}].filter = a`), primary_ast.pos);

            stmt_.nodes[0].nodes[1] = expression;

            binding.read_ast = stmt_;
        }

        return binding;
    }
});

// Usage selectors
loadBindingHandler({

    priority: -1,

    canHandleBinding: (attribute_name, node_type) => attribute_name == "useif",

    prepareBindingObject(attribute_name, binding_node_ast
        , host_node, element_index, component, presets) {

        const
            binding = createBindingObject(BindingType.READONLY, 100),
            component_names = component.root_frame.binding_type,
            { primary_ast } = binding_node_ast;

        if (primary_ast) {

            for (const { node, meta: { parent } } of traverse(primary_ast, "nodes")) {

                if (node.type == JSNodeType.IdentifierReference) {

                    const val = component_names.get(<string>node.value);

                    if (!val || val.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)
                        continue;

                    //Pop any binding names into the binding information container. 
                    setBindingVariable(<string>node.value, parent.type == JSNodeType.MemberExpression, binding);
                }
            }

            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == JSNodeType.IdentifierReference)
                    replace(Object.assign({}, node, { value: getComponentVariableName(node.value, component) }));

            const expression = exp(`m1 => (1)`);

            expression.nodes[1] = receiver.ast;

            setPos(expression, primary_ast.pos);

            const stmt_ = stmt(`this.ct[${host_node.container_id}].addEvaluator(a)`);

            stmt_.nodes[0].nodes[1].nodes[0] = expression;

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


        const nodes = matchAll<DOMLiteral>(pending_binding_node.value.slice(1), component.HTML, css_selector_helpers);

        if (nodes.length > 0) {

            const index = host_node.nodes.indexOf(pending_binding_node);

            const expression = (nodes.length == 1)
                ? exp(`this.elu[${nodes[0].lookup_index}]; `)
                : exp(`[${nodes.map(e => `this.elu[${e.lookup_index}]`).join(",")}]`);

            setPos(expression, host_node.pos);

            (<JSNode><unknown>host_node).nodes[index] = expression;
        }

        return null;
    }
});

function getElementAtIndex(comp: Component, index: number, node: DOMLiteral = comp.HTML, counter = { i: 0 }): DOMLiteral {

    if (counter.i == index) return node;

    counter.i++;

    if (node.children) for (const child of node.children) {
        let out = null;
        if ((out = getElementAtIndex(comp, index, child, counter))) return out;
    }

    return null;
};
