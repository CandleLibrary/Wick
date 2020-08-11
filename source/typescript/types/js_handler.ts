import { JSNode } from "@candlefw/js";

import { WickASTNode } from "./wick_ast_node_types.js";
import { Component, FunctionFrame } from "./types.js";
import Presets from "../presets.js";

export interface JSHandler {
    priority: number;
    /**
     *
     * If return object is the node argument, the outgoing ast will not be modified in any way.
     *
     * If return object is undefined, the next handler will be selected to process the node. In
     * this event, the returning handler should not modify the node in any way.
     *
    * If return object is null, the node will be removed from the outgoing AST.
    *
     * @param node
     * @param host_node
     * @param host_element_node
     * @param element_index
     * @param skip
     * @param replace_element Available when parsing a nodes attributes. Allows the JSElement node to be replaced or removed.
     * @param component
     * 
     * @async May return a promise that resolves to the givin return types.
     * 
     * @return @type {WickASTNode} | @type {void} | @type {Promise}
     */
    prepareJSNode(
        node: JSNode | WickASTNode,
        parent_node: JSNode | WickASTNode,
        skip: (amount?: number) => void,
        component: Component,
        presets: Presets,
        frame: FunctionFrame
    ):
        JSNode
        | void
        | Promise<JSNode | void>;
}
