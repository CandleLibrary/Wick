import URL from "@candlefw/url";

import { MinTreeNode, MinTreeNodeType } from "@candlefw/js";
import Presets from "./presets.js";
import CompiledWickAST, { WickASTNode } from "../types/wick_ast_node_types.js";
import { WickComponentErrorStore } from "../types/errors.js";
import { processWickHTML_AST } from "./html.js";
import { processWickJS_AST } from "./js.js";
import { Component, PendingBinding } from "../types/types";


function determineSourceType(ast: WickASTNode | MinTreeNode): boolean {
    if (ast.type == MinTreeNodeType.Script || ast.type == MinTreeNodeType.Module)
        return true;
    return false;
};

function createNameHash(string: string) {

    let number = BigInt(0);

    const seed = BigInt(0x2F41118294721DA1);

    for (let i = 0; i < string.length; i++) {

        const val = BigInt(string.charCodeAt(i));

        number = ((val << BigInt(i % 8) ^ seed) << BigInt(i % 64)) ^ (number >> BigInt(i % 4));
    }

    return "W" + number.toString(16);
}

/**
 * Compiles a WickASTNode and returns a constructor for a runtime Wick component
 * @param {WickASTNode | MinTreeNode} ast 
 * @param presets 
 * @param url 
 * @param errors 
 */
export async function processWickAST(
    ast: WickASTNode | MinTreeNode,
    source_string: string,
    presets: Presets,
    url: string
): Promise<CompiledWickAST> {

    let out_ast: CompiledWickAST = null;

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
        pending_bindings = [],

        component: Component = {

            location: url,

            children: [],

            stylesheets: [],

            child_bindings: [],

            original_ast: ast,

            variables: new Map,

            compiled_ast: null,

            element: null,

            source: source_string,

            scripts: [],

            //Global component names
            names: [],

            declarations: [],

            nluf_arrays: [],

            pending_bindings,

            class_methods: [],

            class_initializer_statements: [],

            class_cleanup_statements: [],

            addBinding: (pending_binding: PendingBinding) => pending_bindings.push(pending_binding)
        },

        IS_SCRIPT = determineSourceType(ast);

    component.name = createNameHash(source_string);

    if (IS_SCRIPT)
        await processWickJS_AST(<MinTreeNode>ast, component, presets);
    else
        await processWickHTML_AST(<WickASTNode>ast, component, presets);

    //####################################################################
    // Process Bindings.
    // 
    // Each script will have a set of input variables (the script's arguments):
    //
    //      - The script's Globals (Specifically global values that referenced)
    //      - The script's Imports
    //          parent import args
    //          import components
    //          import scripts
    //
    // Each script will have a set of outputs:
    //
    //      - The scripts child -> parents exports
    //      - The scripts Globals
    //      - the scripts arguments), imports
    //
    // For imports:
    //
    //      - Any Global value represents an event that can potentially cause the
    //        script code to execute.  
    //
    //        If all global values are set and one changes, then the script is run.
    //
    //      - Preset imports are referenced by `presets["{import name}"]...` these
    //        are simply replaced with  
    //
    // For exports:
    //
    //      - Match globals to bindings. At end of script update bindings from Globals
    //        that have been assigned. If all the bindings variables are assigned through
    //        this script then replace the binding call with the code that updates
    //        the binding's output.
    // 
    //      - Assign to the component's runtime events (Global updates)
    //        Any global value that is read (NOT global values that are only assigned)
    //
    return component;
}