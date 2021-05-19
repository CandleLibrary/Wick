


import { exp, JSNode, JSNodeType } from "@candlefw/js";
import { ContainerDomLiteral, DOMLiteral, TemplateHTMLNode } from "../types/html";
import { HTMLContainerNode, HTMLNode } from "../types/wick_ast";


export const html_void_tags = new Set([
    "area",
    "base", "br",
    "col", "command",
    "embed",
    "hr",
    "img", "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
]);

export const html_non_void_tags = new Set([
    "a", "abbr", "acronym", "address",
    "b", "bdo", "big", "blockquote", "body", "button",
    "caption", "cite", "code", "colgroup",
    "dd", "del", "dfn", "div", "dl", "dt",
    "em",
    "fieldset", "form",
    "h1", "h2", "h3", "h4", "h5", "h6", "head", "html",
    "i", "import", "ins",
    "kbd",
    "label", "legend", "li",
    "map",
    "noscript", "object", "ol", "optgroup", "option",
    "p", "param", "pre",
    "q",
    "samp", "script", "select", "small", "span", "strong", "style", "sup", "svg",
    "table", "tbody", "td", "text", "textarea", "tfoot", "th", "thead", "title", "tr", "tt",
    "ul",
    "var"
]);

export const html_tags = new Set([...html_non_void_tags.values(), ...html_void_tags.values()]);

export const html_input_types = new Set([
    "button",
    "checkbox",
    "color",
    "date",
    "datetime",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week",
]);

export const html_button_types = new Set([
    "button",
    "reset",
    "submit",
]);

export const html_command_types = new Set([
    "command",
    "radio",
    "checkbox",
]);

export function Is_Tag_From_HTML_Spec(tag_name: string): boolean { return html_tags.has(tag_name.toLowerCase()); }


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
};

export function DOMLiteralToJSNode(node: TemplateHTMLNode): JSNode {

    const out: JSNode = {
        type: JSNodeType.ObjectLiteral,
        nodes: [],
        pos: node.pos
    };

    if (!node.tagName)
        out.nodes.push(propString("data", node.data || ""));
    else
        out.nodes.push(propString("tag_name", node.tagName));

    if (node.children)
        out.nodes.push(propArray("children", node.children.map(DOMLiteralToJSNode)));

    if (node.attributes)
        out.nodes.push(propArray("attributes", [...node.attributes.entries()].map(DOMAttributeToJSNode)));

    return out;
}

export function buildExportableDOMNode(
    ast: HTMLNode & {
        component_name?: string;
        slot_name?: string;
        data?: any;
        id?: number;
        ele_id?: number;
        name_space?: number;
    }): DOMLiteral {

    const node: DOMLiteral = <DOMLiteral>{ pos: ast.pos };

    node.tag_name = ast.tag || "";

    if (ast.slot_name)
        node.slot_name = ast.slot_name;


    if (ast.IS_BINDING)
        node.is_bindings = true;

    if (ast.component_name)
        node.component_name = ast.component_name;


    if (ast.is_container) {

        const
            ctr = <ContainerDomLiteral>node,
            ctr_ast = <HTMLContainerNode>ast;

        ctr.is_container = true;
        ctr.component_names = ctr_ast.component_names;
        ctr.container_id = ctr_ast.container_id;
        ctr.component_attribs = ctr_ast.component_attributes;

        if (ctr.tag_name == "CONTAINER")
            ctr.tag_name = "DIV";
    }

    if (ast.attributes && ast.attributes.length > 0) {

        node.attributes = [];

        for (const attrib of ast.attributes)
            node.attributes.push([attrib.name, attrib.value]);

    }

    /***
     * DOM
     */

    if (ast.nodes && ast.nodes.length > 0) {
        node.children = [];
        for (const child of ast.nodes)
            node.children.push(buildExportableDOMNode(child));
    }

    node.element_index = ast.id;

    if (ast.data) {
        node.data = ast.data;

    } else if (ast.name_space > 0) {
        node.namespace_id = ast.name_space || 0;
    }

    node.comp = ast.comp;

    return node;
}