import { MinTreeNode, MinTreeNodeType, ext } from "@candlefw/js";
import { traverse } from "@candlefw/conflagrate";
import { WickASTNode, WickASTNodeType, WickASTNodeClass, WICK_AST_NODE_TYPE_SIZE, WICK_AST_NODE_TYPE_BASE } from "../types/wick_ast_node_types.js";
import { Component } from "../types/types.js";
import { html_handlers } from "./default_html_handlers.js";
import Presets from "./presets.js";
import { getPropertyAST, getGenericMethodNode, getObjectLiteralAST } from "./js_ast_tools.js";

export async function processWickHTML_AST(ast: WickASTNode, component: Component, presets: Presets): Promise<WickASTNode> {

    //Process the ast and return a node that  
    const receiver = { ast: null },
        attribute_handlers = html_handlers[Math.max((WickASTNodeType.HTMLAttribute >>> 24) - WICK_AST_NODE_TYPE_BASE, 0)];

    let types = [], last_element = null, index = -1;

    main_loop:
    for (const { node, meta } of traverse(ast, "nodes")
        .makeReplaceable()
        .makeSkippable()
        .extract(receiver)
    ) {

        let html_node = node;

        for (const handler of html_handlers[Math.max((node.type >>> 24) - WICK_AST_NODE_TYPE_BASE, 0)]) {

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

                    if (result === null) {

                        if (node.type & WickASTNodeClass.HTML_NODE)
                            index--;

                        continue main_loop;
                    }

                } else
                    continue;
            }

            break;
        }

        //Process Attributes of HTML Elements.
        if (html_node.type & WickASTNodeClass.HTML_NODE) {

            last_element = html_node;

            html_node.id = ++index;

            for (const { node: attrib, meta: meta2 } of traverse(html_node, "attributes").skipRoot().makeMutable()) {

                for (const handler of attribute_handlers) {

                    let result = handler.prepareHTMLNode(attrib, meta2.parent, meta2.parent, index, () => { }, meta.replace, component, presets);

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

    component.HTML = buildExportableDOMNode(receiver.ast);

    return receiver.ast;
}




function buildExportableDOMNode(
    ast: WickASTNode & {
        component_name?: string;
        slot_name?: string;
    }) {

    const node = {};

    node.t = ast.tag || "";

    if (ast.slot_name) {
        node.sl = slot_name;
    }

    if (ast.component_name) {
        node.cp = ast.component_name;
    }

    if (ast.is_container) {
        node.ct = true;
    }

    if (ast.attributes && ast.attributes.length > 0) {
        node.a = [];

        for (const attrib of ast.attributes)
            node.a.push(attrib.name, attrib.value);

    }

    /***
     * DOM
     */

    if (ast.nodes && ast.nodes.length > 0) {
        node.c = [];
        for (const child of ast.nodes)
            node.c.push(buildExportableDOMNode(child));
    }

    node.i = ast.id;

    if (ast.data) {
        node.d = ast.data;//.replace(/\n/g, '\\n');
    } else if (ast.ns > 0) {
        node.ns = ast.ns || 0;
    }

    return node;
}