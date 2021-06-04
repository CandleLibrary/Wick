import { matchAll } from "@candlelib/css";
import { exp, JSExpressionClass, JSIdentifierBinding, JSIdentifierReference, JSNodeType, JSStringLiteral } from "@candlelib/js";
import { BINDING_VARIABLE_TYPE, ComponentData, DOMLiteral, STATIC_RESOLUTION_TYPE } from "../../../types/all.js";
import { getBindingStaticResolutionType, getComponentBinding, getStaticValueAstFromSourceAST } from "../../common/binding.js";
import { css_selector_helpers } from "../../common/css.js";
import { getExtendTypeVal } from "../../common/extended_types.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../../common/js_hook_types.js";
import { registerHookHandler } from "./hook-handler.js";


/**
 * Hook for CSS selector string conversion to element references
 */
export const CSSSelectorHook = getExtendTypeVal("css-selector-hook", JSNodeType.StringLiteral);

registerHookHandler<JSStringLiteral, JSStringLiteral>({

    name: "CSS Selector Reference",

    types: [CSSSelectorHook],

    verify: () => true,

    buildJS: (node, comp, presets, element_index, addOnBindingUpdate) => {
        //Replace the value with a 
        const exp = convertAtLookupToElementRef(node, comp);

        if (exp) {
            return exp;
        }
    },

    buildHTML: (node, comp, presets, model) => null
});


/**
 *  
 */
registerHookHandler<JSIdentifierBinding | JSIdentifierReference, JSExpressionClass>({

    description: `
    Auto-Hook For Direct Access Binding Variables
    * 
    * CONST_INTERNAL_VARIABLE
    * METHOD_VARIABLE
    * MODULE_MEMBER_VARIABLE
    * MODULE_VARIABLE
    `,

    name: "Auto-Hook Static-Constant Value",

    types: [BindingIdentifierBinding, BindingIdentifierReference],

    verify: () => true,

    buildJS: async (node, comp, presets, _3, _, _1, _2) => {

        const binding_var = getComponentBinding(node.value, comp);

        if (
            getBindingStaticResolutionType(binding_var, comp, presets)
            ==
            STATIC_RESOLUTION_TYPE.CONSTANT_STATIC
            &&
            binding_var.type == BINDING_VARIABLE_TYPE.CONST_INTERNAL_VARIABLE
        ) {

            const val = await getStaticValueAstFromSourceAST(node, comp, presets, null, null, true);

            if (val) return val;
        }
    },

    buildHTML: () => null
});

export function convertAtLookupToElementRef(string_node: JSStringLiteral, component: ComponentData) {

    const css_selector = string_node.value.slice(1); //remove "@"

    let html_nodes = null, expression = null;

    switch (css_selector.toLowerCase()) {
        case "ctxwebgpu":
            html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

            if (html_nodes)
                expression = exp(`$$ele${html_nodes.element_index}.getContext("gpupresent")`);

            break;
        case "ctx3d":
            html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

            if (html_nodes)
                expression = exp(`$$ele${html_nodes.element_index}.getContext("3d")`);

            break;

        case "ctx2d":
            html_nodes = matchAll<DOMLiteral>("canvas", component.HTML, css_selector_helpers)[0];

            if (html_nodes)
                expression = exp(`$$ele${html_nodes.element_index}.getContext("2d")`);

            break;

        default:
            html_nodes = matchAll<DOMLiteral>(css_selector, component.HTML, css_selector_helpers);

            if (html_nodes.length > 0)

                expression = (html_nodes.length == 1)
                    ? exp(`$$ele${html_nodes[0].element_index}; `)
                    : exp(`[${html_nodes.map(e => `$$ele${e.element_index}]`).join(",")}]`);

    }

    return expression;
}
