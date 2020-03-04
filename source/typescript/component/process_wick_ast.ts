import URL from "@candlefw/url";

import Presets from "./presets.js";

import { WickASTNode, WickASTNodeType } from "../types/wick_ast_node.js";
import { WickComponentErrorStore } from "../types/errors.js";
import { traverse, double_back_traverse, filter, make_skippable } from "@candlefw/conflagrate";
import { MinTreeNode, MinTreeNodeType } from "@candlefw/js";
import { p } from "@candlefw/whind/build/types/ascii_code_points";


function makeLocal(value, globals, locals) {
    if (globals.has(value))
        globals.delete(value);
    locals.add(value);
}

function makeGlobal(value, globals) {
    globals.add(value);
}
/**
 * Bindings define how data flows between HTML, JS, CSS.
 * 
 * For each script/binding the primary information that is needed is:
 * scope inputs and outputs
 * module inputs and outputs
 * model inputs and outputs
 * 
 * scope inputs are defined by import { **** } from "$scope";
 * outputs are defined by assignment to these values.
 * 
 * model inputs are defined by import { **** } from "$model";
 * outputs are defined by assignment to these values.
 * 
 * regular variables are defined by global assignements and global reads,
 * which are scoped to, ahem, the component scope.
 * 
 * 
 * Each component will have a list of inputs
 * model_bindings : {...{name, read / write} }
 * scope_bindings : {...{name, read / write} }
 */

/**
 * Returns a list of variable names that are part of the root node's closure.
 * @param {MinTreeNode} root - Root MinTreeNode node that determines the global scope.
 */
function grabScriptGlobals(root: MinTreeNode): { node: MinTreeNode, name: string; }[] {
    //While traversing the nodes, mark all nodes encountered within let, const, and 
    // function args; These represent local variables. Any other variable identifier is fair game.
    console.dir({root}, {depth:null})
    const 
        local_list = [],
        locals = new Set(),
        globals = new Set();

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
            MinTreeNodeType.MemberExpression,
            MinTreeNodeType.AssignmentExpression,
        ))
        .then(make_skippable())
    ) {
        console.log(node)
        
        switch (node.type) {
            case MinTreeNodeType.AssignmentExpression:
                makeGlobal(node.nodes[0].val, globals, locals);
                node.skip();
                break;
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
                console.log({lex:node})
                node.skip();
                for (const mem_node of traverse(node, "nodes")) {
                    if (mem_node.type == MinTreeNodeType.BindingExpression)
                        makeLocal(mem_node.nodes[0].val, globals, locals);
                }
                break;
        }
    }

    console.log({ locals, globals });

    return local_list; //Array.from(local_list.reduce(e => (r.add(e.values()), r), local_list[0]));
}
interface CompiledWickAST{

}
/**
 * Compiles a WickASTNode and returns a constructor for a runtime Wick component
 */
export async function processWickAST(
    ast: WickASTNode | MinTreeNode,
    presets: Presets,
    url: URL,
    errors: WickComponentErrorStore
): Promise<CompiledWickAST> {
    let out_ast : CompiledWickAST = null;
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
    if(ast.type == MinTreeNodeType.Module){
        const jsx_ast : MinTreeNode = <MinTreeNode>ast;

        //Grab globals from the script; 
        const globals = grabScriptGlobals(jsx_ast);

    }else if(ast.type == WickASTNodeType.HTML){
        const html_ast : WickASTNode = <WickASTNode>ast;
        //IF SVG or other namespace handle their transforms. 
    } if(ast.type == WickASTNodeType.HTML){
        const css_ast : WickASTNode = <WickASTNode>ast;
    } if(ast.type == WickASTNodeType.HTML){
        const script_ast : WickASTNode = <WickASTNode>ast;
    }

    return out_ast;
}