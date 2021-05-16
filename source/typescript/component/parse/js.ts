import { traverse } from "@candlefw/conflagrate";
import { exp, JSIdentifier, JSIdentifierReference, JSLexicalDeclaration, JSNode, JSNodeType, JSStringLiteral, stmt } from "@candlefw/js";
import { Lexer } from "@candlefw/wind";
import {
    addHook,
    addBindingReference, addBindingVariable,
    addBindingVariableFlag, addDefaultValueToBindingVariable, addNameToDeclaredVariables,
    addReadFlagToBindingVariable, addWriteFlagToBindingVariable,
    Name_Is_A_Binding_Variable, Variable_Is_Declared
} from "../../common/binding.js";
import { getFirstReferenceName, importResource, setPos } from "../../common/common.js";
import env from "../../source_code/env.js";
import { BINDING_VARIABLE_TYPE, DATA_FLOW_FLAG } from "../../types/binding";
import { HOOK_SELECTOR } from "../../types/hook";
import { JSHandler } from "../../types/js.js";
import { HTMLNode, HTMLNodeClass, HTMLNodeType, WickBindingNode, WICK_AST_NODE_TYPE_SIZE } from "../../types/wick_ast.js";
import { processFunctionDeclaration, processNodeSync, processWickCSS_AST, processWickHTML_AST } from "./parser.js";

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


function loadJSParseHandlerInternal(handler: JSHandler, ...types: JSNodeType[]) {

    for (const type of types) {

        const handler_array = JS_handlers[Math.max((type >>> 23), 0)];

        handler_array.push(handler);

        handler_array.sort((a, b) => a.priority > b.priority ? -1 : 1);;

    }
}

export function loadJSParseHandler(handler: JSHandler, ...types: JSNodeType[]) {

    const modified_handler = Object.assign({}, handler);

    modified_handler.priority = Math.abs(modified_handler.priority);

    return loadJSParseHandler(modified_handler, ...types);
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
loadJSParseHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, component, presets, frame) {

            let url_value = "";

            const [imports, from] = node.nodes;

            if (!imports)
                url_value = (<JSIdentifier>from).value;
            else
                url_value = (<JSIdentifier>from.nodes[0]).value;

            if (url_value) {

                const names = [];

                for (const { node: id, meta: { skip } } of traverse(node, "nodes", 4)
                    .filter("type", JSNodeType.Specifier, JSNodeType.IdentifierModule)
                    .makeSkippable()
                ) {

                    let local = "", external = "";

                    if (id.type == JSNodeType.Specifier) {
                        external = <string>id.nodes[0].value;
                        local = <string>id.nodes[1]?.value ?? external;
                    } else {
                        local = (<JSIdentifier>id).value;
                        external = (<JSIdentifier>id).value;
                    }

                    names.push({ local, external });

                    skip();
                }

                await importResource(url_value, component, presets, node, imports ? (<JSIdentifier>imports.nodes[0]).value : "", names, frame);
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
loadJSParseHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, component, presets, frame) {

            const [export_obj] = node.nodes;

            if (export_obj.type & HTMLNodeClass.HTML_NODE) {
                // Don't need this node, it will be assigned to the components

                // Element slot.
                await processWickHTML_AST(<HTMLNode>export_obj, component, presets);

            } else {

                const [clause] = node.nodes;

                //Regular export that will be pushed to parent scope space. 

                for (const node of clause.nodes) {
                    const l_name = (<JSIdentifier>node).value;
                    addBindingVariableFlag(l_name, DATA_FLOW_FLAG.EXPORT_TO_PARENT, frame);
                }

            }

            return null;
        }
    }, JSNodeType.ExportDeclaration
);

/*
██    ██  █████  ██████  ██  █████  ██████  ██      ███████   ██          ██      ███████ ██   ██ ██  ██████  █████  ██                     
██    ██ ██   ██ ██   ██ ██ ██   ██ ██   ██ ██      ██          ██        ██      ██       ██ ██  ██ ██      ██   ██ ██                     
██    ██ ███████ ██████  ██ ███████ ██████  ██      █████         ██      ██      █████     ███   ██ ██      ███████ ██                     
 ██  ██  ██   ██ ██   ██ ██ ██   ██ ██   ██ ██      ██              ██    ██      ██       ██ ██  ██ ██      ██   ██ ██                     
  ████   ██   ██ ██   ██ ██ ██   ██ ██████  ███████ ███████           ██  ███████ ███████ ██   ██ ██  ██████ ██   ██ ███████                
                                                                                
                                                                                
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
loadJSParseHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            node = <JSNode>processNodeSync(<JSNode>node, frame, component, presets);

            const
                n = setPos(stmt("a,a;"), node.pos),
                IS_CONSTANT = (node.type == JSNodeType.LexicalDeclaration && (<JSLexicalDeclaration>node).symbol == "const"),
                [{ nodes }] = n.nodes;

            nodes.length = 0;


            //Add all elements to global 
            for (const { node: binding, meta } of traverse(node, "nodes", 4)
                .filter("type", JSNodeType.IdentifierBinding, JSNodeType.BindingExpression)
                .makeSkippable()
            ) {
                if (binding.type == JSNodeType.BindingExpression) {

                    const
                        [identifier, value] = binding.nodes,
                        l_name = (<JSIdentifierReference>identifier).value;

                    if (frame.IS_ROOT) {

                        if (!addBindingVariable(frame, l_name, binding.pos,
                            IS_CONSTANT
                                ? BINDING_VARIABLE_TYPE.CONST_VARIABLE
                                : BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE

                        )) {
                            const msg = `Redeclaration of the binding variable [${l_name}]. 
                                First declaration here:\n${component.root_frame.binding_variables.get(l_name).pos.blame()}
                                redeclaration here:\n${(<Lexer><any>binding.pos).blame()}\nin ${component.location}`;
                            throw new ReferenceError(msg);
                        }

                        addDefaultValueToBindingVariable(frame, l_name, <JSNode>value);

                        //addBindingReference(identifier, <JSNode>meta.parent, frame);

                        addWriteFlagToBindingVariable(l_name, frame);

                        meta.skip();

                    } else
                        addNameToDeclaredVariables(l_name, frame);

                } else {
                    if (frame.IS_ROOT) {
                        if (!addBindingVariable(frame, (<JSIdentifierReference>binding).value, binding.pos,
                            IS_CONSTANT
                                ? BINDING_VARIABLE_TYPE.CONST_VARIABLE
                                : BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE

                        )) {
                            const msg = `Redeclaration of the binding variable [${(<JSIdentifierReference>binding).value}]. 
                                First declaration here:\n${component.root_frame.binding_variables.get((<JSIdentifierReference>binding).value).pos.blame()}
                                redeclaration here:\n${(<Lexer><any>binding.pos).blame()}\nin ${component.location}`;
                            throw new ReferenceError(msg);
                        }
                    } else
                        addNameToDeclaredVariables((<JSIdentifierReference>binding).value, frame);
                }
            }


            if (frame.IS_ROOT)
                return null;
            return node;
        }
    }, JSNodeType.VariableStatement, JSNodeType.LexicalDeclaration, JSNodeType.LexicalBinding
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
loadJSParseHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            node = processNodeSync(<JSNode>node, frame, component, presets);

            const
                [id] = node.nodes,
                name = <string>getFirstReferenceName(<JSNode>id);//.value;

            if (!Variable_Is_Declared(name, frame)
                && Name_Is_A_Binding_Variable(name, frame)) {

                addBindingReference(
                    <JSNode>id,
                    <JSNode>node,
                    frame);

                addReadFlagToBindingVariable(name, frame);

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
loadJSParseHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, component, presets, frame) {

            const
                [name_node] = node.nodes;

            let
                name = (<JSIdentifier>name_node).value,
                root_name = name;

            if (!frame.IS_ROOT)
                addNameToDeclaredVariables(name, frame);
            else
                addBindingVariable(frame, name, node.pos, BINDING_VARIABLE_TYPE.METHOD_VARIABLE);

            /**
             * Automatic event handler for root element
             */
            if (name.slice(0, 2) == "on") {
                /**
                 * Any method that is directly called by the component 
                 * runtime system should be mapped here to common names 
                 * that exist for that internal method. 
                 * 
                 * If internal_method_name is defined, then DO NOT create a
                 * event listener call.
                 */
                const internal_method_name = {
                    "ontransitionin": "oTI",
                    "ontrsin": "oTI",
                    "ontransitionout": "oTO",
                    "ontrsout": "oTO",
                    "onarrange": "aRR",
                    "onload": "onload",
                }[name.toLocaleLowerCase()] ?? "";

                if (internal_method_name != "") {
                    // This should be an internally called method
                    (<JSIdentifier>name_node).value = internal_method_name;
                } else {

                    //For use with DOM on* methods
                    addHook(component, {
                        selector: name,
                        hook_value: <WickBindingNode>{
                            type: HTMLNodeType.WickBinding,
                            primary_ast: Object.assign(
                                {},
                                name_node,
                                { type: JSNodeType.IdentifierReference }
                            ),
                            value: name.slice(2),
                            IS_BINDING: true
                        },
                        host_node: node,
                        html_element_index: 0,
                        pos: node.pos
                    });
                }
            } else if (name[0] == "$") {

                if (frame.IS_ROOT)
                    addBindingVariable(frame, name, node.pos, BINDING_VARIABLE_TYPE.METHOD_VARIABLE);

                root_name = name.slice(1);

                addHook(component, {
                    selector: HOOK_SELECTOR.METHOD_CALL,
                    hook_value: <WickBindingNode>{
                        type: HTMLNodeType.WickBinding,
                        primary_ast: setPos(stmt(`this.${name}(c+1);`), node.pos),
                        value: name.slice(1),
                        IS_BINDING: true
                    },
                    host_node: node,
                    html_element_index: -1,
                    pos: node.pos
                });

                addNameToDeclaredVariables("c", frame);

                node.nodes[1] = env.functions.reinterpretArrowParameters([{ type: JSNodeType.Parenthesized, nodes: [exp("c=1")], pos: node.pos }]);
                //@ts-ignore
                (<JSNode>node).nodes[2].nodes.unshift(setPos(stmt(`if(c>1)return 0;`), node.pos));
            }

            skip(1);

            return new Promise(async res => {
                await processFunctionDeclaration(<JSNode>node, component, presets, root_name);
                res(null);
            });
        }

    }, JSNodeType.FunctionDeclaration
);

loadJSParseHandlerInternal(
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
loadJSParseHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            const name = (<JSIdentifierReference>node).value;

            if (!Variable_Is_Declared(name, frame)
                && Name_Is_A_Binding_Variable(name, frame)) {

                addBindingReference(
                    <JSNode>node,
                    <JSNode>parent_node,
                    frame);

                addReadFlagToBindingVariable(name, frame);
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
                                                                                            
                                                                                            
███████ ██   ██ ██████  ██████  ███████ ███████ ███████ ██  ██████  ███    ██       
██       ██ ██  ██   ██ ██   ██ ██      ██      ██      ██ ██    ██ ████   ██       
█████     ███   ██████  ██████  █████   ███████ ███████ ██ ██    ██ ██ ██  ██       
██       ██ ██  ██      ██   ██ ██           ██      ██ ██ ██    ██ ██  ██ ██       
███████ ██   ██ ██      ██   ██ ███████ ███████ ███████ ██  ██████  ██   ████
 
+ Post(++|--) and (++|--)Pre increment expressions
*/
loadJSParseHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {
            for (const { node: id } of traverse(<JSNode>node, "nodes")
                .filter("type", JSNodeType.IdentifierReference)
            ) {
                const name = (<JSIdentifierReference>id).value;

                if (!Variable_Is_Declared(name, frame)) {

                    if (Name_Is_A_Binding_Variable(name, frame))
                        addBindingReference(<JSNode>node, <JSNode>parent_node, frame);
                    else
                        node.pos.throw(`Invalid assignment to undeclared variable [${name}]`);

                    addWriteFlagToBindingVariable(name, frame);
                }

                skip(1);

                break;
            }
        }
    }, JSNodeType.AssignmentExpression, JSNodeType.PostExpression, JSNodeType.PreExpression
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
loadJSParseHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {
            const [expr] = node.nodes;

            if (expr.type == JSNodeType.CallExpression) {
                const [id] = expr.nodes;

                if (frame.IS_ROOT) {

                    if (id.type == JSNodeType.IdentifierReference
                        && id.value == "watch") {

                        addHook(component, {
                            selector: HOOK_SELECTOR.WATCHED_FRAME_METHOD_CALL,
                            hook_value: expr,
                            host_node: node,
                            html_element_index: 0,
                            pos: node.pos
                        });

                        return null;
                    }
                } else {
                    const ref = <JSIdentifierReference>findFirstNodeOfType(JSNodeType.IdentifierReference, expr);

                    if (ref && Name_Is_A_Binding_Variable(<string>ref.value, frame)) {
                        //Assumes that the refereneced object is modified in some
                        //way from a call on one of its members or submembers.
                        addWriteFlagToBindingVariable(<string>ref.value, frame);
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
loadJSParseHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {

            if ((<JSStringLiteral>node).value[0] == "@") {

                addHook(component, {
                    selector: HOOK_SELECTOR.ELEMENT_SELECTOR_STRING,
                    hook_value: node,
                    host_node: parent_node,
                    html_element_index: 0,
                    pos: <any>node.pos
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

loadJSParseHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, component, presets, frame) {
            if (presets.options.REMOVE_DEBUGGER_STATEMENTS)
                return null;
        }

    }, JSNodeType.DebuggerStatement
);
