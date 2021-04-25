import { VARIABLE_REFERENCE_TYPE } from "../types/variable_reference_types";
import { ComponentData } from "../types/component_data";
import { BindingVariable } from "../wick";


let SET_ONCE_environment_globals = null;

export function getSetOfEnvironmentGlobalNames(): Set<string> {
    //Determine what environment we have pull and out the global object. 
    if (!SET_ONCE_environment_globals) {
        SET_ONCE_environment_globals = new Set();
        const g = (typeof window !== "undefined") ? window : (typeof global !== "undefined") ? global : null;
        if (g) for (const name in g)
            SET_ONCE_environment_globals.add(<string>name);
    }
    return SET_ONCE_environment_globals;
}

export function getComponentVariable(name: string, component: ComponentData): BindingVariable {
    // Allow global objects to be accessed if there are no existing
    // component variables that have an identifier that matches [name]
    if (!component.root_frame.binding_type.has(name)) return null;
    return component.root_frame.binding_type.get(name);
}

export function getComponentVariableName(name: string, component: ComponentData) {

    const comp_var = getComponentVariable(name, component);

    if (!comp_var) {
        const global_names = getSetOfEnvironmentGlobalNames();
        if (global_names.has(name)) {
            return name;
        }
    }

    if (comp_var)
        switch (comp_var.type) {

            case VARIABLE_REFERENCE_TYPE.API_VARIABLE:
                return `this.presets.api.${comp_var.external_name}`;

            case VARIABLE_REFERENCE_TYPE.MODEL_VARIABLE:
                return `this.model.${comp_var.external_name}`;

            case VARIABLE_REFERENCE_TYPE.METHOD_VARIABLE:
                return "this." + name;

            case VARIABLE_REFERENCE_TYPE.GLOBAL_VARIABLE:
                return `window.${comp_var.external_name}`;

            default:
                return `this[${comp_var.class_index}]`;
        }
    else
        return name;

}