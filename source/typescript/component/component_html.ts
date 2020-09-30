import { traverse } from "@candlefw/conflagrate";
import { HTMLNode, HTMLNodeClass, WICK_AST_NODE_TYPE_BASE, HTMLContainerNode, HTMLNodeType, HTMLTextNode } from "../types/wick_ast_node_types.js";
import { ComponentData } from "../types/component_data";
import { html_handlers } from "./component_default_html_handlers.js";
import Presets from "../presets.js";
import { ContainerDomLiteral, DOMLiteral } from "../types/dom_literal.js";

function buildExportableDOMNode(
    ast: HTMLNode & {
        component_name?: string;
        slot_name?: string;
        data?: any;
        id?: number;
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

        const {
            container_tag,
            component_names,
            component_attributes
        } = <HTMLContainerNode>ast,
            ctr = <ContainerDomLiteral>node;

        ctr.is_container = true;
        ctr.component_names = component_names;
        ctr.component_attribs = component_attributes;
        ctr.tag_name = container_tag ?? "DIV";
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

    node.lookup_index = ast.id;
    node.ele_index = ast.ele_id;

    if (ast.data) {
        node.data = ast.data;

    } else if (ast.name_space > 0) {
        node.namespace_id = ast.name_space || 0;
    }

    return node;
}

async function loadHTMLImports(ast: HTMLNode, component: ComponentData, presets: Presets) {
    if (ast.import_list)
        for (const import_ of <HTMLNode[]>(ast.import_list)) {
            for (const handler of html_handlers[(HTMLNodeType.HTML_IMPORT >>> 23) - WICK_AST_NODE_TYPE_BASE]) {
                if (! await handler.prepareHTMLNode(import_, ast, import_, 0, () => { }, null, component, presets)) break;
            }
        }
}


export async function processWickHTML_AST(ast: HTMLNode, component: ComponentData, presets: Presets): Promise<HTMLNode> {
    //Process the import list

    //@ts-ignore
    await loadHTMLImports(ast, component, presets);

    //Process the ast and return a node that  
    const receiver = { ast: null },
        attribute_handlers = html_handlers[Math.max((HTMLNodeType.HTMLAttribute >>> 23) - WICK_AST_NODE_TYPE_BASE, 0)];

    let last_element = null, ele_index = -1;

    //Remove content-less text nodes.
    for (const { node, meta: { prev, next, mutate } } of traverse(ast, "nodes")
        .makeMutable()
        .filter("type", HTMLNodeType.HTMLText)
    ) {
        if (node.type == HTMLNodeType.HTMLText) {
            const text = <HTMLTextNode>node;

            text.data = (<string>text.data).replace(/[ \n]+/g, " ");

            if (text.data == ' ') {
                if (prev && prev.type == HTMLNodeType.WickBinding
                    && next && next.type == HTMLNodeType.WickBinding)
                    continue;

                mutate(null);
            }
        }
    }

    main_loop:
    for (const { node, meta: { replace, parent, skip } } of traverse(ast, "nodes")
        .makeReplaceable()
        .makeSkippable()
        .extract(receiver)
    ) {

        let html_node = node;


        for (const handler of html_handlers[Math.max((node.type >>> 23) - WICK_AST_NODE_TYPE_BASE, 0)]) {

            const
                pending = handler.prepareHTMLNode(node, parent, last_element, ele_index, skip, () => { }, component, presets),
                result = (pending instanceof Promise) ? await pending : pending;

            if (result != node) {
                if (result === null || result) {

                    html_node = <HTMLNode>result;

                    replace(<HTMLNode>result);

                    if (result === null)
                        continue main_loop;
                } else
                    continue;
            }

            break;
        }

        if (html_node.type & HTMLNodeClass.HTML_ELEMENT || html_node.type == HTMLNodeType.WickBinding)
            html_node.id = ++ele_index;

        //  html_node.id = ++index;


        //Process Attributes of HTML Elements.
        if (html_node.type & HTMLNodeClass.HTML_ELEMENT) {

            last_element = html_node;

            for (const { node: attrib, meta: meta2 } of traverse(html_node, "attributes").skipRoot().makeMutable()) {

                for (const handler of attribute_handlers) {

                    let result = handler.prepareHTMLNode(
                        attrib,
                        meta2.parent,
                        meta2.parent,
                        ele_index,
                        () => { },
                        replace,
                        component,
                        presets
                    );

                    if (result instanceof Promise)
                        result = await result;

                    if (result != html_node) {
                        if (result === null || result)
                            meta2.mutate(<HTMLNode>result);
                        else
                            continue;
                    }

                    break;
                }
            }
        }

        //TODO - Plugin here for analyzing node structure for hinting / warning / errors.
    }


    if (receiver.ast)
        component.HTML = buildExportableDOMNode(receiver.ast);

    return receiver.ast;
}