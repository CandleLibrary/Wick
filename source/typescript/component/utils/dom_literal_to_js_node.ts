import { JSNodeType, JSNode, exp } from "@candlefw/js";
import { DOMLiteral } from "../../types/dom_literal";
import { TempHTMLNode } from "../compile/component_data_to_html";



function sanitizeString(str: string) {
    return str.replace(/\n/g, "\\n").replace(/"/g, `\\"`);
}

function propLiteral(name: string, val: any) {
    return exp(`({${name}:${val}})`).nodes[0].nodes[0];
}

function propString(name: string, val: string) {
    return exp(`({${name}:"${sanitizeString(val)}"})`).nodes[0].nodes[0];
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
}
;


export function DOMLiteralToJSNode(node: TempHTMLNode): JSNode {

    const out = {
        type: JSNodeType.ObjectLiteral,
        nodes: [],
        pos: node.pos
    };

    if (!node.tag)
        out.nodes.push(propString("data", node.data || ""));
    else
        out.nodes.push(propString("tag_name", node.tag));

    if (node.children)
        out.nodes.push(propArray("children", node.children.map(DOMLiteralToJSNode)));

    if (node.attributes)
        out.nodes.push(propArray("attributes", [...node.attributes.entries()].map(DOMAttributeToJSNode)));

    return out;
}
