import URL from "@candlefw/url";
import { MinTreeNode, MinTreeNodeType, exp, stmt, ext } from "@candlefw/js";
import { traverse, renderCompressed } from "@candlefw/conflagrate";

import Presets from "./presets.js";
import CompiledWickAST, { WickASTNode } from "../types/wick_ast_node_types.js";
import { WickComponentErrorStore } from "../types/errors.js";
import { processWickHTML_AST } from "./html.js";
import { processWickJS_AST } from "./js.js";
import { processBindings } from "./process_bindings.js";
import { Component, PendingBinding } from "../types/types";
import { getPropertyAST, getGenericMethodNode, getObjectLiteralAST } from "./js_ast_tools.js";
import { renderers } from "../format_rules.js";
import { setVariableName, VARIABLE_REFERENCE_TYPE } from "./set_component_variable.js";


function determineSourceType(ast: WickASTNode | MinTreeNode): boolean {
    if (ast.type == MinTreeNodeType.Script || ast.type == MinTreeNodeType.Module)
        return true;
    return false;
};

function buildStyle(ast, stylesheets): string {

    if (stylesheets.length > 0)
        return stylesheets[0].toString();

    return "";
}

function buildExportableDOMNode(
    ast: WickASTNode & {
        component_name?: string;
        slot_name?: string;
    }) {

    const
        c = getPropertyAST("c", `[]`),
        a = getPropertyAST("a", `[]`),
        cp = getPropertyAST("cp", `""`),
        ct = getPropertyAST("ct", `true`),
        sl = getPropertyAST("sl", `""`),
        nodes = [getPropertyAST("t", `"${ast.tag || ""}"`)];

    if (ast.slot_name) {
        sl.nodes[1].value = ast.slot_name;
        nodes.push(sl);
    }

    if (ast.component_name) {
        cp.nodes[1].value = ast.component_name;
        nodes.push(cp);
    }

    if (ast.is_container) {
        nodes.push(ct);
    }

    if (ast.attributes && ast.attributes.length > 0) {
        for (const attrib of ast.attributes)
            a.nodes[1].nodes.push(getObjectLiteralAST(attrib.name, `"${attrib.value}"`));
        nodes.push(a);
    }

    /***
     * DOM
     */

    if (ast.nodes && ast.nodes.length > 0) {
        for (const child of ast.nodes)
            c.nodes[1].nodes.push(buildExportableDOMNode(child));
        nodes.push(c);
    }

    nodes.push(getPropertyAST("i", `${ast.id}`));

    if (ast.data)
        nodes.push(getPropertyAST("d", `"${ast.data.replace(/\n/g, '\\n') || ""}"`));
    else if (ast.ns > 0)
        nodes.push(getPropertyAST("ns", `${ast.ns || 0}`));

    const expression = {
        type: MinTreeNodeType.ObjectLiteral, nodes, pos: ast.pos
    };

    return expression;
}

/**
 * Update global variables in ast after all globals have been identified
 */
function makeComponentMethod(script, component: Component) {

    const
        { variables, class_methods } = component,
        used_values = new Set();

    let { ast, root_name } = script;


    for (const { node, meta } of traverse(ast, "nodes")
        .makeMutable()
        .makeSkippable()
    ) {
        const { skip, mutate, parent } = meta;

        if (node.type == MinTreeNodeType.AssignmentExpression) {

            const [left, right] = node.nodes;

            if (left.type == MinTreeNodeType.IdentifierReference) {

                const { value } = left;

                if (variables.has(value)) {

                    const global_val = variables.get(value),
                        mutate_node = exp(`this.u${global_val.class_name}()`);

                    global_val.ASSIGNED = 1;

                    node.nodes[0] = exp(setVariableName(value, component));

                    mutate_node.nodes[1].nodes = [node];

                    if (root_name == value)
                        mutate_node.nodes[1].nodes.push(exp("1"));

                    mutate(mutate_node);

                    used_values.add(value);
                }

            } else if (left.type == MinTreeNodeType.MemberExpression) {
                if (left == MinTreeNodeType.IdentifierReference) {
                    const { value } = node;
                    if (variables.has(value)) {
                        const global_val = variables.get(value);
                        mutate(exp(setVariableName(value, component)));
                    }
                }
            }
        }

        if (node.type == MinTreeNodeType.IdentifierReference) {
            const { value } = node;

            if (variables.has(value)) {

                const global_val = variables.get(value);
                mutate(exp(setVariableName(value, component)));
            }
        }
    }

    if (script.type == "method")
        ast.function_type = "method";
    else
        ast.function_type = "root";

    switch (ast.function_type) {
        case "root":
            const method = exp("({c(){a}})").nodes[0].nodes[0];
            method.nodes[2].nodes = ast.nodes;
            ast = method;
            break;
    }

    class_methods.push(ast);
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

    const
        pending_bindings = [],

        component: Component = {

            location: url,

            children: [],

            stylesheets: [],

            child_bindings: [],

            original_ast: ast,

            variables: new Map,

            locals: new Set(),

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
        component.compiled_ast = await processWickJS_AST(<MinTreeNode>ast, component, presets);
    else
        component.compiled_ast = await processWickHTML_AST(<WickASTNode>ast, component, presets);

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

    let id = 0;

    component.variables.forEach(v => v.class_name = id++);

    //Convert scripts into a class object 
    const component_class = stmt(`class ${component.names[0] || "temp"} extends cfw.wick.Component {constructor(s){super(c,p,s);} c(){}}`);

    component_class.nodes.length = 3;

    component.class_methods = component_class.nodes;


    //Initializer Method
    const register_elements_method = getGenericMethodNode("re", "", "const c = this;"),

        [, , { nodes: re_stmts }] = register_elements_method.nodes;

    component.class_initializer_statements = re_stmts;

    //Cleanup Method

    const cleanup_element_method = getGenericMethodNode("re", "", "const c = this;"),

        [, , { nodes: cu_stmts }] = cleanup_element_method.nodes;

    component.class_cleanup_statements = cu_stmts;

    await processBindings(component, presets);

    /* ---------------------------------------
     * -- Create LU table for public variables
     */

    const
        public_prop_lookup = {},
        nlu = stmt("c.nlu = {};"), nluf = stmt("c.nluf = [];"),
        nluf_arrays = component.nluf_arrays,
        { nodes: [{ nodes: [, nluf_public_variables] }] } = nluf,
        { nodes: [{ nodes: [, lu_public_variables] }] } = nlu;

    let nlu_index = 0;

    for (const component_variable of component.variables.values()) {

        if (true /* some check for component_variable property of binding*/) {

            lu_public_variables.nodes.push(getPropertyAST(component_variable.external_name, (component_variable.usage_flags << 24) | nlu_index));

            const nluf_array = exp(`c.u${component_variable.class_name}`);

            nluf_arrays.push(nluf_array.nodes);

            nluf_public_variables.nodes.push(nluf_array);

            public_prop_lookup[component_variable.original_name] = nlu_index;

            component_variable.nlui = nlu_index++;
        }
    }

    component.class_initializer_statements.push(nlu, nluf);


    for (const id of component.declarations) {
        if (component.variables.has(<string>id.value)) {
            id.value = `this[${component.variables.get(<string>id.value).class_name}]`;
        }
    }

    //Compile scripts into methods

    for (const script of component.scripts)
        makeComponentMethod(script, component);


    if (component.element) {

        const ele_create_method = getGenericMethodNode("ce", "", "return this.me(a);"),

            [, , { nodes: [r_stmt] }] = ele_create_method.nodes;

        r_stmt.nodes[0].nodes[1].nodes[0] = buildExportableDOMNode(component.element);


        const style = buildStyle(component.element, component.stylesheets);

        if (style) {
            re_stmts.push(stmt(`this.setCSS(\`${style}\`)`));

        }

        //Setup element
        component.class_methods.push(ele_create_method);
    }

    // if (component.class_initializer_statements.length > 0)
    component.class_methods.push(register_elements_method);

    //if (component.class_cleanup_statements.length > 0)
    //    component.class_methods.push(cleanup_element_method);

    //component_class.nodes.push(...component.class_methods);

    component.compiled_ast = component_class;

    //Handle API values: warn about API invariant invalidations. If API doesnt exist, enter API 
    //entry 

    for (const variable of [...component.variables.values()].filter(v => v.type == VARIABLE_REFERENCE_TYPE.API_VARIABLE)) {
        //check to see if this API entry is already registered 

        //If any reference is a sign this will invalidate the rule that API interfaces MUST be methods

        for (const node of variable.references) {

            //if (node.type == MinTreeNodeType.AssignmentExpression)
            //    console.log("ERRRRRRRRRRRRRRRRRRRORR");
        }

        const API_ENTRY = {
            name: variable.external_name,
            arg_length: 0,
            returns: false,
            ASYNC: false,
            ASSIGNING: false,
        };

    }

    for (const name of component.names)
        presets.components[name.toUpperCase()] = component;

    presets.components[component.name] = component;

    return component;
}

function createNameHash(string: string) {

    let number = BigInt(0);
    const seed = BigInt(0x2F41118294721DA1);

    for (let i = 0; i < string.length; i++) {
        const val = BigInt(string.charCodeAt(i));

        number = ((val << BigInt(i % 8) ^ seed) << BigInt(i % 64)) ^ (number >> BigInt(i % 4));
    }

    return "W" + number.toString(16);
}