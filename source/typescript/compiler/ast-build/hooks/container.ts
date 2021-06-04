import { traverse } from "@candlelib/conflagrate";
import { exp, JSExpressionStatement, JSIdentifier, JSNode, renderCompressed, stmt } from "@candlelib/js";
import { IndirectHook } from "source/typescript/types/hook.js";
import { BINDING_VARIABLE_TYPE, ComponentData, ContainerDomLiteral, HTMLNodeType, STATIC_RESOLUTION_TYPE } from "../../../types/all.js";
import { getComponentBinding, getExpressionStaticResolutionType, getStaticValue, getStaticValueAstFromSourceAST } from "../../common/binding.js";
import { getExtendTypeVal, getOriginalTypeOfExtendedType } from "../../common/extended_types.js";
import { getElementAtIndex } from "../../common/html.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../../common/js_hook_types.js";
import { registerHookHandler } from "./hook-handler.js";

//#############################################################################
// CONTAINER
/**
 * Hook Type for Container Data Attributes
 */

export const ContainerDataHook = getExtendTypeVal("container-data-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<IndirectHook<JSNode>, void | JSNode>({
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

    buildHTML: async (hook, comp, presets, model, parents) => {
        const ast = hook.nodes[0];
        const container_ele: ContainerDomLiteral = <any>getElementAtIndex(comp, hook.ele_index);

        if (
            getExpressionStaticResolutionType(<JSNode>hook.nodes[0], comp, presets)
            !==
            STATIC_RESOLUTION_TYPE.INVALID
            &&
            container_ele.component_names.length > 0
        ) {
            return await getStaticValue(hook.nodes[0], comp, presets, model, parents);
        }

        return [];
    }
});

export const ContainerFilterHook = getExtendTypeVal("container-filter-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier | any, void>({
    description: ``,

    name: "Container Filter Hook",

    types: [ContainerFilterHook],

    verify: () => true,

    buildJS: createContainerDynamicArrowCall(1, "setFilter"),

    buildHTML: createContainerStaticArrowFunction(1)
});

export const ContainerSortHook = getExtendTypeVal("container-sort-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier | any, void>({
    description: ``,

    name: "Container Sort Hook",

    types: [ContainerSortHook],

    verify: () => true,

    buildJS: createContainerDynamicArrowCall(2, "setSort"),

    buildHTML: createContainerStaticArrowFunction(2)
});

export const ContainerLimitHook = getExtendTypeVal("container-limit-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier | any, void>({
    description: ``,

    name: "Container limit Hook",

    types: [ContainerLimitHook],

    verify: () => true,

    buildJS: createContainerDynamicValue("updateLimit"),

    buildHTML: createContainerStaticValue
});

export const ContainerOffsetHook = getExtendTypeVal("container-offset-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier | any, void>({

    description: ``,

    name: "Container Offset Hook",

    types: [ContainerOffsetHook],

    verify: () => true,

    buildJS: createContainerDynamicValue("updateOffset"),

    buildHTML: createContainerStaticValue
});

export const ContainerShiftHook = getExtendTypeVal("container-shift-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier | any, void>({

    description: ``,

    name: "Container Shift Hook",

    types: [ContainerShiftHook],

    verify: () => true,

    buildJS: createContainerDynamicValue("updateShift"),

    buildHTML: createContainerStaticValue
});

export const ContainerScrubHook = getExtendTypeVal("container-scrub-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<JSNode | JSIdentifier | any, void>({

    description: ``,

    name: "Container Scrub Hook",

    types: [ContainerScrubHook],

    verify: () => true,

    buildJS: createContainerDynamicValue("updateScrub"),
    // Scrub has no meaning in a static context, as it requires variable input from 
    // user actions to work. 
    buildHTML: () => null
});

function createContainerDynamicValue(container_method_name: string) {

    return function (node, comp, presets, index, write, _1, _2) {

        const container_id = getElementAtIndex(comp, index).container_id;

        const arrow_expression_stmt = stmt(`$$ctr${container_id}.${container_method_name}()`);

        arrow_expression_stmt.nodes[0].nodes[1].nodes[0] = node.nodes[0];

        write(arrow_expression_stmt);
    };
}

async function createContainerStaticValue(hook: IndirectHook<JSNode>, comp, presets, model, parents) {

    if (getExpressionStaticResolutionType(hook.nodes[0], comp, presets) == STATIC_RESOLUTION_TYPE.CONSTANT_STATIC) {

        const ast = await getStaticValueAstFromSourceAST(hook.nodes[0], comp, presets, model, parents, false);

        try {
            return eval(renderCompressed(<JSNode>ast));
        } catch (e) { }
    }
};

function createContainerDynamicArrowCall(argument_size: number, container_method_name: string) {
    return function (node, comp, presets, index, write, _1, _2) {

        const container_id = getElementAtIndex(comp, index).container_id;

        let arrow_argument_match = new Array(argument_size).fill(null);

        if (getListOfUnboundArgs(node, comp, arrow_argument_match)) {

            const arrow_expression_stmt = stmt(`$$ctr${container_id}.${container_method_name}(${arrow_argument_match[0].value} => 1)`);

            arrow_expression_stmt.nodes[0].nodes[1].nodes[0].nodes[1] = node.nodes[0];

            write(arrow_expression_stmt);
        }
    };
}

function createContainerStaticArrowFunction(argument_size: number = 1) {

    return async function (hook: IndirectHook<JSNode>, comp, presets, model, parents) {

        let arrow_argument_match = new Array(argument_size).fill(null);

        // console.log("----", arrow_argument_match, renderCompressed(hook.nodes[0]), getListOfUnboundArgs(hook.nodes[0], comp, arrow_argument_match));
        if (getListOfUnboundArgs(hook.nodes[0], comp, arrow_argument_match)) {

            if (getExpressionStaticResolutionType(hook.nodes[0], comp, presets) == STATIC_RESOLUTION_TYPE.CONSTANT_STATIC) {

                const arrow_expression_stmt = exp(`(${arrow_argument_match.map(v => v.value)}) => 1`);

                arrow_expression_stmt.nodes[1] =
                    await getStaticValueAstFromSourceAST(hook.nodes[0], comp, presets, model, parents, false);;
                try {
                    return eval(renderCompressed(arrow_expression_stmt));
                } catch (e) { }
            }
        }

        return null;
    };
}


/**
 * Searches for N Undeclared binding references, where N is the number of entries in list arg.
 * Upon finding matches, converts the types of reference nodes back to their original values.
 * Found nodes are assigned to the list at an index respective of the order the node was found
 * in. If the number of found nodes is less then the number of entries in list, then false
 * is returned; true otherwise.
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
