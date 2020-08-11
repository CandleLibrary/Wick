import URL from "@candlefw/url";
import { MinTreeNode, MinTreeNodeType } from "@candlefw/js";

import Presets from "../presets.js";
import parseStringReturnAST from "../parser/parser.js";
import { processWickJS_AST } from "./component_js.js";
import { processWickHTML_AST } from "./component_html.js";
import { createNameHash } from "./component_create_hash_name.js";

import { VARIABLE_REFERENCE_TYPE } from "../types/types";
import { PendingBinding } from "../types/binding";
import { Component, } from "../types/types";
import { WickASTNodeClass, WickASTNode } from "../types/wick_ast_node_types.js";
import { createFrame } from "./component_common.js";
import { DOMLiteral } from "../wick.js";
export const component_cache = {};

function getHTML_AST(ast: WickASTNode | MinTreeNode): WickASTNode {

    while (ast && !(ast.type & WickASTNodeClass.HTML_ELEMENT))
        ast = ast.nodes[0];

    return <WickASTNode>ast;
}

function determineSourceType(ast: WickASTNode | MinTreeNode): boolean {

    if (ast.type == MinTreeNodeType.Script || ast.type == MinTreeNodeType.Module) {
        if (ast.nodes.length > 1) return true;
        if (ast.nodes[0].type != MinTreeNodeType.ExpressionStatement) return true;
        if (!(ast.nodes[0].nodes[0].type & WickASTNodeClass.HTML_ELEMENT)) return true;
    }

    return false;
};

export async function acquireComponentASTFromRemoteSource(url_source: URL | string, root_url?: URL) {

    const url = URL.resolveRelative(url_source + "", root_url || URL.GLOBAL),
        error = [];

    let ast = null,
        string = "";

    if (!url)
        throw new Error("Could not load URL: " + url_source + "");

    string = <string>await url.fetchText(false);
    //TODO: Can throw
    try {

        // HACK -- if the source data is a css file, then wrap the source string into a <style></style> element string to enable 
        // the wick parser to parser the data correctly. 

        if (url.ext == "css")
            string = `<style>${string}</style>`;

        ast = parseStringReturnAST(string, url.toString());

    } catch (e) {
        error.push(e);
    }

    return { ast, string, resolved_url: url.toString(), error };
}


/**
 * This functions is used to compile a Wick component, which can then be immediately
 * It will accept a string containing wick markup, or a URL that points to a wick component.
 * 
 * @param input {number}
 * @param presets {PresetOptions} - 
 * @param root_url 
 */
export default async function makeComponent(input: URL | string, presets?: Presets, root_url?: URL): Promise<Component> {

    //If this is a node.js environment, make sure URL is able to resolve local files system addresses.
    if (typeof (window) == "undefined") await URL.polyfill();

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
     * assume the string is a URL and set MIME proceed to fetch data from the URL. If a resource cannot be fetched,
     * we proceed with parsing the string as a wick component. 
     */

    let ast = null, url = input, input_string = input, error = [];

    try {

        const { string, ast: url_ast, resolved_url, error: e }
            = await acquireComponentASTFromRemoteSource(input, root_url);

        ast = url_ast;

        input_string = string;

        url = resolved_url;

        error = e;

    } catch (e) {
        //Illegal URL, try parsing string
        //error.push(e);

        url = "";

        try {
            ast = parseStringReturnAST(<string>input, url);
        } catch (e) {
            error.push(e);
        }
    }


    return await compileComponent(ast, <string>input_string, url, presets, error);
};

export async function compileComponent(
    ast: WickASTNode | MinTreeNode,
    source_string: string,
    url: string,
    presets: Presets,
    error: ExceptionInformation[] = []): Promise<Component> {

    const
        component: Component = createComponent(source_string, url);

    component.root_frame = createFrame(null, false, component);

    try {

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

        const IS_SCRIPT = determineSourceType(ast);

        if (presets.components.has(component.name))
            return presets.components.get(component.name);

        presets.components.set(component.name, component);

        if (IS_SCRIPT)
            await processWickJS_AST(<MinTreeNode>ast, component, presets);
        else
            await processWickHTML_AST(getHTML_AST(ast), component, presets);

        for (const name of component.names)
            presets.named_components.set(name.toUpperCase(), component);

    } catch (e) {
        error.push(e);
    }

    if (error.length > 0)
        return createErrorComponent(error, source_string, url, component);

    return component;
}

export function createErrorComponent(errors: ExceptionInformation[], src: string, location: string, component: Component = createComponent(src, location)) {

    const error_data = [location + "", ...errors
        .flatMap(e => (e + "")
            .split("\n"))
        .map(s => s.replace(/\ /g, "\u00A0"))]
        .map(e => <DOMLiteral>{
            tag_name: "p",
            children: [
                {
                    tag_name: "",
                    data: e
                }
            ]
        });

    component.HTML = {
        tag_name: "ERROR",
        lookup_index: 0,
        attributes: [
            ["style", "font-family:monospace"]
        ],
        children: [
            {
                tag_name: "div",
                children: error_data,
                pos: null
            }
        ],
        pos: null
    };

    component.ERRORS = true;

    return component;
}

export function createComponent(source_string: string, location: string): Component {
    const component: Component = <Component>{
        ERRORS: false,

        source: source_string,

        selector_map: new Map(),

        container_count: 0,

        children: [],

        global_model: "",

        location: new URL(location),

        bindings: [],

        frames: [],

        CSS: [],

        HTML: null,

        names: [],

        name: createNameHash(source_string),

        //OLD STUFFS
        addBinding: (pending_binding: PendingBinding) => component.bindings.push(pending_binding),

        //Local names of imported components that are referenced in HTML expressions. 
        local_component_names: new Map,

        root_frame: null
    };
    return component;
}
