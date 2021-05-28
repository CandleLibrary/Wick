import { bidirectionalTraverse, TraverseState } from "@candlelib/conflagrate";
import { TraversedNode } from "@candlelib/conflagrate/build/types/types/traversed_node";
import { exp, JSExpressionClass, JSNode, JSNodeType } from "@candlelib/js";
import { rt } from "../../runtime/global.js";
import { ComponentData, TemplateHTMLNode, PresetOptions } from "../../types/all.js";
import { componentDataToTempAST } from "../ast-build/html.js";
import { html_void_tags } from "../common/html.js";


/**
 * Compile component HTML information (including child component and slot information), into a string containing the components html
 * tree and template html elements for components referenced in containers. 
 * 
 * @param comp 
 * @param presets 
 */
export async function componentDataToHTML(
    comp: ComponentData,
    presets: PresetOptions = rt.presets,
): Promise<{ html: string, template_map: Map<string, TemplateHTMLNode>; }> {

    const { html: [html], templates: template_map } = await componentDataToTempAST(comp, presets);

    const html_string = htmlTemplateToString(html);

    return { html: html_string, template_map: template_map };
}

/**
 * Return an HTML string from a TemplateHTMLNode AST object
 */
export function htmlTemplateToString(html: TemplateHTMLNode) {

    html.strings.length = 0;

    for (const { node, meta: { depth, parent, traverse_state } } of bidirectionalTraverse(html, "children")) {

        const depth_str = "    ";

        if (traverse_state == TraverseState.LEAF) {

            node.strings.length = 0;

            if (node.tagName) {

                let string = addAttributesToString(node, `<${node.tagName}`);

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

            node.strings.length = 0;

            let string = "";


            //Null container elements do not enclose their children 
            //elements, but instead are closed before their children
            //are listed. A special null attribute is applied indicating 
            //how many children the container captures. 
            if (node.tagName == "null")
                string = addAttributesToString(node, `<span hidden=true null=${node.children.length}`) + "></span>";
            else
                string = addAttributesToString(node, `<${node.tagName}`) + ">";

            node.strings.push(string);
        } else {
            //Null container elements do not enclose their child elements
            if (node.tagName !== "null")
                node.strings.push(`</${node.tagName}>`);

            if (parent)
                parent.strings.push(...node.strings.map(s => depth_str + s));
        }
    };

    return html.strings.join("\n");
}

function addAttributesToString(node: TraversedNode<TemplateHTMLNode>, string: string) {
    for (const [key, val] of node.attributes.entries())
        if (val === "")
            string += ` ${key}`;
        else
            string += ` ${key}="${val}"`;
    return string;
}


export function htmlTemplateToJSNode(node: TemplateHTMLNode): JSNode {

    const out: JSNode = {
        type: JSNodeType.ObjectLiteral,
        nodes: [],
        //pos: <any>node.pos
    };

    if (!node.tagName)
        out.nodes.push(<any>propString("data", node.data || ""));
    else
        out.nodes.push(<any>propString("tag_name", node.tagName));


    if (node.children) {

        const children_array = [];

        for (const child of node.children) {
            if (child.tagName == "null") {
                children_array.push(nullContainerToJSNode(child));
                children_array.push(...(child.children ?? []).map(htmlTemplateToJSNode));
            } else {
                children_array.push(htmlTemplateToJSNode(child));
            }
        }

        out.nodes.push(<any>propArray("children", children_array));
    }

    if (node.attributes)
        out.nodes.push(<any>propArray("attributes", [...node.attributes.entries()].map(DOMAttributeToJSNode)));

    return out;
}

export function nullContainerToJSNode(node: TemplateHTMLNode): JSNode {

    const out: JSNode = {
        type: JSNodeType.ObjectLiteral,
        nodes: [],
        //pos: node.pos
    };

    out.nodes.push(<any>propString("tag_name", "span"));

    if (node.attributes)
        out.nodes.push(<any>propArray("attributes", [...node.attributes.entries(), ...[["hidden", "true"], ["null", node.children.length]]].map(DOMAttributeToJSNode)));

    return out;
}
function sanitizeString(str: string) {
    return str.replace(/\n/g, "\\n").replace(/"/g, `\\"`);
}

function propLiteral(name: string, val: any) {
    return exp(`({${name}:${val}})`).nodes[0].nodes[0];
}

function propString(name: string, val: string): JSExpressionClass {
    return <JSExpressionClass>exp(`({${name}:"${sanitizeString(val)}"})`).nodes[0].nodes[0];
}

function propArray(name: string, children) {
    const d = exp(`({${name}:[]})`).nodes[0].nodes[0];
    d.nodes[1].nodes = children;
    return d;
}

function DOMAttributeToJSNode([key, val]: [string, string]) {
    return {
        type: JSNodeType.ArrayLiteral,
        nodes: [
            { type: JSNodeType.StringLiteral, quote_type: "\"", value: key },
            { type: JSNodeType.StringLiteral, quote_type: "\"", value: val !== undefined ? sanitizeString(val + "") : "" }
        ]
    };
};