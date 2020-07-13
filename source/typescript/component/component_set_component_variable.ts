import { MinTreeNode, ext } from "@candlefw/js";

import { Component, VARIABLE_REFERENCE_TYPE } from "../types/types.js";


let SET_ONCE_environment_globals = null;

export function getSetOfEnvironmentGlobalNames(): Set<string> {
    //Determine what environment we have pull and out the global object. 
    if (!SET_ONCE_environment_globals) {
        SET_ONCE_environment_globals = new Set();
        let g = (typeof window !== "undefined") ? window : (typeof global !== "undefined") ? global : null;
        if (g) {
            for (const name in g)
                SET_ONCE_environment_globals.add(<string>name);
        }
    }
    return SET_ONCE_environment_globals;
}


/**
 *
 * @param node
 * @param parent
 * @param component
 * @param usage_flags
 */
export function setComponentVariable(
    type: VARIABLE_REFERENCE_TYPE = VARIABLE_REFERENCE_TYPE.GLOBAL_VARIABLE,
    name: string,
    component: Component = null,
    external_name: string = name,
    usage_flags: number = 0,
    node: MinTreeNode = null) {

    var variable = null;

    if (!component.binding_variables.has(name)) {

        let index = component.binding_variables.size;

        variable = {
            type,
            nlui: -1,
            usage_flags,
            local_name: name,
            external_name: external_name || name,
            class_name: index,
            ACCESSED: 1,
            ASSIGNED: true,
            references: [ext(node, true)],
        };

        component.binding_variables.set(name, variable);

    } else {

        variable = component.binding_variables.get(name);
        variable.references.push(ext(node, true));

        if (!variable.type || variable == VARIABLE_REFERENCE_TYPE.GLOBAL_VARIABLE) {
            variable.usage_flags |= usage_flags;
            variable.type = type;
        }
    }

    return variable;
}

export function setVariableName(name, component: Component) {
    // Allow global objects to be accessed if there are no existing
    // component variables that have an identifier that matches [name]
    if (!component.root_frame.binding_type.has(name)) {
        const global_names = getSetOfEnvironmentGlobalNames();
        if (global_names.has(name)) {
            return name;
        }
    }

    const comp_var = component.root_frame.binding_type.get(name);

    if (comp_var) {

        switch (comp_var.type) {

            case VARIABLE_REFERENCE_TYPE.API_VARIABLE:
                return `cfw.wick.rt.presets.api.${comp_var.external_name}`;
            case VARIABLE_REFERENCE_TYPE.MODEL_VARIABLE:
                return `this.model.${comp_var.external_name}`;
            case VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE:
                return name;
            case VARIABLE_REFERENCE_TYPE.GLOBAL_VARIABLE:
                return `window.${comp_var.external_name}`;
            default:
                return `this[${comp_var.class_index}]`;
        }
    } else {
        return name;
    }
}