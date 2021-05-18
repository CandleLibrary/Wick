import { bidirectionalTraverse, TraverseState } from "@candlefw/conflagrate";
import { html_void_tags } from "../../common/html.js";
import Presets from "../../common/presets.js";
import { rt } from "../../runtime/global.js";
import { ComponentData } from "../../types/component";
import { TempHTMLNode } from "../../types/html";
import { componentDataToTempAST } from "../compile/html.js";

/**
 * Compile component HTML information (including child component and slot information), into a string containing the components html
 * tree and template html elements for components referenced in containers. 
 * 
 * @param comp 
 * @param presets 
 */
export function componentDataToHTML(
    comp: ComponentData,
    presets: Presets = rt.presets,
): { html: string, template_map: Map<string, TempHTMLNode>; } {

    const { html: [html], template_map } = componentDataToTempAST(comp, presets);

    const html_string = htmlTemplateDataToString(html);

    return { html: html_string, template_map: template_map };
}


/**
 * Return an HTML string from a TempHTMLNode AST object
 */
export function htmlTemplateDataToString(html: TempHTMLNode) {
    for (const { node, meta: { depth, parent, traverse_state } } of bidirectionalTraverse(html, "children")) {

        const depth_str = " ".repeat(depth);

        if (traverse_state == TraverseState.LEAF) {
            if (node.tagName) {
                let string = `<${node.tagName}`;

                for (const [key, val] of node.attributes.entries())
                    if (val === "")
                        string += ` ${key}`;

                    else
                        string += ` ${key}="${val}"`;

                if (html_void_tags.has(node.tagName.toLowerCase()))
                    node.strings.push(string + "/>");
                else
                    node.strings.push(string + `></${node.tagName}>`);

            }
            else
                node.strings.push(...node.data.split("\n"));

            if (parent)
                parent.strings.push(...node.strings.map(s => depth_str + s));
        } else if (traverse_state == TraverseState.ENTER) {
            let string = `<${node.tagName}`;

            for (const [key, val] of node.attributes.entries())
                if (val === "")
                    string += ` ${key}`;

                else
                    string += ` ${key}="${val}"`;

            node.strings.push(string + ">");
        } else {

            node.strings.push(`</${node.tagName}>`);

            if (parent)
                parent.strings.push(...node.strings.map(s => depth_str + s));
        }
    };

    return html.strings.join("\n");
}

