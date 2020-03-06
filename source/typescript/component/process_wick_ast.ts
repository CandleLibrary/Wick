import URL from "@candlefw/url";
import { MinTreeNode, MinTreeNodeType, ext } from "@candlefw/js";
import { traverse, filter, make_skippable, add_parent } from "@candlefw/conflagrate";

import Presets from "./presets.js";

import CompiledWickAST, { WickASTNode, WickASTNodeType } from "../types/wick_ast_node.js";
import { WickComponentErrorStore } from "../types/errors.js";


function makeLocal(value: string, globals, locals) {
    if (globals.has(value))
        globals.delete(value);
    locals.add(value);
}

function makeGlobal(value: string, globals, locals) {

    if (!locals.has(value)) {

        if (!globals.has(value)) {
            globals.set(value, {
                name: value,
                assignments: [],
                accessors: []
            });
        }

        return globals.get(value);
    }

    return null;
}

function setGlobalAssignment(value: string, globals, locals, assignment: MinTreeNode) {
    const global = makeGlobal(value, globals, locals);

    if (global)
        global.assignments.push({ assignment, line: assignment.pos.line });
}

function setGlobalAccessor(value: string, globals, locals, accessor: MinTreeNode) {
    const global = makeGlobal(value, globals, locals);

    if (global)
        global.accessors.push({ accessor, line: accessor.pos.line });
}


interface ComponentGlobalAccessor {
    access_level: number;
    node: MinTreeNode;
}

interface ComponentGlobal {
    name: string;
    type: "MODEL" | "PARENT" | "REGULAR" | "JSX_COMPONENT";

    accessors: ComponentGlobalAccessor[];

    assignments: ComponentGlobalAccessor[];
}

/**
 * Returns a list of variable names that are part of the root node's closure.
 * @param {MinTreeNode} root - Root MinTreeNode node that determines the global scope.
 */
function grabComponentGlobals(root: MinTreeNode): { node: MinTreeNode, name: string; }[] {
    //While traversing the nodes, mark all nodes encountered within let, const, and 
    // function args; These represent local variables. Any other variable identifier is fair game.

    const
        local_list = [],
        locals = new Set(),
        globals = <Map<string, ComponentGlobal>>new Map(),
        exports = new Set(),
        imports = new Set();

    console.dir({ root }, { depth: null });


    for (const node of traverse(root, "nodes")
        .then(filter("type",
            MinTreeNodeType.ImportDeclaration,
            MinTreeNodeType.ExportDeclaration,
            MinTreeNodeType.BindingExpression,
            MinTreeNodeType.MemberExpression,
            MinTreeNodeType.AssignmentExpression,
            MinTreeNodeType.Identifier,
            MinTreeNodeType.Class
        ))
        .then(add_parent())
        .then(make_skippable())
    ) {
        switch (node.type) {


            case MinTreeNodeType.AssignmentExpression: {
                const id = ext(node).identifier;

                if (id.value)
                    setGlobalAssignment(<string>id.value, globals, locals, node);

                //node.skip(0);

            } break;


            case MinTreeNodeType.ImportDeclaration: {

                const from_decl = ext(node).from;

                console.dir({ node: from_decl }, { depth: null });

                for (const import_node of traverse(node, "nodes")
                    .then(filter(
                        "type",
                        MinTreeNodeType.Specifier
                    ))) {
                    const name = <string>ext(import_node).local_id.value;

                    makeGlobal(name, globals, locals);
                    //makeImportedGlobal(name, globals, locals);
                }
            } break;


            case MinTreeNodeType.ExportDeclaration:
                break;


            case MinTreeNodeType.BindingExpression:
                makeLocal(<string>ext(node).property.value, globals, locals);
                break;


            case MinTreeNodeType.MemberExpression: {

                const ext_node = ext(node);

                if (
                    ext_node.object.type == MinTreeNodeType.Identifier
                ) {
                    const name = <string>ext_node.object.value;
                    makeGlobal(name, globals, locals);
                    setGlobalAccessor(name, globals, locals, node.parent);
                    node.skip(1);
                }
            } break;


            case MinTreeNodeType.Identifier: {
                const name = <string>node.value;

                // If the identifier is part of a member expression, then ignore it.
                // It either has already been assigned from its parent node
                // or it is a member accessor and therefore not qualified to be 
                // variable.
                if (
                    node.parent.type == MinTreeNodeType.MemberExpression
                    &&
                    node.parent.COMPUTED == false
                ) continue;

                //console.warn(node.pos.errorMessage());
                makeGlobal(name, globals, locals);
                setGlobalAccessor(name, globals, locals, node.parent);
            } break;
        }

    }
    //console.dir({ globals, locals }, { depth: 4 });

    return local_list; //Array.from(local_list.reduce(e => (r.add(e.values()), r), local_list[0]));
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
    presets: Presets,
    url: URL,
    errors: WickComponentErrorStore
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
    if (ast.type == MinTreeNodeType.Module) {
        const jsx_ast: MinTreeNode = <MinTreeNode>ast;

        //Grab globals from the script; 
        const globals = grabComponentGlobals(jsx_ast);

    } else if (ast.type == WickASTNodeType.HTML) {
        const html_ast: WickASTNode = <WickASTNode>ast;
        //IF SVG or other namespace handle their transforms. 
    } if (ast.type == WickASTNodeType.HTML) {
        const css_ast: WickASTNode = <WickASTNode>ast;
    } if (ast.type == WickASTNodeType.HTML) {
        const script_ast: WickASTNode = <WickASTNode>ast;
    }

    return out_ast;
}