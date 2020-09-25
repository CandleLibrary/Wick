import { JSNodeType, exp, stmt, JSNode, renderCompressed } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";
import { matchAll } from "@candlefw/css";

import { DATA_FLOW_FLAG } from "../types/data_flow_flags";
import { FunctionFrame } from "../types/function_frame";
import { ComponentData } from "../types/component_data";
import { BindingObject, BindingHandler, BindingType, BINDING_SELECTOR } from "../types/binding";
import { getComponentVariableName, getComponentVariable } from "./component_set_component_variable.js";
import { DOMLiteral } from "../wick.js";

import { css_selector_helpers } from "./component_css_selector_helpers.js";
import { setPos, getFirstReferenceName } from "./component_common.js";
import { Lexer } from "@candlefw/wind";
import { postProcessFunctionDeclarationSync } from "./component_js.js";
import { HTMLNode } from "../types/wick_ast_node_types";
import { ClassInformation } from "../types/class_information";

export const binding_handlers: BindingHandler[] = [];

function registerActivatedFrameMethod(frame: FunctionFrame, class_information: ClassInformation) {
    if (!frame.index) {

        const { nodes } = class_information
            .nluf_public_variables;

        frame.index = nodes.length;

        nodes.push(setPos(exp(`c.f${frame.index}`), frame.ast.pos));
    }
}

export function loadBindingHandler(handler: BindingHandler) {
    if (/*handler_meets_prerequisite*/ true) {
        binding_handlers.push(handler);
        binding_handlers.sort((a, b) => a.priority > b.priority ? -1 : 1);
    }
}

export function createBindingObject(type: BindingType, priority: number = 0, pos: Lexer): BindingObject {
    return <BindingObject>{
        DEBUG: false,
        annotate: "",
        component_variables: new Map,
        type,
        cleanup_ast: null,
        read_ast: null,
        write_ast: null,
        priority,
        pos
    };
}

function addNewMethodFrame(function_node: JSNode, component: ComponentData, presets, class_data) {
    const frame = postProcessFunctionDeclarationSync(function_node, component, presets);
    class_data.frames.push(frame);
    return frame;
}

function getFrameFromName(name: string, component: ComponentData) {
    return component.frames.filter(({ name: n }) => n == name)[0] || null;
}

function setIdentifierReferenceVariables(root_node: JSNode, component: ComponentData, binding: BindingObject): JSNode {

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

    canHandleBinding(binding_selector, node_type) {
        return true;
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component) {

        const
            binding = createBindingObject(BindingType.WRITE_ONLY, 0, binding_node_ast.pos),
            { primary_ast } = binding_node_ast;


        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, binding),
                expression = exp(`this.e${element_index}.setAttribute("${binding_selector}")`);

            setPos(expression, primary_ast.pos);

            expression.nodes[1].nodes.push(ast);

            binding.write_ast = expression;
        }

        return binding;
    }
});

loadBindingHandler({
    priority: -1,

    canHandleBinding(binding_selector, node_type) {
        return binding_selector == BINDING_SELECTOR.IMPORT_FROM_CHILD;
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component, presets) {

        const
            binding = createBindingObject(BindingType.READONLY, 0, binding_node_ast.pos),
            { local, extern } = binding_node_ast,
            index = (<HTMLNode>host_node).child_id,
            child_comp = (<HTMLNode>host_node).component;

        if (child_comp) {

            const
                root = child_comp.root_frame,
                cv = root.binding_type.get(extern);

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

    canHandleBinding(binding_selector, node_type) {
        return binding_selector == BINDING_SELECTOR.EXPORT_TO_CHILD;
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component, presets) {

        const
            binding = createBindingObject(BindingType.WRITE, 0, binding_node_ast.pos),
            { local, extern } = binding_node_ast,
            index = (<HTMLNode>host_node).child_id,
            comp = (<HTMLNode>host_node).component;

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

loadBindingHandler({
    priority: -1,

    canHandleBinding(binding_selector, node_type) {
        return binding_selector == BINDING_SELECTOR.BINDING_INITIALIZATION;
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component, presets) {

        const
            binding = createBindingObject(BindingType.WRITE, 0, binding_node_ast.pos),
            [ref, expr] = (<JSNode><unknown>binding_node_ast).nodes,
            comp_var = component.root_frame.binding_type.get(<string>ref.value),
            converted_expression = setIdentifierReferenceVariables(expr, component, binding),
            d = exp(`this[${comp_var.class_index}] = a`);

        setPos(d, binding_node_ast.pos);
        setBindingVariable(<string>ref.value, false, binding);

        d.nodes[1] = converted_expression;

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

    canHandleBinding(binding_selector, node_type) {
        return (binding_selector.slice(0, 2) == "on");
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component, presets, class_data) {

        const
            binding = createBindingObject(BindingType.READONLY, 0, binding_node_ast.pos),
            { primary_ast } = binding_node_ast;

        if (primary_ast) {

            const ast = primary_ast;
            /*
            const receiver = { ast: null };

            for (const { node, meta: { replace } } of traverse(primary_ast, "nodes").makeReplaceable().extract(receiver))
                if (node.type == JSNodeType.IdentifierReference) {
                    //   replace(Object.assign({}, node, { value: setVariableName(node.value, component) }));
                }

            const { ast } = receiver;
            //*/

            let expression = null;

            if (ast.type == JSNodeType.IdentifierReference) {
                let name = <string>ast.value;

                const frame = getFrameFromName(name, component);

                if (frame && frame.index)
                    name = "f" + frame.index;

                expression = stmt(`this.e${element_index}.addEventListener("${binding_selector.slice(2)}",this.${name}.bind(this));`);

                frame.ATTRIBUTE = true;
            } else {

                const name = "n" + element_index,

                    //Create new function method for the component
                    fn = stmt(`function ${name}(){;};`);

                //need to make sure the 

                fn.nodes[2].nodes = [{
                    type: JSNodeType.ExpressionStatement,
                    nodes: [ast],
                    pos: ast.pos
                }];

                const frame = addNewMethodFrame(fn, component, presets, class_data);

                expression = stmt(`this.e${element_index}.addEventListener("${binding_selector.slice(2)}",this.${name}.bind(this));`);
            }

            setPos(expression, primary_ast.pos);

            binding.read_ast = expression;

            binding.cleanup_ast = null;
        }


        return binding;
    }
});

/***********************************************
███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
█████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████                                              
 * 
 * 
 *  Bound function activation bindings.
 * 
 */
loadBindingHandler({
    priority: -1,

    canHandleBinding(binding_selector, node_type) {
        return binding_selector == BINDING_SELECTOR.WATCHED_FRAME_METHOD_CALL;
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component, presets, class_data) {

        const
            [, { nodes: [frame_id, ...other_id] }] = binding_node_ast.nodes,
            frame = getFrameFromName(frame_id.value, component),
            binding = createBindingObject(BindingType.READ_WRITE, 0, binding_node_ast.pos);

        if (!frame) frame_id.pos.throw(`Cannot find function for reference ${frame_id.value}`);

        if (frame.ATTRIBUTE) return null;

        for (const id of other_id) setBindingVariable(<string>id.value, false, binding);

        for (const id of frame.input_names) setBindingVariable(id, false, binding);

        registerActivatedFrameMethod(frame, class_data);

        binding.write_ast = exp(`this.call(${frame.index})`);

        setPos(binding.write_ast, binding_node_ast.pos);

        return binding;
    }
});

loadBindingHandler({

    priority: -2,

    canHandleBinding(binding_selector, node_type) {
        return binding_selector == BINDING_SELECTOR.METHOD_CALL;
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component) {

        const binding = createBindingObject(BindingType.WRITE_ONLY, 0, host_node.pos),
            { primary_ast } = binding_node_ast;

        const receiver = { ast: null }, component_names = component.root_frame.binding_type;

        for (const { node, meta: { replace, parent } } of traverse(host_node, "nodes")
            .makeReplaceable()
            .extract(receiver)) {

            if (node.type == JSNodeType.CallExpression) {
                const name = getFirstReferenceName(node);
                const frame = getFrameFromName(name, component);
                if (frame) {

                    for (const input of frame.input_names.values()) {
                        if (component_names.has(<string>input))
                            setBindingVariable(<string>input, false, binding);
                    }
                }
            }

            if (node.type == JSNodeType.IdentifierReference || node.type == JSNodeType.IdentifierBinding) {

                const val = node.value;

                if (!component_names.has(<string>val))
                    continue;

                replace(Object.assign({}, node, { value: getComponentVariableName(node.value, component) }));

                //Pop any binding names into the binding information container. 
                setBindingVariable(<string>val, parent && parent.type == JSNodeType.MemberExpression, binding);
            }
        }

        setIdentifierReferenceVariables(<JSNode>host_node, component, binding);
        binding.write_ast = setPos(primary_ast, host_node.pos);


        return binding;
    }
});

loadBindingHandler({
    priority: 0,

    canHandleBinding(binding_selector, node_type) {
        return binding_selector == BINDING_SELECTOR.IMPORT_VALUE;
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component) {

        const binding = createBindingObject(BindingType.READ_WRITE, 0, binding_node_ast.pos),
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

    canHandleBinding(binding_selector, node_type) {
        return !binding_selector;
    },

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component) {

        const binding = createBindingObject(BindingType.WRITE_ONLY, 0, binding_node_ast.pos),
            component_names = component.root_frame.binding_type,
            { primary_ast, secondary_ast } = binding_node_ast;

        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, binding),
                expression = exp("a=b");

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

    canHandleBinding: (binding_selector, node_type) => binding_selector == "data",

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const binding = createBindingObject(BindingType.WRITE_ONLY, 0, binding_node_ast.pos),
            component_names = component.root_frame.binding_type,
            { primary_ast } = binding_node_ast;

        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, binding),
                expression = exp(`this.ct[${(<HTMLNode>host_node).container_id}].sd(0)`);

            setPos(expression, primary_ast.pos);

            expression.nodes[1].nodes = [ast];

            binding.write_ast = expression;
        }

        return binding;
    }
});

// container_data
loadBindingHandler({
    priority: 100,

    canHandleBinding: (binding_selector, node_type) => binding_selector == "filter",

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component, presets) {

        if (!getElementAtIndex(component, element_index).is_container) return;

        const binding = createBindingObject(BindingType.READ_WRITE, 1000, binding_node_ast.pos),
            component_names = component.root_frame.binding_type,
            { primary_ast, secondary_ast } = binding_node_ast
            ;

        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, binding),
                expression = setPos(exp(`m1 => (1)`), primary_ast.pos);

            expression.nodes[1] = ast;

            setPos(expression, primary_ast.pos);

            const stmt_ = setPos(stmt(`this.ct[${(<HTMLNode>host_node).container_id}].filter = a`), primary_ast.pos);

            stmt_.nodes[0].nodes[1] = expression;

            binding.read_ast = stmt_;

            binding.write_ast = exp(`this.ct[${(<HTMLNode>host_node).container_id}].filterExpressionUpdate()`);
        }

        return binding;
    }
});

// Usage selectors
loadBindingHandler({

    priority: -1,

    canHandleBinding: (binding_selector, node_type) => binding_selector == BINDING_SELECTOR.CONTAINER_USE_IF,

    prepareBindingObject(binding_selector, binding_node_ast
        , host_node, element_index, component, presets) {

        const
            binding = createBindingObject(BindingType.READONLY, 100, binding_node_ast.pos),
            component_names = component.root_frame.binding_type,
            { primary_ast } = binding_node_ast;

        if (primary_ast) {

            const
                ast = setIdentifierReferenceVariables(primary_ast, component, binding),
                expression = exp(`m1 => (1)`);

            expression.nodes[1] = ast;

            setPos(expression, primary_ast.pos);

            const stmt_ = stmt(`this.ct[${(<HTMLNode>host_node).container_id}].addEvaluator(a)`);

            stmt_.nodes[0].nodes[1].nodes[0] = expression;

            binding.read_ast = stmt_;
        }

        return binding;
    }
});


loadBindingHandler({
    priority: 100,

    canHandleBinding(binding_selector, node_type) {
        return binding_selector == BINDING_SELECTOR.ELEMENT_SELECTOR_STRING;
    },

    prepareBindingObject(binding_selector, pending_binding_node, host_node, element_index, component, presets) {
        const css_selector = <string>pending_binding_node.value.slice(1); //remove "@"

        let html_nodes = null, index = host_node.nodes.indexOf(pending_binding_node);

        switch (css_selector) {

            case "ctx3D":
                html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

                if (html_nodes) {
                    const expression = exp(`this.elu[${html_nodes.lookup_index}].getContext("3d")`);
                    setPos(expression, host_node.pos);
                    (<JSNode><unknown>host_node).nodes[index] = expression;
                }
                break;

            case "ctx2D":
                html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

                if (html_nodes) {
                    const expression = exp(`this.elu[${html_nodes.lookup_index}].getContext("2d")`);
                    setPos(expression, host_node.pos);
                    (<JSNode><unknown>host_node).nodes[index] = expression;
                }
                break;

            default:
                html_nodes = matchAll<DOMLiteral>(css_selector, component.HTML, css_selector_helpers);

                if (html_nodes.length > 0) {

                    const expression = (html_nodes.length == 1)
                        ? exp(`this.elu[${html_nodes[0].lookup_index}]; `)
                        : exp(`[${html_nodes.map(e => `this.elu[${e.lookup_index}]`).join(",")}]`);

                    setPos(expression, host_node.pos);

                    (<JSNode><unknown>host_node).nodes[index] = expression;
                }
        }

        return null;
    }
});

function getElementAtIndex(comp: ComponentData, index: number, node: DOMLiteral = comp.HTML, counter = { i: 0 }): DOMLiteral {

    if (index == node.lookup_index) return node;

    //if (!node.data)
    //counter.i++;

    if (node.children) for (const child of node.children) {
        let out = null;
        if ((out = getElementAtIndex(comp, index, child, counter))) return out;
    }

    return null;
};
