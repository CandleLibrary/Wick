import { stmt, MinTreeNodeType, MinTreeNode, exp } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";

import { WICK_AST_NODE_TYPE_SIZE, WickASTNodeClass, WickASTNode, WickASTNodeType, WickBindingNode } from "../types/wick_ast_node_types.js";
import { JSHandler } from "../types/js_handler.js";
import { processFunctionDeclaration } from "./component_js.js";
import { processWickHTML_AST } from "./component_html.js";
import { processWickCSS_AST } from "./component_css.js";
import { importResource } from "./component_common.js";
import { VARIABLE_REFERENCE_TYPE, DATA_FLOW_FLAG, Component } from "../types/types.js";
import {
    addBindingVariable,
    addNodeToBindingIdentifiers,
    addWrittenBindingVariableName,
    addNameToDeclaredVariables,
    isVariableDeclared,
    addReadBindingVariableName,
    isBindingVariable,
    addBindingVariableFlag
} from "./getNonTempFrame.js";



const default_handler = {
    priority: -Infinity,
    prepareJSNode(node) { return node; }
};

export const JS_handlers: Array<JSHandler[]> = Array(512 - WICK_AST_NODE_TYPE_SIZE).fill(null).map(() => [default_handler]);


function loadJSHandlerInternal(handler: JSHandler, ...types: MinTreeNodeType[]) {

    for (const type of types) {

        const handler_array = JS_handlers[Math.max((type >>> 23), 0)];

        handler_array.push(handler);

        handler_array.sort((a, b) => a.priority > b.priority ? -1 : 1);;

    }
}

export function loadJSHandler(handler: JSHandler, ...types: MinTreeNodeType[]) {

    const modified_handler = Object.assign({}, handler);

    modified_handler.priority = Math.abs(modified_handler.priority);

    return loadJSHandler(modified_handler, ...types);
}

function addBinding(
    attribute_name: string,
    binding_node: MinTreeNode | WickASTNode,
    host_node: MinTreeNode | WickASTNode,
    html_element_index: number,
    component: Component) {
    component.bindings.push({
        attribute_name,
        binding_node,
        host_node,
        html_element_index
    });
}


// ###################################################################
// IMPORTS
//
// Import statements from files can either be JS data or HTML data.
// In either case we may be dealing with a component. HTML files are 
// by default components. 
//
// In the case of  a JS file, we'll know we have a component if there 
// lies a DEFAULT export which is a wick component.  IF this is note the
// case, then the file is handled as a regular JS file which can have
// objects imported into the component. Access to this file is ultimately
// hoisted to the root of the APP and is made available to all component. 
// 
// There is also the case of the Parent Module import @parent and the 
// "presets" or runtime import @presets, which are special none file
// imports that wick will use to load data from the node's parent's 
// exports and the presets global object, respectively.
loadJSHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, component, presets, frame) {
            let url_value = "";

            const [imports, from] = node.nodes;

            if (!imports)
                url_value = <string>from.value;
            else
                url_value = <string>from.nodes[0].value;

            if (url_value) {

                const names = [];

                for (const { node: id, meta: { skip } } of traverse(node, "nodes", 4)
                    .filter("type", MinTreeNodeType.Specifier, MinTreeNodeType.IdentifierModule)
                    .makeSkippable()
                ) {

                    let local = "", external = "";

                    if (id.type == MinTreeNodeType.Specifier) {
                        local = <string>id.nodes[0].value;
                        external = <string>id.nodes[1].value;
                    } else {
                        local = <string>id.value;
                        external = <string>id.value;
                    }

                    names.push({ local, external });

                    skip();
                }

                await importResource(url_value, component, presets, node, imports ? <string>imports.nodes[0].value : "", names, frame);
            }

            //Export and import statements should not showup in the final AST.
            skip();

            return null;
        }
    }, MinTreeNodeType.ImportDeclaration
);

// ###################################################################
// EXPORTS
//
// Exports in a component provide a way to declare objects that can 
// be consumed by the components parent element. This creates a one
// way non-bubbling binding to the parent's scope. The parent scope
// must bind to the child's name through the bind attribute. 
loadJSHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, component, presets, frame) {


            // If the export is an element then 
            const [export_obj] = node.nodes;

            if (export_obj.type & WickASTNodeClass.HTML_NODE) {
                // Don't need this node, it will be assigned to the components

                // Element slot.
                await processWickHTML_AST(<WickASTNode>export_obj, component, presets);

            } else {

                const [clause] = node.nodes;

                //Regular export that will be pushed to parent scope space. 

                for (const node of clause.nodes) {
                    const l_name = <string>node.value;
                    addBindingVariableFlag(l_name, DATA_FLOW_FLAG.EXPORT_TO_PARENT, frame);
                }

            }

            return null;
        }
    }, MinTreeNodeType.ExportDeclaration
);

// ###################################################################
// COMPONENT SCOPE VARIABLES
//
// These variables are accessible by all bindings within the components
// scope. 
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {


            const
                n = stmt("a,a;"),
                [{ nodes }] = n.nodes;

            nodes.length = 0;

            //Add all elements to global 
            for (const { node: binding, meta } of traverse(node, "nodes", 4)
                .filter("type", MinTreeNodeType.IdentifierBinding, MinTreeNodeType.BindingExpression)
            ) {
                if (binding.type == MinTreeNodeType.BindingExpression) {

                    const [identifier] = binding.nodes;

                    const l_name = <string>identifier.value;

                    if (frame.IS_ROOT) {

                        if (!
                            addBindingVariable({
                                class_index: -1,
                                external_name: l_name,
                                internal_name: l_name,
                                type: VARIABLE_REFERENCE_TYPE.INTERNAL_VARIABLE,
                                flags: 0
                            }, frame)
                        ) {
                            debugger;
                        }

                        addNodeToBindingIdentifiers(identifier, <MinTreeNode>meta.parent, frame);

                        addWrittenBindingVariableName(l_name, frame);

                        addBinding("binding_initialization", binding, node, 0, component);

                    } else
                        addNameToDeclaredVariables(l_name, frame);

                } else {
                    if (!frame.IS_ROOT) addNameToDeclaredVariables(<string>node.value, frame);
                }
            }

            return null;
        }
    }, MinTreeNodeType.VariableStatement
);

// These variables are accessible by all bindings within the components
// scope. 
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            //Add all elements to global 
            for (const { node: binding, meta } of traverse(node, "nodes", 4)
                .filter("type", MinTreeNodeType.IdentifierBinding, MinTreeNodeType.BindingExpression)
            ) {
                if (binding.type == MinTreeNodeType.BindingExpression) {

                    const [identifier] = binding.nodes;

                    const l_name = <string>identifier.value;

                    addNameToDeclaredVariables(l_name, frame);
                } else {
                    addNameToDeclaredVariables(<string>node.value, frame);
                }
            }
        }
    }, MinTreeNodeType.LexicalDeclaration, MinTreeNodeType.LexicalBinding
);

// ###################################################################
// Call Expression Identifiers
//
// If the identifier is used as the target of a call expression, add the call
// expression node to the variable's references list.
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {
            const [id] = node.nodes,
                l_name = <string>id.value;

            if (isBindingVariable(l_name, frame)) skip(1);

            return <MinTreeNode>node;
        }
    }, MinTreeNodeType.CallExpression
);

// ###################################################################
// Function Declaration
// 
// Root scoped functions are transformed into methods.
// 
loadJSHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, component, presets, frame) {

            const
                [name_node] = node.nodes;

            let
                name = <string>name_node.value,
                root_name = name;

            if (!frame.IS_ROOT)
                addNameToDeclaredVariables(name, frame);

            if (name[0] == "$") {

                if (frame.IS_ROOT) {
                    addBindingVariable({
                        internal_name: name,
                        external_name: name,
                        class_index: -1,
                        type: VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE,
                        flags: 0
                    }, frame);
                }

                root_name = name.slice(1);

                component.addBinding({
                    attribute_name: "method_call",
                    binding_node: <WickBindingNode>{
                        type: WickASTNodeType.WickBinding,
                        primary_ast: stmt(`if(f<1) this.${name}();`),
                        value: name.slice(1),
                        IS_BINDING: true
                    },
                    host_node: node,
                    html_element_index: -1
                });
            }

            skip(1);

            if (frame.IS_ROOT) {
                addBindingVariable({
                    internal_name: name,
                    external_name: name,
                    class_index: -1,
                    type: VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE,
                    flags: 0
                }, frame);
            }

            if (name[0] == "$") {
                node.nodes[1] = { type: MinTreeNodeType.Arguments, nodes: [exp("f=0")], pos: node.pos };
                (<MinTreeNode>node).nodes[2].nodes.unshift(stmt(`if(f>0)return 0;`));
            }

            await processFunctionDeclaration(<MinTreeNode>node, component, presets, root_name);

            skip();

            return null;
        }

    }, MinTreeNodeType.FunctionDeclaration
);


loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            const name = <string>node.value;

            if (!isVariableDeclared(name, frame)
                && isBindingVariable(name, frame)) {

                addNodeToBindingIdentifiers(
                    <MinTreeNode>node,
                    <MinTreeNode>parent_node,
                    frame);

                addReadBindingVariableName(name, frame);
            }

            return <MinTreeNode>node;
        }
    }, MinTreeNodeType.IdentifierReference
);

loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {
            for (const { node: id } of traverse(<MinTreeNode>node, "nodes")
                .filter("type", MinTreeNodeType.IdentifierReference)
            ) {
                const name = <string>id.value;

                if (!isVariableDeclared(name, frame)) {

                    if (isBindingVariable(name, frame))
                        addNodeToBindingIdentifiers(node, parent_node, frame);

                    addWrittenBindingVariableName(name, frame);
                }

                skip(1);

                break;
            }
        }
    }, MinTreeNodeType.AssignmentExpression
);


// ###################################################################
// Naked Style Element. Styles whole component.
loadJSHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, component, presets, frame) {
            const [expr] = node.nodes;

            if (frame.IS_ROOT && expr.type == MinTreeNodeType.CallExpression) {
                const [id] = expr.nodes;
                if (id.type == MinTreeNodeType.IdentifierReference
                    && id.value == "watch") {

                    component.addBinding({
                        attribute_name: "watched_frame_method_call",
                        binding_node: expr,
                        host_node: node,
                        html_element_index: 0
                    });

                    return null;
                }
            }

            if (node.nodes[0].type == WickASTNodeType.HTML_STYLE) {

                await processWickCSS_AST(node.nodes[0], component, presets);

                return null;
            }

        }

    }, MinTreeNodeType.ExpressionStatement
);


// ###################################################################
// String with identifiers for HTML Elements. 
loadJSHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, component, presets, frame) {

            if (node.value[0] == "@") {

                component.addBinding({
                    attribute_name: "inlined_element_id",
                    binding_node: node,
                    host_node: parent_node,
                    html_element_index: 0
                });

            }

            return <MinTreeNode>node;
        }

    }, MinTreeNodeType.StringLiteral
);

