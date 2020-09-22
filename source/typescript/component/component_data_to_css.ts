import { CSSNodeType, selector, CSSNode } from "@candlefw/css";
import { traverse } from "@candlefw/conflagrate";
import { renderWithFormatting } from "../render/render.js";
import { ComponentData } from "../types/component_data.js";


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

export function componentToMutatedCSS(component: ComponentData): CSSNode[] {
    return component.CSS.map(css => {
        const r = { ast: null };

        for (const { node, meta: { replace } } of traverse(css, "nodes")
            .filter("type", CSSNodeType.Rule)
            .makeReplaceable()
            .extract(r)
        ) {
            const copy = Object.assign({}, node);
            UpdateSelector(copy, component.name);
            replace(copy);
        }

        return <CSSNode>r.ast;
    });
}

export function componentDataToCSS(component: ComponentData): string {

    // Get all css data from component and it's children,
    // Include pure CSS components (components that only have CSS data),
    // in the main components context.

    return componentToMutatedCSS(component)
        .map(_ => _ ? renderWithFormatting(_) : "")
        .join("\n");
}
