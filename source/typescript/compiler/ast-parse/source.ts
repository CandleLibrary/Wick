import { JSNode, JSNodeType } from "@candlelib/js";
import URL from "@candlelib/uri";
import { BINDING_FLAG, BINDING_VARIABLE_TYPE, ComponentData, HTMLNode, HTMLNodeClass, PresetOptions } from "../../types/all.js";
import { addBindingVariable, processUndefinedBindingVariables } from "../common/binding.js";
import { ComponentDataClass, createComponentData } from "../common/component.js";
import { createParseFrame } from "../common/frame.js";
import { metrics } from '../metrics.js';
import { parse_component } from "../source-code-parse/parse.js";
import { processWickHTML_AST, processWickJS_AST } from "./parse.js";

export const component_cache = {};


function addComponentNamesToPresets(component: ComponentData, presets: PresetOptions) {
    for (const name of component.names)
        presets.named_components.set(name.toUpperCase(), component);
}


function getHTML_AST(ast: HTMLNode | JSNode): HTMLNode {

    while (ast && !(ast.type & HTMLNodeClass.HTML_ELEMENT))
        ast = <any>ast.nodes[0];

    return <any>ast;
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
export async function parseSource(
    input: URL | string,
    presets?: PresetOptions,
    root_url: URL = new URL(URL.GLOBAL + "/")
): Promise<{ IS_NEW: boolean, comp: ComponentDataClass; }> {

    const run_tag = metrics.startRun("Parse Source Input");

    //If this is a node.js environment, make sure URL is able to resolve local files system addresses.
    if (typeof (window) == "undefined") await URL.polyfill();

    let
        source_url: URL = null,
        data: any = empty_obj,
        errors: Error[] = [];

    try {

        let url = new URL(input);

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

        if (url.IS_RELATIVE)
            url = URL.resolveRelative(url, root_url);

        data = await fetchASTFromRemote(url);

        source_url = url;

        if (data.errors.length > 0)
            throw data.errors.pop();

    } catch (e) {


        if (typeof input == "string") {


            //Illegal URL, try parsing string
            try {
                data = await parse_component(<string>input);

                if (data.error)
                    throw data.error;

                source_url = new URL(root_url + "");


            } catch (a) {
                errors.push(e, a);
            }
        } else {
            errors.push(e);
        }

    } finally {
        metrics.endRun(run_tag);
    }

    const {
        string: input_string = input,
        ast = null,
        resolved_url: url = null,
        error: e = null,
        comments = []
    } = data;

    return <Promise<{ IS_NEW: boolean, comp: ComponentDataClass; }>>
        <any>await parseComponentAST(ast,
            <string>input_string,
            source_url,
            presets,
            null,
            errors
        );
};

export async function parseComponentAST(
    ast: HTMLNode | JSNode,
    source_string: string,
    url: URL,
    presets: PresetOptions,
    parent: ComponentData = null,
    parse_errors: Error[] = [],

): Promise<{ IS_NEW: boolean, comp: ComponentDataClass; }> {

    const run_tag = metrics.startRun("Parse Source AST");


    const
        component: ComponentData = createComponentData(source_string, url);

    if (presets.components.has(component.name)) {
        metrics.endRun(run_tag);
        return { IS_NEW: false, comp: presets.components.get(component.name) };
    }

    presets.components.set(component.name, component);

    component.root_frame = createParseFrame(null, component);

    component.comments = [];

    if (parent)
        integrateParentComponentScope(parent, component);

    component.errors.push(...parse_errors);


    if (ast)
        try {

            if (ast && parse_errors.length == 0) {

                const IS_SCRIPT = determineSourceType(ast);

                if (IS_SCRIPT)
                    await processWickJS_AST(<JSNode>ast, component, presets);
                else
                    await processWickHTML_AST(getHTML_AST(ast), component, presets);

                addComponentNamesToPresets(component, presets);

                processUndefinedBindingVariables(component, presets);

                metrics.endRun(run_tag);

            }

        } catch (e) {
            console.error(e);
            component.errors.push(e);
        }

    metrics.endRun(run_tag);

    component.HAS_ERRORS = component.errors.length > 0;

    return { IS_NEW: true, comp: component };
}
function integrateParentComponentScope(
    parent: ComponentData,
    component: ComponentData
) {

    for (const [name, val] of parent.local_component_names.entries())
        component.local_component_names.set(name, val);


    for (const [name, binding] of parent.root_frame.binding_variables) {

        switch (binding.type) {
            case BINDING_VARIABLE_TYPE.MODULE_MEMBER_VARIABLE:
            case BINDING_VARIABLE_TYPE.MODEL_VARIABLE:
            case BINDING_VARIABLE_TYPE.MODULE_NAMESPACE_VARIABLE:
                {
                    addBindingVariable(
                        component.root_frame,
                        binding.internal_name,
                        {},
                        binding.type,
                        binding.external_name,
                        BINDING_FLAG.ALLOW_EXPORT_TO_PARENT | BINDING_FLAG.FROM_PARENT
                    );
                } break;


            case BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE: {
                addBindingVariable(
                    component.root_frame,
                    name,
                    {},
                    BINDING_VARIABLE_TYPE.PARENT_VARIABLE,
                    name,
                    BINDING_FLAG.ALLOW_EXPORT_TO_PARENT | BINDING_FLAG.FROM_PARENT
                );

                binding.flags |= BINDING_FLAG.ALLOW_UPDATE_FROM_CHILD;
            } break;
        }
    }
}

export async function fetchASTFromRemote(url: URL) {

    const
        errors = [];

    let ast = null,
        comments = null,
        string = "";

    if (!url)
        throw new Error("Could not load URL: " + url + "");


    //TODO: Can throw
    try {
        string = <string>await url.fetchText(false);

        // HACK -- if the source data is a css file, then wrap the source string into a <style></style> element string to enable 
        // the wick parser to parser the data correctly. 
        if (url.ext == "css")
            string = `<style>${string}</style>`;

        const { ast: a, comments: c, error } = await parse_component(string, url.toString());

        ast = a;
        comments = c;

        if (error)
            errors.push(error);

    } catch (e) {

        errors.push(e);
    }

    return { ast, string, resolved_url: url.toString(), errors, comments };
}