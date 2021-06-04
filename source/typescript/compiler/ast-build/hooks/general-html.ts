import { exp, JSExpressionClass, JSExpressionStatement, JSNode, JSNodeType, stmt } from "@candlelib/js";
import { HTMLNodeType, IndirectHook, STATIC_RESOLUTION_TYPE } from "../../../types/all.js";
import { getExpressionStaticResolutionType, getStaticValue } from "../../common/binding.js";
import { getExtendTypeVal } from "../../common/extended_types.js";
import { registerHookHandler } from "./hook-handler.js";


/**
 * Handles element on* event attributes. Creates an event listener for the event.
 * Attaches the expression as the body for an arrow function. Applies the arrow
 * function as the callable argument to event listener function.
 */
export const OnEventHook = getExtendTypeVal("on-event-hook", JSNodeType.StringLiteral);

registerHookHandler<IndirectHook<{ nodes: [JSNode], action: string; }>, JSNode | void>({

    name: "On Event Hook",

    types: [OnEventHook],

    verify: () => true,

    buildJS: (node, comp, presets, element_index, _1, addInit) => {
        // Replace the value with a 
        // Get the on* attribute name
        const { action, nodes: [ast] } = node.nodes[0];
        const
            ele_name = "$$ele" + element_index;

        const s = stmt(`${ele_name}.addEventListener("${action.slice(2)}", v=>a)`);

        s.nodes[0].nodes[1].nodes[1].nodes[1] = ast;

        addInit(s);
    },

    buildHTML: (node, comp, presets, model) => null
});

/**
 * Handles general attribute hooks
 */
export const AttributeHook = getExtendTypeVal("attribute-hook", JSNodeType.StringLiteral);

registerHookHandler<IndirectHook<{ name: string; nodes: [JSNode]; }>, JSNode | void>({

    name: "General Attribute Hook",

    types: [AttributeHook],

    verify: () => true,

    buildJS: (node, comp, presets, element_index, addWrite, addInit) => {

        const { name, nodes: [ast] } = node.nodes[0];

        const s = exp(`$$ele${element_index}.setAttribute("${name}",e)`);

        s.nodes[1].nodes[1] = ast;

        addWrite(s);
    },

    async buildHTML(hook, comp, presets, model, parents) {

        const ast = hook.nodes[0].nodes[0];

        if (
            getExpressionStaticResolutionType(ast, comp, presets)
            !==
            STATIC_RESOLUTION_TYPE.INVALID
        ) {

            return <any>{
                html: { attributes: [[hook.nodes[0].name, await getStaticValue(ast, comp, presets, model, parents)]] }

            };
        }
    }
});


/**
 * Hook Type for Text Nodse
 */
export const TextNodeHookType = getExtendTypeVal("text-node-hook", HTMLNodeType.HTMLText);
registerHookHandler<IndirectHook<JSExpressionClass> | JSNode, null>({

    name: "Text Node Binding Hook",

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
