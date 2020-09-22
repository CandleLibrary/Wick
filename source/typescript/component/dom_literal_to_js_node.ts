import { JSNodeType, JSNode, exp } from "@candlefw/js";
import { DOMLiteral } from "../types/dom_literal";



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
            { type: JSNodeType.StringLiteral, quote_type: "\"", value: val ? sanitizeString(val) : "" }
        ]
    };
}
;


export function DOMLiteralToJSNode(node: DOMLiteral): JSNode {

    const out = {
        type: JSNodeType.ObjectLiteral,
        nodes: [propLiteral("lookup_index", node.lookup_index),],
        pos: node.pos
    };

    if (node.is_bindings)
        out.nodes.push(propString("tag_name", "binding"));
    else if (!node.tag_name)
        out.nodes.push(propString("data", node.data || ""));
    else
        out.nodes.push(propString("tag_name", node.tag_name));

    if (node.children)
        out.nodes.push(propArray("children", node.children.map(DOMLiteralToJSNode)));

    if (node.attributes)
        out.nodes.push(propArray("attributes", node.attributes.map(DOMAttributeToJSNode)));

    if (node.is_container)
        out.nodes.push(propLiteral("is_container", true));

    if (node.component_name)
        out.nodes.push(propString("component_name", node.component_name));

    if (node.component_names)
        out.nodes.push(propArray("component_names", node.component_names.map(n => exp(`"${n}"`))));

    if (node.component_attribs)
        out.nodes.push(propArray("component_attribs", node.component_attribs.map(DOMAttributeToJSNode)));

    if (node.namespace_id)
        out.nodes.push(propLiteral("component_name", node.namespace_id));

    return out;
    <JSNode>{ type: JSNodeType.Identifier, value: `${JSON.stringify(component.HTML)}`, pos: component.HTML.pos };
}
