import { traverse } from "@candlefw/conflagrate";
import { exp, JSNode, JSNodeType, stmt } from "@candlefw/js";
import { JSHandler } from "../types/js_handler.js";
import { Component, DATA_FLOW_FLAG, VARIABLE_REFERENCE_TYPE } from "../types/types.js";
import { HTMLNode, HTMLNodeClass, HTMLNodeTypeLU, WickBindingNode, WICK_AST_NODE_TYPE_SIZE, HTMLNodeType } from "../types/wick_ast_node_types.js";
import {
    addBindingVariable,
    addBindingVariableFlag, addNameToDeclaredVariables, addNodeToBindingIdentifiers,
    addReadBindingVariableName, addWrittenBindingVariableName,
    isBindingVariable, isVariableDeclared
} from "./component_binding_common.js";
import { getFirstReferenceName, importResource, setPos } from "./component_common.js";
import { processWickCSS_AST } from "./component_css.js";
import { processWickHTML_AST } from "./component_html.js";
import { processFunctionDeclaration, processNodeSync } from "./component_js.js";
import { BINDING_SELECTOR } from "../types/binding.js";


export function findFirstNodeOfType(type: JSNodeType, ast: JSNode) {

    for (const { node } of traverse(ast, "nodes"))
        if (node.type == type) return node;

    return null;
};

const default_handler = {
    priority: -Infinity,
    prepareJSNode(node) { return node; }
};

export const JS_handlers: Array<JSHandler[]> = Array(512 - WICK_AST_NODE_TYPE_SIZE).fill(null).map(() => [default_handler]);


function loadJSHandlerInternal(handler: JSHandler, ...types: JSNodeType[]) {

    for (const type of types) {

        const handler_array = JS_handlers[Math.max((type >>> 23), 0)];

        handler_array.push(handler);

        handler_array.sort((a, b) => a.priority > b.priority ? -1 : 1);;

    }
}

export function loadJSHandler(handler: JSHandler, ...types: JSNodeType[]) {

    const modified_handler = Object.assign({}, handler);

    modified_handler.priority = Math.abs(modified_handler.priority);

    return loadJSHandler(modified_handler, ...types);
}

function addBinding(
    attribute_name: string,
    binding_val: JSNode,
    host_node: JSNode,
    html_element_index: number,
    component: Component) {
    component.bindings.push({
        binding_selector: attribute_name,
        binding_val,
        host_node: <JSNode>host_node,
        html_element_index
    });
}

/*
██ ███    ███ ██████   ██████  ██████  ████████                                        
██ ████  ████ ██   ██ ██    ██ ██   ██    ██                                           
██ ██ ████ ██ ██████  ██    ██ ██████     ██                                           
██ ██  ██  ██ ██      ██    ██ ██   ██    ██                                           
██ ██      ██ ██       ██████  ██   ██    ██                                           
                                                                                       
                                                                                       
██████  ███████  ██████ ██       █████  ██████   █████  ████████ ██  ██████  ███    ██ 
██   ██ ██      ██      ██      ██   ██ ██   ██ ██   ██    ██    ██ ██    ██ ████   ██ 
██   ██ █████   ██      ██      ███████ ██████  ███████    ██    ██ ██    ██ ██ ██  ██ 
██   ██ ██      ██      ██      ██   ██ ██   ██ ██   ██    ██    ██ ██    ██ ██  ██ ██ 
██████  ███████  ██████ ███████ ██   ██ ██   ██ ██   ██    ██    ██  ██████  ██   ████ 
*/
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
                    .filter("type", JSNodeType.Specifier, JSNodeType.IdentifierModule)
                    .makeSkippable()
                ) {

                    let local = "", external = "";

                    if (id.type == JSNodeType.Specifier) {
                        external = <string>id.nodes[0].value;
                        local = <string>id.nodes[1].value;
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
    }, JSNodeType.ImportDeclaration
);
/*
███████ ██   ██ ██████   ██████  ██████  ████████                                      
██       ██ ██  ██   ██ ██    ██ ██   ██    ██                                         
█████     ███   ██████  ██    ██ ██████     ██                                         
██       ██ ██  ██      ██    ██ ██   ██    ██                                         
███████ ██   ██ ██       ██████  ██   ██    ██                                         
                                                                                       
                                                                                       
██████  ███████  ██████ ██       █████  ██████   █████  ████████ ██  ██████  ███    ██ 
██   ██ ██      ██      ██      ██   ██ ██   ██ ██   ██    ██    ██ ██    ██ ████   ██ 
██   ██ █████   ██      ██      ███████ ██████  ███████    ██    ██ ██    ██ ██ ██  ██ 
██   ██ ██      ██      ██      ██   ██ ██   ██ ██   ██    ██    ██ ██    ██ ██  ██ ██ 
██████  ███████  ██████ ███████ ██   ██ ██   ██ ██   ██    ██    ██  ██████  ██   ████ 
*/
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

            if (export_obj.type & HTMLNodeClass.HTML_NODE) {
                // Don't need this node, it will be assigned to the components

                // Element slot.
                await processWickHTML_AST(<HTMLNode>export_obj, component, presets);

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
    }, JSNodeType.ExportDeclaration
);

/*
██    ██  █████  ██████  ██  █████  ██████  ██      ███████                     
██    ██ ██   ██ ██   ██ ██ ██   ██ ██   ██ ██      ██                          
██    ██ ███████ ██████  ██ ███████ ██████  ██      █████                       
 ██  ██  ██   ██ ██   ██ ██ ██   ██ ██   ██ ██      ██                          
  ████   ██   ██ ██   ██ ██ ██   ██ ██████  ███████ ███████                     
                                                                                
                                                                                
███████ ████████  █████  ████████ ███████ ███    ███ ███████ ███    ██ ████████ 
██         ██    ██   ██    ██    ██      ████  ████ ██      ████   ██    ██    
███████    ██    ███████    ██    █████   ██ ████ ██ █████   ██ ██  ██    ██    
     ██    ██    ██   ██    ██    ██      ██  ██  ██ ██      ██  ██ ██    ██    
███████    ██    ██   ██    ██    ███████ ██      ██ ███████ ██   ████    ██    
*/
// ###################################################################
// COMPONENT SCOPE VARIABLES
//
// These variables are accessible by all bindings within the components
// scope. 
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            node = processNodeSync(<JSNode>node, frame, component, presets);

            const
                n = setPos(stmt("a,a;"), node.pos),
                [{ nodes }] = n.nodes;

            nodes.length = 0;


            //Add all elements to global 
            for (const { node: binding, meta } of traverse(node, "nodes", 4)
                .filter("type", JSNodeType.IdentifierBinding, JSNodeType.BindingExpression)
            ) {
                if (binding.type == JSNodeType.BindingExpression) {

                    const
                        [identifier] = binding.nodes,
                        l_name = <string>identifier.value;

                    if (frame.IS_ROOT) {

                        if (!
                            addBindingVariable({
                                pos: binding.pos,
                                class_index: -1,
                                external_name: l_name,
                                internal_name: l_name,
                                type: VARIABLE_REFERENCE_TYPE.INTERNAL_VARIABLE,
                                flags: 0
                            }, frame)
                        ) {
                            debugger;
                        }

                        addNodeToBindingIdentifiers(identifier, <JSNode>meta.parent, frame);

                        addWrittenBindingVariableName(l_name, frame);

                        addBinding("binding_initialization", binding, <JSNode>node, 0, component);

                    } else
                        addNameToDeclaredVariables(l_name, frame);

                } else {
                    if (!frame.IS_ROOT) addNameToDeclaredVariables(<string>node.value, frame);
                }
            }

            return null;
        }
    }, JSNodeType.VariableStatement
);

/*
██      ███████ ██   ██ ██  ██████  █████  ██      
██      ██       ██ ██  ██ ██      ██   ██ ██      
██      █████     ███   ██ ██      ███████ ██      
██      ██       ██ ██  ██ ██      ██   ██ ██      
███████ ███████ ██   ██ ██  ██████ ██   ██ ███████ 
*/
// These variables are accessible by all bindings within the components
// scope. 
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            //Add all elements to global 
            for (const { node: binding, meta } of traverse(node, "nodes", 4)
                .filter("type",
                    JSNodeType.IdentifierBinding,
                    JSNodeType.BindingExpression
                )
            ) {
                if (binding.type == JSNodeType.BindingExpression) {

                    const [identifier] = binding.nodes;

                    const l_name = <string>identifier.value;

                    addNameToDeclaredVariables(l_name, frame);
                } else {
                    addNameToDeclaredVariables(<string>binding.value, frame);
                }
            }
        }
    }, JSNodeType.LexicalDeclaration, JSNodeType.LexicalBinding
);
/*
 ██████  █████  ██      ██                                                    
██      ██   ██ ██      ██                                                    
██      ███████ ██      ██                                                    
██      ██   ██ ██      ██                                                    
 ██████ ██   ██ ███████ ███████                                               
                                                                              
                                                                              
███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ██  ██████  ███    ██ 
██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ██ ██    ██ ████   ██ 
█████     ███   ██████  ██████  █████   ███████ ███████ ██ ██    ██ ██ ██  ██ 
██       ██ ██  ██      ██   ██ ██           ██      ██ ██ ██    ██ ██  ██ ██ 
███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ██  ██████  ██   ████ 
*/
// ###################################################################
// Call Expression Identifiers
//
// If the identifier is used as the target of a call expression, add the call
// expression node to the variable's references list.
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            node = processNodeSync(<JSNode>node, frame, component, presets);

            const
                [id] = node.nodes,
                name = <string>getFirstReferenceName(<JSNode>id);//.value;

            if (!isVariableDeclared(name, frame)
                && isBindingVariable(name, frame)) {

                addNodeToBindingIdentifiers(
                    <JSNode>id,
                    <JSNode>node,
                    frame);

                addReadBindingVariableName(name, frame);

                skip(1);
            }

            return <JSNode>node;
        }
    }, JSNodeType.CallExpression
);


/*
███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██                      
██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██                      
█████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██                      
██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██                      
██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████                      
                                                                                       
                                                                                       
██████  ███████  ██████ ██       █████  ██████   █████  ████████ ██  ██████  ███    ██ 
██   ██ ██      ██      ██      ██   ██ ██   ██ ██   ██    ██    ██ ██    ██ ████   ██ 
██   ██ █████   ██      ██      ███████ ██████  ███████    ██    ██ ██    ██ ██ ██  ██ 
██   ██ ██      ██      ██      ██   ██ ██   ██ ██   ██    ██    ██ ██    ██ ██  ██ ██ 
██████  ███████  ██████ ███████ ██   ██ ██   ██ ██   ██    ██    ██  ██████  ██   ████                                                                                      
*/
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
            else {
                addBindingVariable({
                    pos: node.pos,
                    internal_name: name,
                    external_name: name,
                    class_index: -1,
                    type: VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE,
                    flags: 0
                }, frame);
            }

            if (name.slice(0, 2) == "on") {

                //Automatically bind to the root element.
                component.addBinding({
                    binding_selector: name,
                    binding_val: <WickBindingNode>{
                        type: HTMLNodeType.WickBinding,
                        primary_ast: Object.assign(
                            {},
                            name_node,
                            { type: JSNodeType.IdentifierReference }
                        ),
                        value: name.slice(1),
                        IS_BINDING: true
                    },
                    host_node: node,
                    html_element_index: 0,
                    pos: node.pos
                });
            } else if (name[0] == "$") {

                if (frame.IS_ROOT) {
                    addBindingVariable({
                        internal_name: name,
                        external_name: name,
                        class_index: -1,
                        type: VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE,
                        flags: 0,
                        pos: node.pos
                    }, frame);
                }

                root_name = name.slice(1);

                component.addBinding({
                    binding_selector: BINDING_SELECTOR.METHOD_CALL,
                    binding_val: <WickBindingNode>{
                        type: HTMLNodeType.WickBinding,
                        primary_ast: setPos(stmt(`this.${name}(f+1);`), node.pos),
                        value: name.slice(1),
                        IS_BINDING: true
                    },
                    host_node: node,
                    html_element_index: -1,
                    pos: node.pos
                });

                addNameToDeclaredVariables("f", frame);

                node.nodes[1] = env.functions.reinterpretArrowParameters([{ type: JSNodeType.Parenthesized, nodes: [exp("f=1")], pos: node.pos }]);

                (<JSNode>node).nodes[2].nodes.unshift(setPos(stmt(`if(f>1)return 0;`), node.pos));
            }

            skip(1);

            return new Promise(async res => {
                await processFunctionDeclaration(<JSNode>node, component, presets, root_name);
                res(null);
            });
        }

    }, JSNodeType.FunctionDeclaration
);

loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            if (parent_node == frame.ast) {
                for (const { node: binding, meta } of traverse(node, "nodes", 4)
                    .filter("type", JSNodeType.IdentifierBinding, JSNodeType.IdentifierReference)
                ) {
                    addNameToDeclaredVariables(<string>binding.value, frame);
                }
            }
        }

    }, JSNodeType.FormalParameters
);


/*
██ ██████  ███████ ███    ██ ████████ ██ ███████ ██ ███████ ██████        
██ ██   ██ ██      ████   ██    ██    ██ ██      ██ ██      ██   ██       
██ ██   ██ █████   ██ ██  ██    ██    ██ █████   ██ █████   ██████        
██ ██   ██ ██      ██  ██ ██    ██    ██ ██      ██ ██      ██   ██       
██ ██████  ███████ ██   ████    ██    ██ ██      ██ ███████ ██   ██       
                                                                          
                                                                          
██████  ███████ ███████ ███████ ██████  ███████ ███    ██  ██████ ███████ 
██   ██ ██      ██      ██      ██   ██ ██      ████   ██ ██      ██      
██████  █████   █████   █████   ██████  █████   ██ ██  ██ ██      █████   
██   ██ ██      ██      ██      ██   ██ ██      ██  ██ ██ ██      ██      
██   ██ ███████ ██      ███████ ██   ██ ███████ ██   ████  ██████ ███████ 
*/
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            const name = <string>node.value;

            if (!isVariableDeclared(name, frame)
                && isBindingVariable(name, frame)) {

                addNodeToBindingIdentifiers(
                    <JSNode>node,
                    <JSNode>parent_node,
                    frame);

                addReadBindingVariableName(name, frame);
            }

            return <JSNode>node;
        }
    }, JSNodeType.IdentifierReference
);


/*
 █████  ███████ ███████ ██  ██████  ███    ██ ███████ ███    ███ ███████ ███    ██ ████████ 
██   ██ ██      ██      ██ ██       ████   ██ ██      ████  ████ ██      ████   ██    ██    
███████ ███████ ███████ ██ ██   ███ ██ ██  ██ █████   ██ ████ ██ █████   ██ ██  ██    ██    
██   ██      ██      ██ ██ ██    ██ ██  ██ ██ ██      ██  ██  ██ ██      ██  ██ ██    ██    
██   ██ ███████ ███████ ██  ██████  ██   ████ ███████ ██      ██ ███████ ██   ████    ██    
                                                                                            
                                                                                            
███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ███████ ██  ██████  ███    ██       
██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ██      ██ ██    ██ ████   ██       
█████     ███   ██████  ██████  █████   ███████ ███████ ███████ ██ ██    ██ ██ ██  ██       
██       ██ ██  ██      ██   ██ ██           ██      ██      ██ ██ ██    ██ ██  ██ ██       
███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ███████ ██  ██████  ██   ████
*/
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {
            for (const { node: id } of traverse(<JSNode>node, "nodes")
                .filter("type", JSNodeType.IdentifierReference)
            ) {
                const name = <string>id.value;

                if (!isVariableDeclared(name, frame)) {

                    if (isBindingVariable(name, frame))
                        addNodeToBindingIdentifiers(<JSNode>node, <JSNode>parent_node, frame);
                    else
                        node.pos.throw(`Invalid assignment to undefined [${name}]`);

                    addWrittenBindingVariableName(name, frame);
                }

                skip(1);

                break;
            }
        }
    }, JSNodeType.AssignmentExpression
);

/*
███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ██  ██████  ███    ██     
██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ██ ██    ██ ████   ██     
█████     ███   ██████  ██████  █████   ███████ ███████ ██ ██    ██ ██ ██  ██     
██       ██ ██  ██      ██   ██ ██           ██      ██ ██ ██    ██ ██  ██ ██     
███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ██  ██████  ██   ████     
                                                                                  
                                                                                  
███████ ████████  █████  ████████ ███████ ███    ███ ███████ ███    ██ ████████   
██         ██    ██   ██    ██    ██      ████  ████ ██      ████   ██    ██      
███████    ██    ███████    ██    █████   ██ ████ ██ █████   ██ ██  ██    ██      
     ██    ██    ██   ██    ██    ██      ██  ██  ██ ██      ██  ██ ██    ██      
███████    ██    ██   ██    ██    ███████ ██      ██ ███████ ██   ████    ██      
*/
// Naked Style Element. Styles whole component.
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {
            const [expr] = node.nodes;

            if (expr.type == JSNodeType.CallExpression) {
                const [id] = expr.nodes;

                if (frame.IS_ROOT) {

                    if (id.type == JSNodeType.IdentifierReference
                        && id.value == "watch") {

                        component.addBinding({
                            binding_selector: BINDING_SELECTOR.WATCHED_FRAME_METHOD_CALL,
                            binding_val: expr,
                            host_node: node,
                            html_element_index: 0,
                            pos: node.pos
                        });

                        return null;
                    }
                } else {
                    const ref = findFirstNodeOfType(JSNodeType.IdentifierReference, expr);

                    if (ref && isBindingVariable(<string>ref.value, frame)) {
                        //Assumes that the refereneced object is modified in some
                        //way from a call on one of its members or submembers.
                        addWrittenBindingVariableName(<string>ref.value, frame);
                    }
                }
            }

            if (node.nodes[0].type == HTMLNodeType.HTML_STYLE) {

                return new Promise(async res => {
                    await processWickCSS_AST(<HTMLNode>node.nodes[0], component, presets);

                    res(null);
                });
            }
        }

    }, JSNodeType.ExpressionStatement
);

/*
███████ ████████ ██████  ██ ███    ██  ██████  
██         ██    ██   ██ ██ ████   ██ ██       
███████    ██    ██████  ██ ██ ██  ██ ██   ███ 
     ██    ██    ██   ██ ██ ██  ██ ██ ██    ██ 
███████    ██    ██   ██ ██ ██   ████  ██████                                              
*/
// String with identifiers for HTML Elements. 
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            if (node.value[0] == "@") {

                component.addBinding({
                    binding_selector: BINDING_SELECTOR.ELEMENT_SELECTOR_STRING,
                    binding_val: node,
                    host_node: parent_node,
                    html_element_index: 0,
                    pos: node.pos
                });

            }

            return <JSNode>node;
        }

    }, JSNodeType.StringLiteral
);

/*
██████  ███████ ██████  ██    ██  ██████   ██████  ███████ ██████  
██   ██ ██      ██   ██ ██    ██ ██       ██       ██      ██   ██ 
██   ██ █████   ██████  ██    ██ ██   ███ ██   ███ █████   ██████  
██   ██ ██      ██   ██ ██    ██ ██    ██ ██    ██ ██      ██   ██ 
██████  ███████ ██████   ██████   ██████   ██████  ███████ ██   ██ 
*/

loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {
            if (presets.options.REMOVE_DEBUGGER_STATEMENTS)
                return null;
        }

    }, JSNodeType.DebuggerStatement
);
