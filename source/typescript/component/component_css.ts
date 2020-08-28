import { CSSNodeType, CSSNode } from "@candlefw/css";

import { ComponentData } from "../types/types.js";
import Presets from "../presets.js";
import { HTMLNode } from "../types/wick_ast_node_types.js";

export async function processWickCSS_AST(ast: HTMLNode, component: ComponentData, presets: Presets): Promise<void> {
    //Extract style sheet and add to the components stylesheets

    const [stylesheet] = <CSSNode[]><unknown>ast.nodes;

    component.CSS.push(stylesheet);
}