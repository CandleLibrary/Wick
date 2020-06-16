import { types } from "@candlefw/css";
import { MinTreeNode } from "@candlefw/js";
import { Component } from "../types/types.js";
import Presets from "./presets.js";




export async function processWickCSS_AST(ast: WickASTNode, component: Component, presets: Presets): Promise<void> {
    //Extract style sheet and add to the components stylesheets
    component.CSS.push(ast.nodes[0]);
}