import URL from "@candlefw/url";

import Presets from "./presets.js";

import { WickASTNode, WickASTNodeType } from "../types/wick_ast_node.js";
import { WickComponentErrorStore } from "../types/errors.js";
import { traverse, double_back_traverse, filter } from "@candlefw/conflagrate";
import { MinTreeNode } from "@candlefw/js";
import { MinTreeNodeType } from "@candlefw/js/build/types/nodes/mintree_node_type";


export interface WickRuntimeConstructor {

}
/**
 * Returns a list of variable names that are part of the root node's closure.
 * @param {MinTreeNode} root - Root MinTreeNode node that determines the global scope.
 */
function grabScriptGlobals(root: MinTreeNode): { node: MinTreeNode, name: string; }[] {
    const names = [];
    for (const node of double_back_traverse(root, "nodes")) {
        console.log(node);
    }

    return names;
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

    const goal = {};

    const global_requires = [];

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

