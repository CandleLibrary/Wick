import { JSExpressionClass, JSExpressionStatement, JSIdentifierBinding, JSIdentifierReference, JSNode, renderCompressed, stmt } from "@candlelib/js";
import { BINDING_VARIABLE_TYPE, ContainerDomLiteral, HTMLNodeType, TemplateHTMLNode } from "../../../types/all.js";
import { registerHookHandler } from "./hook-handler.js";
import { getExtendTypeVal, getOriginalTypeOfExtendedType } from "../../common/extended_types.js";
import { getElementAtIndex } from "../../common/html.js";
import { Binding_Variable_Has_Static_Default_Value, Expression_Is_Static, getComponentBinding, getStaticValue, getStaticValueAstFromSourceAST } from "../../common/binding.js";
import { BindingIdentifierBinding, BindingIdentifierReference } from "../../common/js_hook_types.js";
import { componentDataToTempAST } from "../html.js";
import { IndirectHook } from "source/typescript/types/hook.js";

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
 * Hook Type for Container Data Attributes 
 */
export const ContainerDataAttribType = getExtendTypeVal("container-data-hook", HTMLNodeType.HTMLAttribute);
registerHookHandler<IndirectHook<JSNode> | JSNode, void>({

    name: "Container Data Attribute",

    types: [ContainerDataAttribType],

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

        let html: TemplateHTMLNode = { children: [] }, templates = null;

        const container_ele: ContainerDomLiteral = <any>getElementAtIndex(comp, hook.ele_index);

        if (
            Expression_Is_Static(<JSNode>hook.nodes[0], comp, presets, parent_components)
            &&
            container_ele.component_names.length > 0
        ) {

            const

                comp_name = container_ele.component_names[0],

                child_comp = presets.components.get(comp_name),

                models = await getStaticValue(hook, comp, presets, model, parent_components);

            if (models && Array.isArray(models) && child_comp) {

                for (const model of models) {

                    const result = await componentDataToTempAST(child_comp, presets, model);

                    html.children.push(result.html[0]);

                    templates = result.templates;
                }
            }
        }

        return { html, templates };
    }
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
            binding_var.type == BINDING_VARIABLE_TYPE.CONST_INTERNAL_VARIABLE
            &&
            Binding_Variable_Has_Static_Default_Value(binding_var, comp, presets, true)
        ) {

            const val = await getStaticValueAstFromSourceAST(node, comp, presets, null, null, true);

            if (val)
                return val;


            return;
        }
    },

    buildHTML: () => null
});