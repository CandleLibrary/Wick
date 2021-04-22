import URL from "@candlefw/url";
import { JSNode, JSNodeType } from "@candlefw/js";

import Presets from "../presets.js";
import parseStringReturnAST from "../parser/parse.js";

import { processWickJS_AST } from "./component_js.js";
import { processWickHTML_AST } from "./component_html.js";

import { ComponentData } from "../types/component_data";
import { HTMLNodeClass, HTMLNode } from "../types/wick_ast_node_types.js";
import { acquireComponentASTFromRemoteSource } from "./component_acquire_remote_source.js";
import { createComponentData, createErrorComponent } from "./component_create_component_data_object.js";
import { createFrame } from "./component_create_frame.js";
import { Comment } from "../types/comment.js";
export const component_cache = {};

function getHTML_AST(ast: HTMLNode | JSNode): HTMLNode {

    while (ast && !(ast.type & HTMLNodeClass.HTML_ELEMENT))
        ast = ast.nodes[0];

    return <HTMLNode>ast;
}

function determineSourceType(ast: HTMLNode | JSNode): boolean {

    if (ast.type == JSNodeType.Script || ast.type == JSNodeType.Module) {
        if (ast.nodes.length > 1) return true;
        if (ast.nodes[0].type != JSNodeType.ExpressionStatement) return true;
        if (!(ast.nodes[0].nodes[0].type & HTMLNodeClass.HTML_ELEMENT)) return true;
    }

    return false;
};

const empty_obj = {};

/**
 * This functions is used to compile a Wick component, which can then be immediately
 * It will accept a string containing wick markup, or a URL that points to a wick component.
 * 
 * @param input {number}
 * @param presets {PresetOptions} - 
 * @param root_url 
 */
export default async function makeComponent(input: URL | string, presets?: Presets, root_url?: URL): Promise<ComponentData> {


    //If this is a node.js environment, make sure URL is able to resolve local files system addresses.
    if (typeof (window) == "undefined") await URL.polyfill();

    let source_url = "";

    let data: any = empty_obj, errors = [];

    try {
        const url = new URL(input);
        //Sloppy tests to see if the input is A URL or not
        if (typeof input == "string") {
            if (
                input.trim[0] == "."
                ||
                url.ext == "wick"
                ||
                url.ext == "html"
                ||
                (url + "").length == input.length
            ) { /* Allow to pass through */ }
            else if (
                input.trim()[0] == "<"
                ||
                input.indexOf("\n") >= 0
            ) throw "input is not a url";
        }

        data = await acquireComponentASTFromRemoteSource(url, root_url);

        source_url = url;

        if (data.errors.length > 0) {
            throw data.errors.pop();
        }



    } catch (e) {

        //Illegal URL, try parsing string
        try {
            data = parseStringReturnAST(<string>input, "");

            if (data.error)
                throw data.error;

            source_url = root_url + "";

        } catch (a) {
            errors.push(e, a);
        }
    }

    const {
        string: input_string = input,
        ast = null,
        resolved_url: url = null,
        error: e = null,
        comments = []
    } = data;

    return await compileComponent(ast, <string>input_string, source_url, presets, errors, comments);
};

export async function compileComponent(
    ast: HTMLNode | JSNode,
    source_string: string,
    url: string,
    presets: Presets,
    parse_errors: Error[] = [],
    comments: Comment[] = [],
): Promise<ComponentData> {

    const
        component: ComponentData = createComponentData(source_string, url);

    component.root_frame = createFrame(null, component);

    component.comments = comments;

    if (ast)
        try {

            if (ast && parse_errors.length == 0) {

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

                if (component.HAS_ERRORS)
                    throw new Error("Component has errors");

                return component;
            }

        } catch (e) {
            parse_errors.push(e, ...(component?.errors ?? []));
        }
    return createErrorComponent(parse_errors, source_string, url, component);

}


