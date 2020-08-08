import { CSSTreeNodeType, CSSTreeNode } from "@candlefw/css";

import { Component } from "../types/types.js";
import Presets from "../presets.js";
import { WickASTNode } from "../types/wick_ast_node_types.js";

export async function processWickCSS_AST(ast: WickASTNode, component: Component, presets: Presets): Promise<void> {
    //Extract style sheet and add to the components stylesheets

    const [stylesheet] = <CSSTreeNode[]><unknown>ast.nodes;

    component.CSS.push(stylesheet);
}