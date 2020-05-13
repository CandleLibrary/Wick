import { MinTreeNode, ext } from "@candlefw/js";
import { Component } from "../types/types.js";
import { VARIABLE_REFERENCE_TYPE } from "./js";
/**
 *
 * @param node
 * @param parent
 * @param component
 * @param usage_flags
 */
export function setComponentVariable(type: VARIABLE_REFERENCE_TYPE, name: string, external_name: string, component: Component, usage_flags: number, node: MinTreeNode) {
    //binding_variables.push(binding_variable);
    if (!component.variables.has(name)) {
        let index = component.variables.size;
        component.variables.set(name, {
            type,
            nlui: -1,
            usage_flags,
            local_name: name,
            external_name: external_name || name,
            class_name: index,
            ACCESSED: 1,
            ASSIGNED: true,
            references: [ext(node, true)],
        });
    }
    else {
        component.variables.get(name).usage_flags |= usage_flags;
        component.variables.get(name).references.push(ext(node, true));
        component.variables.get(name).type |= type;
    }
}
