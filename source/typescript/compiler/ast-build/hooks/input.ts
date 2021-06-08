import { exp, JSNode, JSNodeType, stmt } from "@candlelib/js";
import { IndirectHook } from "source/typescript/types/hook.js";
import { BINDING_VARIABLE_TYPE, ContainerDomLiteral, HTMLNodeType, STATIC_RESOLUTION_TYPE } from "../../../types/all.js";
import { getComponentBinding, getExpressionStaticResolutionType, getStaticValue } from "../../common/binding.js";
import { getExtendTypeVal } from "../../common/extended_types.js";
import { getElementAtIndex } from "../../common/html.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../../common/js_hook_types.js";
import { registerHookHandler } from "./hook-handler.js";

//#############################################################################
// INPUT
/**
 * Hook Type for Container Data Attributes
 */
export const TextInputValueHook = getExtendTypeVal("text-input-value-hook", HTMLNodeType.HTMLAttribute);
//*
registerHookHandler<IndirectHook<JSNode>, JSNode | void>({

    name: "Text Input Value Handler",

    types: [TextInputValueHook],

    verify: () => true,

    buildJS: (node, comp, presets, element_index, addOnBindingUpdate, addInitBindingInit) => {

        const
            ele_name = "$$ele" + element_index,
            expression = node.nodes[0],
            root_type = expression.type,
            READONLY = getElementAtIndex(comp, element_index)
                .attributes
                .some(([v]) => v.toLowerCase() == "readonly");
        // Determine whether the expression is trivial, simple, or complex.
        // Trivial expressions are built in types. Number, Boolean, and String (and templates without bindings).
        // Simple expression are single identifiers
        // Complex expression are anything else
        if (
            root_type == JSNodeType.NumericLiteral ||
            root_type == JSNodeType.BigIntLiteral ||
            root_type == JSNodeType.StringLiteral
        ) {
            //This will have been directly assigned to static html, discard
            return;
        }

        // The expression will at least produce an output that will be assigned

        const s = stmt(`${ele_name}.value = 1`);
        s.nodes[0].nodes[1] = (expression);
        addOnBindingUpdate(s);

        if (
            (
                root_type == BindingIdentifierBinding ||
                root_type == BindingIdentifierReference
            ) && !READONLY

        ) {
            // The expression is a potentially bi-directional attachment
            // to a binding variable. This applies if the binding is:
            // - UNDECLARED ( Defaults to model attachment )
            // - MODEL_VARIABLE
            // - INTERNAL_VARIABLE
            // - METHOD_VARIABLE (The method will be called with value of the input)

            const binding = getComponentBinding(expression.value, comp);

            if (
                binding.type == BINDING_VARIABLE_TYPE.UNDECLARED
                ||
                binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE
                ||
                binding.type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE
            ) {
                const e = exp(`a=$$ele${element_index}.value`);
                e.nodes[0] = expression;
                const s = stmt(`this.attachListener(${element_index}, "input",  _=>a)`);
                s.nodes[0].nodes[1].nodes[2].nodes[1] = e;
                addInitBindingInit(s);
            } else if (binding.type == BINDING_VARIABLE_TYPE.METHOD_VARIABLE) {
                const e = exp(`this.${binding.internal_name}(v)`);
                e.nodes[1].nodes[0] = expression;
                const s = stmt(`this.attachListener(${element_index}, "input",  _=>a)`);
                s.nodes[0].nodes[1].nodes[2].nodes[1] = e;
                addInitBindingInit(s);
            }
        }
    },

    buildHTML: async (hook, comp, presets, model, parents) => {


        const ele: ContainerDomLiteral = <any>getElementAtIndex(comp, hook.ele_index);

        if (
            getExpressionStaticResolutionType(<JSNode>hook.nodes[0], comp, presets)
            !==
            STATIC_RESOLUTION_TYPE.INVALID
        ) {

            const val = await getStaticValue(hook.nodes[0], comp, presets, model, parents);

            if (val !== null)
                return <any>{
                    html: { attributes: [["value", val]] }

                };
        }
    }
});
//*/;

export const CheckboxInputValueHook = getExtendTypeVal("checkbox-input-value-hook", HTMLNodeType.HTMLAttribute);
//*
registerHookHandler<IndirectHook<JSNode>, JSNode | void>({

    name: "Checkbox Input Value Handler",

    types: [CheckboxInputValueHook],

    verify: () => true,

    buildJS: (node, comp, presets, element_index, addOnBindingUpdate, addInitBindingInit) => {

        const
            ele_name = "$$ele" + element_index,
            expression = node.nodes[0],
            root_type = expression.type,
            READONLY = getElementAtIndex(comp, element_index)
                .attributes
                .some(([v]) => v.toLowerCase() == "readonly");
        // Determine whether the expression is trivial, simple, or complex.
        // Trivial expressions are built in types. Number, Boolean, and String (and templates without bindings).
        // Simple expression are single identifiers
        // Complex expression are anything else
        if (
            root_type == JSNodeType.NumericLiteral ||
            root_type == JSNodeType.BigIntLiteral ||
            root_type == JSNodeType.StringLiteral
        ) {
            //This will have been directly assigned to static html, discard
            return;
        }

        // The expression will at least produce an output that will be assigned

        const s = stmt(`${ele_name}.checked = !!(1)`);
        s.nodes[0].nodes[1].nodes[0].nodes[0] = (expression);
        addOnBindingUpdate(s);

        if (
            (
                root_type == BindingIdentifierBinding ||
                root_type == BindingIdentifierReference
            ) && !READONLY

        ) {
            // The expression is a potentially bi-directional attachment
            // to a binding variable. This applies if the binding is:
            // - UNDECLARED ( Defaults to model attachment )
            // - MODEL_VARIABLE
            // - INTERNAL_VARIABLE
            // - METHOD_VARIABLE (The method will be called with value of the input)

            const binding = getComponentBinding(expression.value, comp);

            if (
                binding.type == BINDING_VARIABLE_TYPE.UNDECLARED
                ||
                binding.type == BINDING_VARIABLE_TYPE.MODEL_VARIABLE
                ||
                binding.type == BINDING_VARIABLE_TYPE.INTERNAL_VARIABLE
            ) {
                const e = exp(`a=$$ele${element_index}.checked`);
                e.nodes[0] = expression;
                const s = stmt(`this.attachListener(${element_index}, "input",  _=>a)`);
                s.nodes[0].nodes[1].nodes[2].nodes[1] = e;
                addInitBindingInit(s);
            } else if (binding.type == BINDING_VARIABLE_TYPE.METHOD_VARIABLE) {
                const e = exp(`this.${binding.internal_name}(v)`);
                e.nodes[1].nodes[0] = expression;
                const s = stmt(`this.attachListener(${element_index}, "input",  _=>a)`);
                s.nodes[0].nodes[1].nodes[2].nodes[1] = e;
                addInitBindingInit(s);
            }
        }
    },

    buildHTML: async (hook, comp, presets, model, parents) => {


        const ele: ContainerDomLiteral = <any>getElementAtIndex(comp, hook.ele_index);

        if (
            getExpressionStaticResolutionType(<JSNode>hook.nodes[0], comp, presets)
            !==
            STATIC_RESOLUTION_TYPE.INVALID
        ) {

            const val = await getStaticValue(hook.nodes[0], comp, presets, model, parents);

            if (val !== null)
                return <any>{
                    html: { attributes: [["checked", !!val]] }

                };
        }
    }
});