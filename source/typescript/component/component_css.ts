import { CSSNodeType, CSSNode } from "@candlefw/css";

import { Component } from "../types/types.js";
import Presets from "../presets.js";
import { WickNode } from "../types/wick_ast_node_types.js";

export async function processWickCSS_AST(ast: WickNode, component: Component, presets: Presets): Promise<void> {
    //Extract style sheet and add to the components stylesheets

    const [stylesheet] = <CSSNode[]><unknown>ast.nodes;

    component.CSS.push(stylesheet);
}