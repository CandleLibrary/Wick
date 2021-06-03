import { JSExportClause, JSNode, JSNodeType, stmt } from "@candlelib/js";
import { IndirectHook } from "source/typescript/types/hook.js";
import { BindingVariable, BINDING_FLAG, HTMLNode } from "../../../types/all.js";
import { getComponentBinding, getBindingFromExternalName } from "../../common/binding.js";
import { getExtendTypeVal } from "../../common/extended_types.js";
import { getElementAtIndex } from "../../common/html.js";
import { BindingIdentifierBinding } from "../../common/js_hook_types.js";
import { registerHookHandler } from "./hook-handler.js";

/**
 * Handles the export and import of data from and to children elements
 */

export const ExportToChildAttributeHook = getExtendTypeVal("data-export-to-child-through-attribute-hook", JSNodeType.StringLiteral);
export const ImportFromChildAttributeHook = getExtendTypeVal("data-import-from-child-through-attribute-hook", JSNodeType.StringLiteral);
registerHookHandler<IndirectHook<{ foreign: string; local: string; child_id: number; }>, void>({
    name: "Export & Import Attribute Hooks",

    types: [ExportToChildAttributeHook, ImportFromChildAttributeHook],

    verify: () => true,

    buildJS: (node, comp, presets, element_index, addWrite, addInit) => {

        const ele = <HTMLNode><any>getElementAtIndex(comp, element_index);

        const comp_name = ele.component_name;

        const child_comp = presets.components.get(comp_name);

        const { foreign, local, child_id } = node.nodes[0];

        if (child_comp) {

            const
                par_binding = getComponentBinding(local, comp),
                child_binding = getBindingFromExternalName(foreign, child_comp);

            if (par_binding
                &&
                child_binding
            ) {

                if (node.type == ExportToChildAttributeHook && (child_binding.flags & BINDING_FLAG.FROM_PARENT) > 0) {

                    const exp = stmt(`this.ch[${child_id}].ufp(${child_binding.class_index}, _, f);`);

                    exp.nodes[0].nodes[1].nodes[1] = createBindingReference(par_binding);

                    registerClassBinding(addInit, par_binding);

                    addWrite(exp);

                } else if ((child_binding.flags & BINDING_FLAG.ALLOW_EXPORT_TO_PARENT) > 0) {


                    const exp = stmt(`this.ch[${child_id}].spm(${child_binding.class_index}, ${getBindingClassIndexID(par_binding)}, ${child_id})`);

                    registerClassBinding(addInit, par_binding);

                    addInit(exp);
                }

            }

        }
    },

    buildHTML: (node, comp, presets, model) => null
});
export const ExportToParentHook = getExtendTypeVal("data-export-to-parent", JSNodeType.ExportDeclaration);

registerHookHandler<IndirectHook<JSExportClause>, void>({
    name: "Export To Parent Hook",

    types: [ExportToParentHook],

    verify: () => true,

    buildJS: (node, comp, _, _2, _3, addInit) => {
        const [clause] = node.nodes;

        for (const { nodes: [internal] } of clause.nodes)
            registerClassBinding(addInit, getComponentBinding(internal.value, comp));

        return null;
    },

    buildHTML: (node, comp, presets, model) => null
});

function getBindingClassIndexID(binding: BindingVariable) {
    return `$$bi${binding.internal_name}`;
}

function registerClassBinding(add: (d: any) => void, binding: BindingVariable) {
    if (binding)
        add(createBindingReference(binding));
}

function createBindingReference(binding: BindingVariable): any {
    return {
        type: BindingIdentifierBinding,
        value: binding.internal_name,
        pos: {}
    };
}

