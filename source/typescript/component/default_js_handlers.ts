import { stmt, MinTreeNodeType, MinTreeNode, renderCompressed, exp } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";


import { WICK_AST_NODE_TYPE_SIZE, WickASTNodeClass, WickASTNode, WickASTNodeType, WickBindingNode } from "../types/wick_ast_node_types.js";
import { JSHandler } from "../types/js_handler.js";
import { DATA_FLOW_FLAG } from "../runtime/component_class.js";
import { processFunctionDeclaration } from "./js.js";
import { setComponentVariable, VARIABLE_REFERENCE_TYPE } from "./set_component_variable.js";
import { processWickHTML_AST } from "./html.js";
import makeComponent from "./component.js";
import { processWickCSS_AST } from "./css.js";
;
const default_handler = {
    priority: -Infinity,
    prepareJSNode(node) { return node; }
};

export const JS_handlers: Array<JSHandler[]> = Array(256 - WICK_AST_NODE_TYPE_SIZE).fill(null).map(() => [default_handler]);


function loadJSHandlerInternal(handler: JSHandler, ...types: MinTreeNodeType[]) {

    for (const type of types) {

        const handler_array = JS_handlers[Math.max((type >>> 24), 0)];

        handler_array.push(handler);

        handler_array.sort((a, b) => a.priority > b.priority ? -1 : 1);;

    }
}

export function loadJSHandler(handler: JSHandler, ...types: MinTreeNodeType[]) {

    const modified_handler = Object.assign({}, handler);

    modified_handler.priority = Math.abs(modified_handler.priority);

    return loadJSHandler(modified_handler, ...types);
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

        async prepareJSNode(node, parent_node, skip, replace, component, presets) {
            let from_value = "", module = null;

            if (!node.nodes[0])
                from_value = <string>node.nodes[1].value;
            else {
                module = node.nodes[0];
                from_value = <string>node.nodes[1].nodes[0].value;
            }



            // The @*** values are processed as regular scripts
            // if they have any values other than the ones
            // stated below.
            if (from_value)
                switch (from_value) {

                    case "@parent":
                        /* all ids within this node are imported binding_variables from parent */
                        //Add all elements to global 

                        for (const { node: id, meta: { skip } } of traverse(node, "nodes", 4)
                            .filter("type", MinTreeNodeType.Specifier, MinTreeNodeType.IdentifierModule)
                            .makeSkippable()
                        ) {

                            let local_name = "", external_name = "";

                            if (id.type == MinTreeNodeType.Specifier) {
                                local_name = <string>id.nodes[0].value;
                                external_name = <string>id.nodes[1].value;
                            } else {
                                local_name = <string>id.value;
                                external_name = <string>id.value;
                            }

                            setComponentVariable(VARIABLE_REFERENCE_TYPE.PARENT_VARIABLE, local_name, component, external_name || local_name, DATA_FLOW_FLAG.FROM_PARENT, <MinTreeNode>node);

                            skip();
                        }


                        break;

                    case "@api":

                        for (const { node: id, meta: { skip } } of traverse(node, "nodes", 4)
                            .filter("type", MinTreeNodeType.Specifier, MinTreeNodeType.IdentifierModule)
                            .makeSkippable()
                        ) {
                            let local_name = "", external_name = "";

                            if (id.type == MinTreeNodeType.Specifier) {
                                external_name = <string>id.nodes[0].value;
                                local_name = <string>id.nodes[1].value;
                            } else {
                                local_name = <string>id.value;
                                external_name = <string>id.value;
                            }

                            setComponentVariable(VARIABLE_REFERENCE_TYPE.API_VARIABLE, local_name, component, external_name || local_name, DATA_FLOW_FLAG.FROM_PARENT, <MinTreeNode>node);

                            skip();
                        }

                        break;

                    case "@global":

                        for (const { node: id, meta: { skip } } of traverse(node, "nodes", 4)
                            .filter("type", MinTreeNodeType.Specifier, MinTreeNodeType.IdentifierModule)
                            .makeSkippable()
                        ) {
                            let local_name = "", external_name = "";

                            if (id.type == MinTreeNodeType.Specifier) {
                                external_name = <string>id.nodes[0].value;
                                local_name = <string>id.nodes[1].value;
                            } else {
                                local_name = <string>id.value;
                                external_name = <string>id.value;
                            }

                            setComponentVariable(VARIABLE_REFERENCE_TYPE.GLOBAL_VARIABLE, local_name, component, external_name || local_name, DATA_FLOW_FLAG.FROM_OUTSIDE, <MinTreeNode>node);

                            skip();
                        }

                        break;

                    case "@model":

                        for (const { node: id, meta: { skip } } of traverse(node, "nodes", 4)
                            .filter("type", MinTreeNodeType.Specifier, MinTreeNodeType.IdentifierModule)
                            .makeSkippable()
                        ) {
                            let local_name = "", external_name = "";

                            if (id.type == MinTreeNodeType.Specifier) {
                                local_name = <string>id.nodes[0].value;
                                external_name = <string>id.nodes[1].value;
                            } else {
                                local_name = <string>id.value;
                                external_name = <string>id.value;
                            }

                            setComponentVariable(VARIABLE_REFERENCE_TYPE.MODEL_VARIABLE, local_name, component, external_name || local_name, DATA_FLOW_FLAG.FROM_MODEL, <MinTreeNode>node);

                            skip();
                        }

                        break;

                    case "@presets":
                        /* all ids within this node are imported form the presets object */
                        break;

                    default:
                        // Read file and determine if we have a component, a script or some other resource. REQUIRING
                        // extensions would make this whole process 9001% easier. such .html for components,
                        // .wjs for components, and any other extension type for other kinds of files.
                        // Also could consider MIME type information for files that served through a web
                        // server.

                        //TODO: Save data and load into presets. 

                        try {
                            await makeComponent(from_value, presets, component.location);
                        } catch (e) {
                            console.log({ e });
                        };


                        break;

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

        async prepareJSNode(node, parent_node, skip, replace, component, presets) {


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
                    setComponentVariable(VARIABLE_REFERENCE_TYPE.INTERNAL_VARIABLE, l_name, component, "", DATA_FLOW_FLAG.EXPORT_TO_PARENT, <MinTreeNode>node);
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
// scope. These should only be available
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, replace, component, presets) {
            const
                n = stmt("a,a;"),
                [{ nodes }] = n.nodes;

            nodes.length = 0;

            //Add all elements to global 
            for (const { node: id, meta } of traverse(node, "nodes", 4)
                .filter("type", MinTreeNodeType.IdentifierBinding, MinTreeNodeType.BindingExpression)
            ) {
                if (id.type == MinTreeNodeType.BindingExpression) {

                    const node = id.nodes[0];
                    //Any assignments should be pushed to back into the initializing function

                    component.declarations.push(id.nodes[0]);

                    const l_name = <string>node.value;

                    const d = setComponentVariable(VARIABLE_REFERENCE_TYPE.INTERNAL_VARIABLE, l_name, component, "", 0, <MinTreeNode>meta.parent);

                    console;

                    id.type = MinTreeNodeType.CallExpression;

                    nodes.push(exp(`this.u${d.class_name}(${renderCompressed(id.nodes[1])})`));
                } else {
                    //    / binding_variables.push({ v: id.value, node: id, parent });

                }
            }

            return n;
        }
    }, MinTreeNodeType.VariableStatement
);


// ###################################################################
// Call Expression Identifiers
//
// If the identifier is used as the target of a call expression, add the call
// expression node to the variable's references list.
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, replace, component, presets) {

            const [id] = node.nodes,
                name = <string>id.value;

            if (component.variables.has(name)) {
                setComponentVariable(VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE, name, component, name, 0, <MinTreeNode>node);
            }

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

        prepareJSNode(node, parent_node, skip, replace, component, presets) {

            const
                [name_node] = node.nodes;
            let name = <string>name_node.value;
            let root_name = name;


            if (name[0] == "$") {

                setComponentVariable(0, name, component, "", 0, <MinTreeNode>parent_node);

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

            setComponentVariable(VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE, name, component, "", 0, <MinTreeNode>parent_node);

            if (name[0] == "$") {
                node.nodes[1] = { type: MinTreeNodeType.Arguments, nodes: [exp("f=0")], pos: node.pos };
                node.nodes[2].nodes.unshift(stmt(`if(f>0)return 0;`));
            }

            processFunctionDeclaration(<MinTreeNode>node, component, presets, root_name);

            skip();

            return null;
        }

    }, MinTreeNodeType.FunctionDeclaration
);


// ###################################################################
// Call Expression Identifiers
//
// If the identifier is used as the target of a call expression, add the call
// expression node to the variable's references list.
loadJSHandlerInternal(
    {
        priority: 1,

        prepareJSNode(node, parent_node, skip, replace, component, presets) {

            const name = <string>node.value;

            if (component.variables.has(name))
                setComponentVariable(0, name, component, name, 0, <MinTreeNode>parent_node);

            return <MinTreeNode>node;
        }
    }, MinTreeNodeType.IdentifierReference
);

// ###################################################################
// Naked Style Element. Styles whole component.
loadJSHandlerInternal(
    {
        priority: 1,

        async prepareJSNode(node, parent_node, skip, replace, component, presets) {

            if (node.nodes[0].type == WickASTNodeType.HTML_STYLE) {

                await processWickCSS_AST(node.nodes[0], component, presets);

                return null;
            }

        }

    }, MinTreeNodeType.ExpressionStatement
);