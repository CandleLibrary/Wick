import { exp, JSExpressionStatement, JSIdentifier, JSNode, renderCompressed, stmt } from "@candlelib/js";
import { BINDING_VARIABLE_TYPE, ComponentData, ContainerDomLiteral, HTMLNodeType } from "../../../types/all.js";
import { registerHookHandler } from "./hook-handler.js";
import { getExtendTypeVal, getOriginalTypeOfExtendedType } from "../../common/extended_types.js";
import { getElementAtIndex } from "../../common/html.js";
import { Expression_Is_Static, getComponentBinding, getStaticValue } from "../../common/binding.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../../common/js_hook_types.js";
import { IndirectHook } from "source/typescript/types/hook.js";
import { traverse } from "@candlelib/conflagrate";

//#############################################################################
// CONTAINER
/**
 * Hook Type for Container Data Attributes
 */

export const ContainerDataHook = getExtendTypeVal("container-data-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<IndirectHook<JSNode> | JSNode, void>({
    name: "Container Data Attribute",

    types: [ContainerDataHook],

    verify: () => true,

    buildJS: (node, comp, presets, element_index, addOnBindingUpdate) => {

        const
            ele = getElementAtIndex(comp, element_index),

            st = <JSExpressionStatement>stmt(`$$ctr${ele.container_id}.sd(0)`);

        st.nodes[0].nodes[1].nodes = node.nodes;

        addOnBindingUpdate(st);

        return node;
    },

    buildHTML: async (hook, comp, presets, model, parent_components) => {

        const container_ele: ContainerDomLiteral = <any>getElementAtIndex(comp, hook.ele_index);

        if (Expression_Is_Static(<JSNode>hook.nodes[0], comp, presets, parent_components)
            &&
            container_ele.component_names.length > 0) {

            const

                comp_name = container_ele.component_names[0];

            return await getStaticValue(hook, comp, presets, model, parent_components);
        }

        return [];
    }
});

export const ContainerFilterHook = getExtendTypeVal("container-filter-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier, void>({
    description: ``,

    name: "Container Filter Hook",

    types: [ContainerFilterHook],

    verify: () => true,

    buildJS: (node, comp, presets, index, write, _1, _2) => {

        const container_id = getElementAtIndex(comp, index).container_id;

        let arrow_argument_match = [null];

        if (getListOfUnboundArgs(node, comp, arrow_argument_match)) {

            const arrow_expression_stmt = stmt(`$$ctr${container_id}.setFilter(${arrow_argument_match[0].value} => 1)`);

            arrow_expression_stmt.nodes[0].nodes[1].nodes[0].nodes[1] = node.nodes[0];

            write(arrow_expression_stmt);
        }
    },

    buildHTML: (filter_hook: IndirectHook<JSNode>, component, presets, model, parent_components) => {

        if (Expression_Is_Static(filter_hook.nodes[0], component, presets, false)) {

            let arrow_argument_match = [null];

            if (getListOfUnboundArgs(filter_hook.nodes[0], component, arrow_argument_match)) {

                const arrow_expression_stmt = exp(`${arrow_argument_match[0].value} => 1`);

                arrow_expression_stmt.nodes[1] = filter_hook.nodes[0];

                try {
                    return eval(renderCompressed(arrow_expression_stmt));
                } catch (e) {
                    console.log(e);
                }
            }
        }

        return null;
    }
});
export const ContainerSortHook = getExtendTypeVal("container-sort-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier, void>({
    description: ``,

    name: "Container Sort Hook",

    types: [ContainerSortHook],

    verify: () => true,

    buildJS: (node, comp, presets, index, write, _1, _2) => {

        const container_id = getElementAtIndex(comp, index).container_id;

        let arrow_argument_match = [null, null];

        if (getListOfUnboundArgs(node, comp, arrow_argument_match)) {

            const arrow_expression_stmt = stmt(`$$ctr${container_id}.setSort((${arrow_argument_match.map(v => v.value)}) => 1)`);

            arrow_expression_stmt.nodes[0].nodes[1].nodes[0].nodes[1] = node.nodes[0];

            write(arrow_expression_stmt);
        }
    },

    buildHTML: (filter_hook: IndirectHook<JSNode>, component, presets, model, parent_components) => {

        if (Expression_Is_Static(filter_hook.nodes[0], component, presets, false)) {

            let arrow_argument_match = [null, null];

            if (getListOfUnboundArgs(filter_hook.nodes[0], component, arrow_argument_match)) {

                const arrow_expression_stmt = exp(`(${arrow_argument_match.map(v => v.value)}) => 1`);

                arrow_expression_stmt.nodes[1] = filter_hook.nodes[0];
                console.log(renderCompressed(arrow_expression_stmt));

                try {
                    return eval(renderCompressed(arrow_expression_stmt));
                } catch (e) {
                    console.log(e);
                }
            }
        }

        return null;
    }
});

export const ContainerLimitHook = getExtendTypeVal("container-limit-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier, void>({
    description: ``,

    name: "Container limit Hook",

    types: [ContainerLimitHook],

    verify: () => true,

    buildJS: (node, comp, presets, index, write, _1, _2) => {

        const container_id = getElementAtIndex(comp, index).container_id;

        const expression = stmt(`$$ctr${container_id}.updateLimit()`);

        expression.nodes[0].nodes[1].nodes[0] = node.nodes[0];

        write(expression);
    },

    buildHTML: (filter_hook: IndirectHook<JSNode>, component, presets, model, parent_components) => {

        if (Expression_Is_Static(filter_hook.nodes[0], component, presets, false)) {
            try {
                return eval(renderCompressed(filter_hook.nodes[0]));
            } catch (e) {
                console.log(e);
            }

        }
    }
});

export const ContainerOffsetHook = getExtendTypeVal("container-offset-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier, void>({
    description: ``,

    name: "Container Offset Hook",

    types: [ContainerOffsetHook],

    verify: () => true,

    buildJS: (node, comp, presets, index, write, _1, _2) => {

        const container_id = getElementAtIndex(comp, index).container_id;

        const expression = stmt(`$$ctr${container_id}.updateOffset()`);

        expression.nodes[0].nodes[1].nodes[0] = node.nodes[0];

        write(expression);
    },

    buildHTML: (filter_hook: IndirectHook<JSNode>, component, presets, model, parent_components) => {

        if (Expression_Is_Static(filter_hook.nodes[0], component, presets, false)) {
            try {
                return eval(renderCompressed(filter_hook.nodes[0]));
            } catch (e) {
                console.log(e);
            }
        }
    }
});

export const ContainerShiftHook = getExtendTypeVal("container-shift-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier, void>({
    description: ``,

    name: "Container Shift Hook",

    types: [ContainerShiftHook],

    verify: () => true,

    buildJS: (node, comp, presets, index, write, _1, _2) => {

        const container_id = getElementAtIndex(comp, index).container_id;

        const expression = stmt(`$$ctr${container_id}.updateShift()`);

        expression.nodes[0].nodes[1].nodes[0] = node.nodes[0];

        write(expression);
    },

    buildHTML: (filter_hook: IndirectHook<JSNode>, component, presets, model, parent_components) => {

        if (Expression_Is_Static(filter_hook.nodes[0], component, presets, false)) {
            try {
                return eval(renderCompressed(filter_hook.nodes[0]));
            } catch (e) {
                console.log(e);
            }
        }
    }
});

export const ContainerScrubHook = getExtendTypeVal("container-scrub-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier, void>({
    description: ``,

    name: "Container Scrub Hook",

    types: [ContainerScrubHook],

    verify: () => true,

    buildJS: (node, comp, presets, index, write, _1, _2) => {

        const container_id = getElementAtIndex(comp, index).container_id;

        const arrow_expression_stmt = stmt(`$$ctr${container_id}.updateScrub()`);

        arrow_expression_stmt.nodes[0].nodes[1].nodes[0] = node.nodes[0];

        write(arrow_expression_stmt);
    },

    buildHTML: () => null
});
/**
 * Searches for N Undeclared binding references, where N is the number of entries in list.
 * Upon finding matches, converts the types of reference nodes  back to their original values.
 * Found nodes are assigned to the list at an index respective of the order the node was found
 * in. If the number of found nodes is less then the number of entries in list, then false
 * is returned, true otherwise.
 *
 * @param node
 * @param comp
 * @param list
 * @returns
 */
function getListOfUnboundArgs(node: JSNode, comp: ComponentData, list: JSNode[]): boolean {

    let index = 0;

    let active_names = new Set();

    for (const { node: n } of traverse(node, "nodes")
        .filter("type", BindingIdentifierBinding, BindingIdentifierReference)) {
        const
            name = n.value,
            binding = getComponentBinding(name, comp);

        if (binding.type == BINDING_VARIABLE_TYPE.UNDECLARED) {

            n.type = getOriginalTypeOfExtendedType(n.type);

            if (!active_names.has(name)) {
                active_names.add(name);
                list[index] = n;
                if (++index == list.length)
                    return true;
            }
        }
    }

    return false;
}
