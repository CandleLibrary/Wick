import { MinTreeNode } from "@candlefw/js";
import { Component } from "../types/types.js";
import Presets from "./presets.js";


export async function processWickCSS_AST(ast: WickASTNode, component: Component, presets: Presets): Promise<MinTreeNode> {

    //Extract style sheet and add to the components stylesheets

    const [stylesheet] = ast.nodes;

    component.stylesheets.push(stylesheet);

}