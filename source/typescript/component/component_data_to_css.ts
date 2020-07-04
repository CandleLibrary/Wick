import { render, CSSTreeNodeType, selector, SelectionHelpers } from "@candlefw/css";
import { traverse } from "@candlefw/conflagrate";

import parser from "../parser/parser.js";

function UpdateSelector(node, name) {
    const class_selector = selector(`.${name}`).nodes[0].nodes[0];

    node.selectors.map(s => {

        let HAS_ROOT = false;

        const [type] = s.nodes[0].nodes;

        if (type.type == CSSTreeNodeType.TypeSelector && type.nodes[0].val == "root") {
            HAS_ROOT = true;
            s.nodes[0].nodes[0] = class_selector;
        } else if (type.type == CSSTreeNodeType.TypeSelector && type.nodes[0].val == "body") {
            HAS_ROOT = true;
        } if (!HAS_ROOT)
            s.nodes.unshift(class_selector);
    });
}

export function componentDataToCSS(component): string {

    const cloned_stylesheets = component.CSS.map(s => parser(`<style>${render(s)}</style>`).nodes[0]);

    for (const stylesheet of cloned_stylesheets) {

        for (const { node, meta } of traverse(stylesheet, "nodes", 2)) {
            switch (node.type) {
                case CSSTreeNodeType.Rule: UpdateSelector(node, component.name); break;
                case CSSTreeNodeType.Media:
                    node.nodes.slice(1).forEach(n => UpdateSelector(n, component.name)); break;
            }
        }
    }

    return cloned_stylesheets.map(render).join("\n");
}
