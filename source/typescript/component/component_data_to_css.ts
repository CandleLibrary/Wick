import { CSSNodeType, selector, CSSNode } from "@candlefw/css";
import { traverse } from "@candlefw/conflagrate";
import { renderWithFormatting } from "../render/render.js";
import { Component } from "../wick.js";

export function UpdateSelector(node: CSSNode, name) {

    const class_selector = selector(`.${name}`);

    node.selectors = node.selectors.map(s => {

        let HAS_ROOT = false;
        const ns = { ast: null };

        for (const { node, meta: { replace } } of traverse(s, "nodes")
            .makeReplaceable()
            .extract(ns)
        ) {

            switch (node.type) {
                case CSSNodeType.TypeSelector:
                    const val = node.nodes[0].val;
                    if (val == "root") {
                        replace(Object.assign({}, class_selector, { pos: node.pos, nodes: [] }));
                        HAS_ROOT = true;
                    } else if (val == "body") {
                        HAS_ROOT = true;
                    }
                default:
                    break;
            }
        }

        if (!HAS_ROOT) {
            const ns = selector(`.${name} ${renderWithFormatting(s)}`);
            ns.pos = s.pos;
            return ns;
        }

        return ns.ast;
    });

}

export function componentDataToCSS(component: Component): string {
    // Get all css data from component and it's children,
    // Include pure CSS components (components that only have CSS data),
    // in the main components context.




    const css_string = component.CSS.map(css => {
        const r = { ast: null };

        for (const { node, meta: { replace } } of traverse(css, "nodes", 2)
            .makeReplaceable()
            .extract(r)
        ) {
            switch (node.type) {
                case CSSNodeType.Rule: {
                    const copy = Object.assign({}, node);
                    UpdateSelector(copy, component.name);
                    replace(copy);
                } break;
                case CSSNodeType.Media: {
                    const copy = Object.assign({}, node);
                    copy.nodes.slice(1).forEach(n => UpdateSelector(n, component.name));
                    replace(copy);
                } break;

            }
        }

        return <CSSNode>r.ast;
    }).map(_ => renderWithFormatting(_)).join("\n");


    return css_string;
}
