import { traverse } from "@candlefw/conflagrate";
import { WickASTNode, WickASTNodeType, WickASTNodeClass, WICK_AST_NODE_TYPE_BASE } from "../types/wick_ast_node_types.js";
import { Component } from "../types/types.js";
import { html_handlers } from "./component_default_html_handlers.js";
import Presets from "../presets.js";
import { DOMLiteral } from "../wick.js";



function buildExportableDOMNode(
    ast: WickASTNode & {
        component_name?: string;
        slot_name?: string;
        data?: any;
        id?: number;
        ns?: number;
        is_container?: boolean;
    }): DOMLiteral {

    const node: DOMLiteral = <DOMLiteral>{ pos: ast.pos };

    node.tag_name = ast.tag || "";

    if (ast.slot_name) {
        node.slot_name = ast.slot_name;
    }

    if (ast.IS_BINDING)
        node.is_bindings = true;

    if (ast.component_name) {
        node.component_name = ast.component_name;
    }

    if (ast.is_container) {
        node.is_container = true;
        node.component_names = ast.component_names;

        if (node.tag_name == "CONTAINER")
            node.tag_name = "DIV";
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

    if (ast.data) {
        node.data = ast.data;

    } else if (ast.ns > 0) {
        node.namespace_id = ast.ns || 0;
    }

    return node;
}

async function loadHTMLImports(ast: WickASTNode, component: Component, presets: Presets) {
    if (ast.import_list)
        for (const import_ of <WickASTNode[]>(ast.import_list)) {
            for (const handler of html_handlers[(WickASTNodeType.HTML_IMPORT >>> 23) - WICK_AST_NODE_TYPE_BASE]) {
                if (! await handler.prepareHTMLNode(import_, ast, import_, 0, () => { }, null, component, presets)) break;
            }
        }
}


export async function processWickHTML_AST(ast: WickASTNode, component: Component, presets: Presets): Promise<WickASTNode> {
    //Process the import list

    //@ts-ignore
    await loadHTMLImports(ast, component, presets);

    //Process the ast and return a node that  
    const receiver = { ast: null },
        attribute_handlers = html_handlers[Math.max((WickASTNodeType.HTMLAttribute >>> 23) - WICK_AST_NODE_TYPE_BASE, 0)];

    let last_element = null, index = -1;

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .makeReplaceable()
        .makeSkippable()
        .extract(receiver)
    ) {

        let html_node = node;

        for (const handler of html_handlers[Math.max((node.type >>> 23) - WICK_AST_NODE_TYPE_BASE, 0)]) {

            const pending = handler.prepareHTMLNode(node, meta.parent, last_element, index, meta.skip, () => { }, component, presets);

            let result = null;

            if (pending instanceof Promise)
                result = await pending;
            else
                result = pending;

            if (result != node) {
                if (result === null || result) {

                    html_node = result;

                    meta.replace(result);

                    if (result === null)
                        continue main_loop;

                } else
                    continue;
            }

            break;
        }

        html_node.id = ++index;

        //Process Attributes of HTML Elements.
        if (html_node.type & WickASTNodeClass.HTML_ELEMENT) {

            last_element = html_node;



            for (const { node: attrib, meta: meta2 } of traverse(html_node, "attributes").skipRoot().makeMutable()) {

                for (const handler of attribute_handlers) {

                    let result = handler.prepareHTMLNode(
                        attrib,
                        meta2.parent,
                        meta2.parent,
                        index, () => { },
                        meta.replace,
                        component,
                        presets
                    );

                    if (result instanceof Promise)
                        result = await result;

                    if (result != html_node) {

                        if (result === null || result) {
                            meta2.mutate(result);
                        } else
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