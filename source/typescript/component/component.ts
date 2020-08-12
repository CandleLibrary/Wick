import URL from "@candlefw/url";
import { JSNode, JSNodeType } from "@candlefw/js";

import Presets from "../presets.js";
import parseStringReturnAST from "../parser/parse.js";

import { processWickJS_AST } from "./component_js.js";
import { processWickHTML_AST } from "./component_html.js";

import { Component, } from "../types/types";
import { WickNodeClass, WickNode } from "../types/wick_ast_node_types.js";
import { acquireComponentASTFromRemoteSource } from "./component_acquire_ast.js";
import { createComponent, createErrorComponent } from "./component_create_component.js";
import { createFrame } from "./component_create_frame.js";
export const component_cache = {};

function getHTML_AST(ast: WickNode | JSNode): WickNode {

    while (ast && !(ast.type & WickNodeClass.HTML_ELEMENT))
        ast = ast.nodes[0];

    return <WickNode>ast;
}

function determineSourceType(ast: WickNode | JSNode): boolean {

    if (ast.type == JSNodeType.Script || ast.type == JSNodeType.Module) {
        if (ast.nodes.length > 1) return true;
        if (ast.nodes[0].type != JSNodeType.ExpressionStatement) return true;
        if (!(ast.nodes[0].nodes[0].type & WickNodeClass.HTML_ELEMENT)) return true;
    }

    return false;
};

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
    ast: WickNode | JSNode,
    source_string: string,
    url: string,
    presets: Presets,
    error: ExceptionInformation[] = []): Promise<Component> {

    const
        component: Component = createComponent(source_string, url);

    component.root_frame = createFrame(null, false, component);

    try {

        const IS_SCRIPT = determineSourceType(ast);

        if (presets.components.has(component.name))
            return presets.components.get(component.name);

        presets.components.set(component.name, component);

        if (IS_SCRIPT)
            await processWickJS_AST(<JSNode>ast, component, presets);
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


