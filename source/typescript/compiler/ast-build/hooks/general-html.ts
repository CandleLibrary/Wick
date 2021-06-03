import { JSNodeType, JSStringLiteral } from "@candlelib/js";
import { getExtendTypeVal } from "../../common/extended_types.js";
import { registerHookHandler } from "./hook-handler.js";


/**
 * Hook Type for Binding Node data properties
 */
export const OnEventHook = getExtendTypeVal("on-event-hook", JSNodeType.StringLiteral);

registerHookHandler<JSStringLiteral, JSStringLiteral>({

    name: "On Event Hook",

    types: [OnEventHook],

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
