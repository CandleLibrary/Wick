import URL from "@candlefw/url";

import Presets from "./presets.js";

import { WickASTNode, WickASTNodeType } from "../types/wick_ast_node.js";
import { WickComponentErrorStore } from "../types/errors.js";
import { traverse, double_back_traverse, filter, make_skippable } from "@candlefw/conflagrate";
import { MinTreeNode, MinTreeNodeType } from "@candlefw/js";


export interface WickRuntimeConstructor {

}

function makeLocal(value, globals, locals) {
    if (globals.has(value))
        globals.delete(value);
    locals.add(value);
}

function makeGlobal(value, globals) {
    globals.add(value);
}
/**
 * Returns a list of variable names that are part of the root node's closure.
 * @param {MinTreeNode} root - Root MinTreeNode node that determines the global scope.
 */
function grabScriptGlobals(root: MinTreeNode): { node: MinTreeNode, name: string; }[] {
    //While traversing the nodes, mark all nodes encountered within let, const, and 
    // function args; These represent local variables. Any other variable identifier is fair game.

    const local_list = [];

    const locals = new Set();
    const globals = new Set();

    for (const node of traverse(root, "nodes")
        .then(filter("type",
            MinTreeNodeType.Arguments,
            MinTreeNodeType.VariableStatement,
            MinTreeNodeType.LexicalDeclaration,
            MinTreeNodeType.ArrowFunction,
            MinTreeNodeType.Class,
            MinTreeNodeType.Function,
            MinTreeNodeType.Method,
            MinTreeNodeType.Identifier,
            MinTreeNodeType.MemberExpression
        ))
        .then(make_skippable())
    ) {
        switch (node.type) {
            case MinTreeNodeType.Identifier:
                makeGlobal(node.val, globals);
                break;
            case MinTreeNodeType.MemberExpression:
                //Extract any value from calculated accessors
                node.skip();
                break;
            case MinTreeNodeType.Arguments:

                break;
            case MinTreeNodeType.VariableStatement:
                //Parse list and extract any values on bindings
                node.skip();
                for (const mem_node of traverse(node, "nodes")) {
                    if (mem_node.type == MinTreeNodeType.BindingExpression)
                        makeLocal(mem_node.nodes[0].val, globals, locals);
                }
                break;
            case MinTreeNodeType.LexicalDeclaration:
                break;
        }
    }

    console.log({ locals, globals });

    return local_list; //Array.from(local_list.reduce(e => (r.add(e.values()), r), local_list[0]));
}

/**
 * Compiles a WickASTNode and returns a constructor for a runtime Wick component
 */
export async function processWickAST(
    ast: WickASTNode,
    presets: Presets,
    url: URL,
    errors: WickComponentErrorStore
): Promise<WickRuntimeConstructor> {

    /**
     * We need to first traverse the AST node structure, locating nodes that need the
     * following action taken:
     *      
     *      a.  Nodes containing a url attribute will need to have that url fetched and
     *          processed. These nodes will later be merged by the resulting AST
     *          created from the fetched resource
     * 
     *      b.  Global binding variables need to identified and hoisted to a reference
     *          table that will be used to resolve JS => HTML, JS => CSS, JS => JS
     *          bindings.
     * 
     *      c.  Nodes containing slot attributes will need to resolved.
     *      
     */

    const
        goal = {},
        global_requires = [];

    /**
     * Grabbing each binding and script to extract global dependencies
     */
    for (const node of traverse(ast, "children")) {

        if (node.type == WickASTNodeType.TEXT) {
            if (node.IS_BINDING)
                global_requires.push({ node, globals: grabScriptGlobals(<MinTreeNode>node.data.primary_ast) });
        } else {
            global_requires.push({ node, globals: grabScriptGlobals(<MinTreeNode>node.ast) });
        }
    }

    return {};
}



