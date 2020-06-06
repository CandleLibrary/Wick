import URL from "@candlefw/url";
import { MinTreeNodeType, exp, stmt, ext } from "@candlefw/js";
import { traverse, renderWithFormatting } from "@candlefw/conflagrate";

import Presets from "./presets.js";
import CompiledWickAST, { WickASTNode, WickASTNodeType } from "../types/wick_ast_node_types.js";
import { WickComponentErrorStore, WickComponentErrorCode } from "../types/errors.js";
import { processBindings } from "./process_bindings.js";
import { Component, } from "../types/types";
import { getPropertyAST, getGenericMethodNode, getObjectLiteralAST } from "./js_ast_tools.js";
import { renderers, format_rules } from "../format_rules.js";
import { setVariableName, VARIABLE_REFERENCE_TYPE } from "./set_component_variable.js";
import { processWickAST } from "./process_wick_ast.js";
import { componentASTToClass } from "../runtime/component_class.js";
import parser from "../parser/parser.js";
import { classSelector } from "@candlefw/css";

interface WickComponentProducer {
    /**
     * True when compilation on the component has completed and it is
     * ready to produce DOM elements. 
     */
    IS_READY: boolean;
    /**
     * The underlying abstract syntax tree that defines the component.
     */
    AST: CompiledWickAST;
    /**
     * A URL pointing to the original location of the component. Can be
     * the same as the webpage or working directory if a string was passed
     * to MakeComponent function.
     */
    URL: URL;
    /**
     * {WickComponentErrorStore}
     */
    errors: WickComponentErrorStore;
}

export function parseStringAndCreateWickAST(wick_string: string) {

    let ast = null;
    /**
     * We are now assuming that the input has been converted to a string containing wick markup. 
     * We'll let the parser handle any syntax errors.
     */
    try {
        ast = parser(wick_string);
    } catch (e) {

        /** 
         * Since we were unable to process the input we'll create an error ast that can be used to generate
         * an error report component. 
         */
        ast = <WickASTNode>{
            type: WickASTNodeType.ERROR, nodes: [{
                message: `Failed to parse wick component`,
                ref: WickComponentErrorCode.SYNTAX_ERROR_DURING_PARSE,
                error_object: e instanceof Error ? e : null,
                URL: url,
            }]
        };
    }

    return ast;
}

export async function acquireComponentASTFromRemoteSource(url_source: URL | string, root_url?: URL) {

    const url = URL.resolveRelative(url_source + "", root_url || URL.GLOBAL);

    let string = "";

    if (!url)
        throw new Error("Could not load URL: " + url_source + "");

    //TODO: Can throw
    try {
        string = <string>await url.fetchText(false);
    } catch (e) {
        throw e;
    }

    return { ast: parseStringAndCreateWickAST(string), string, resolved_url: url.toString() };
}


/**
 * This functions is used to compile a Wick component, which can then be immediately
 * It will accept a string containing wick markup, or a URL that points to a wick component.
 * 
 * @param input {number}
 * @param presets {PresetOptions} - 
 * @param root_url 
 */
export default async function makeComponent(input: URL | string, presets?: Presets, root_url?: URL): Promise<WickComponentProducer> {

    //If this is a node.js environement, make sure URL is able to resolve local files system addresses.
    if (typeof (window) == "undefined") await URL.polyfill();

    const error_store = <WickComponentErrorStore>{ errors: [] };

    let wick_syntax_string = <string>input;

    /**
     * If a string has been passed the we need to determine if it is a wick component
     * or a URL. The naive way to do this is to check to see if the leading character
     * is [ < ], since an HTML wick component must begin with an HTML tag. This will
     * only work if the string does not have leading spaces, and does not allow for other
     * wick component syntax forms that may be implemented. The inverse of this would
     * be to check for the protocol portion of a URL at the beginning of the string; however,
     * if we allow relative URL paths then this would not catch such forms.
     * 
     * Another way to test for URLiness is to check for white spaces, since well formatted 
     * URLs do not have whitespace characters. This does require scanning the entire string
     * to ensure that there are no whitespace characters within. It also does not take into account
     * possible HTML syntax that does not yield whitespace characters, such as `<div>no-white-space</div>`.
     * 
     * For now, a brute force method will be to use the URL constructor parse the input string. We test for the 
     * presence of a hostname and/or path on the result, and if the string yields values for these, we
     * assume the string is a URL and proceed to fetch data from the URL. If a resource cannot be fetched,
     * we proceed with parsing the string as a wick component. 
     */

    let ast = null, url = input, input_string = input;

    try {

        const { string, ast: url_ast, resolved_url } = await acquireComponentASTFromRemoteSource(input, root_url);

        ast = url_ast;

        input_string = string;

        url = resolved_url;

    } catch (e) {

        console.log(e);

        try {
            url = "";
            ast = parseStringAndCreateWickAST(<string>input);
        } catch (e) {
            throw e;
        }
    }

    return await CreateComponent(ast, input_string, url, presets);
};

export async function CreateComponent(raw_ast, source_string, source_url, presets): Promise<WickComponentProducer> {
    try {

        const
            component_data = <Component>(await processWickAST(raw_ast, source_string, presets, source_url)),

            processed_component = await compileComponent(component_data, presets);

        processed_component.toString = function () { return renderWithFormatting(processed_component.compiled_ast, renderers, format_rules); };

        processed_component.toClass = function () {
            return componentASTToClass(processed_component);
        };

        return processed_component;

    } catch (e) {
        throw e;
    }
}

export async function compileComponent(component: Component, presets: Presets): Component {

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


        const style = buildStyle(component, component.stylesheets);

        if (style)
            re_stmts.push(stmt(`this.setCSS(\`${style}\`)`));

        //Setup element
        component.class_methods.push(ele_create_method);
    }

    component.class_methods.push(register_elements_method);

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



function buildStyle(component, stylesheets): string {

    for (const stylesheet of stylesheets) {

        const { rules } = stylesheet.ruleset;

        for (const rule of rules) {
            for (const selector of rule.selectors) {

                if (selector.vals[0].val == "root")
                    selector.vals.shift();

                selector.vals.unshift(new classSelector([null, component.name]));
            }
        }
    }

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