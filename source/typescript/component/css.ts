import { types } from "@candlefw/css";
import { MinTreeNode } from "@candlefw/js";
import { Component } from "../types/types.js";
import Presets from "./presets.js";

import { classSelector } from "@candlefw/css";


export async function processWickCSS_AST(ast: WickASTNode, component: Component, presets: Presets): Promise<MinTreeNode> {

    //Extract style sheet and add to the components stylesheets

    const
        [stylesheet] = ast.nodes,
        { rules } = stylesheet.ruleset;



    for (const rule of rules) {
        for (const selector of rule.selectors) {

            selector.vals.unshift(new classSelector([null, component.name]));

            console.log(selector.toString());

            console.log({ rule, selector });
        }
    }

    component.stylesheets.push(stylesheet);
}