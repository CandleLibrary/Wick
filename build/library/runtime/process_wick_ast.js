import { traverse } from "../tools/traverse.js";
import { filter } from "../tools/filter.js";
/**
 * Compiles a WickASTNode and returns a constructor for a runtime Wick component
 */
export async function processWickAST(ast, presets, url, errors) {
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
     *
     */
    const goal = {};
    /**
     * Grabbing each binding and script to build a dependency graph
     */
    for (const node of traverse(ast, "children", filter("type", "BINDING", "SCRIPT"))) {
        console.log(node);
    }
    return {};
}
