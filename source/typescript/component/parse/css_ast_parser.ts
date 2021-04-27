import { CSSNodeType, CSSNode } from "@candlefw/css";

import { ComponentData } from "../../types/component_data";
import Presets from "../../presets.js";
import { HTMLNode } from "../../types/wick_ast_node_types.js";
import { ComponentStyle } from "../../types/component_style";

export function processWickCSS_AST(ast: HTMLNode, component: ComponentData, presets: Presets, url: string = ""): Promise<void> {
    //Extract style sheet and add to the components stylesheets
    if (url)
        if (presets.styles.has(url)) {
            component.CSS.push(presets.styles.get(url));
            return;
        }

    const [stylesheet] = <CSSNode[]><unknown>ast.nodes,
        style: ComponentStyle = {
            data: stylesheet,
            INLINE: !url,
            location: url
        };
    if (url)
        presets.styles.set(url, style);

    component.CSS.push(style);
}