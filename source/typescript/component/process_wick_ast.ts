import URL from "@candlefw/url";

import Presets from "./presets.js";

import { WickASTNode, WickASTNodeType } from "../types/wick_ast_node.js";
import { WickComponentErrorStore } from "../types/errors.js";
import { traverse } from "../tools/traverse.js";
import { filter } from "../tools/filter.js";
import { MinTreeNode } from "@candlefw/js";


export interface WickRuntimeConstructor {

}
/**
 * Returns a list of variable names that are part of the global closure.
 * @param node {MinTreeNode}
 */
function grabScriptGlobals(node: MinTreeNode) {

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
    for (const node of traverse(ast, "children").then(filter("type", WickASTNodeType.TEXT, WickASTNodeType.SCRIPT))) {
        if (node.type == WickASTNodeType.TEXT) {
            if (node.IS_BINDING)
                global_requires.push({ node, globals: grabScriptGlobals(<>node.data.primary_ast) });
        } else {
            console.log({ node });
        }
    }

    return {};
}

