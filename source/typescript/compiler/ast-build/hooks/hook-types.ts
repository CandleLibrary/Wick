import { JSExpressionClass, JSExpressionStatement, JSIdentifierBinding, JSIdentifierReference, JSNode, stmt } from "@candlelib/js";
import { IndirectHook } from "source/typescript/types/hook.js";
import { HTMLNodeType, STATIC_RESOLUTION_TYPE } from "../../../types/all.js";
import { getBindingStaticResolutionType, getComponentBinding, getStaticValueAstFromSourceAST } from "../../common/binding.js";
import { getExtendTypeVal } from "../../common/extended_types.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../../common/js_hook_types.js";
import { registerHookHandler } from "./hook-handler.js";

/**
 * Hook Type for Binding Node data properties
 */
export const TextNodeHookType = getExtendTypeVal("text-node-hook", HTMLNodeType.HTMLText);
registerHookHandler<IndirectHook<JSNode> | JSNode, null>({

    name: "Text Node Binding",

    types: [TextNodeHookType],

    verify: () => true,

    buildJS: (node, comp, presets, element_index, addOnBindingUpdate) => {

        const st = <JSExpressionStatement>stmt(`$$ele${element_index}.data = 0`);

        st.nodes[0].nodes[1] = <JSNode>node.nodes[0];

        addOnBindingUpdate(st);

        return null;
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
        ) {

            const val = await getStaticValueAstFromSourceAST(node, comp, presets, null, null, true);

            if (val) return val;
        }
    },

    buildHTML: () => null
});

