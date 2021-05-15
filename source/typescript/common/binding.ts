import { traverse } from "@candlefw/conflagrate";
import { JSNode, JSNodeType } from "@candlefw/js";
import { BindingVariable, DATA_FLOW_FLAG, VARIABLE_REFERENCE_TYPE } from "../types/binding";
import { ComponentData } from "../types/component";
import { FunctionFrame } from "../types/function_frame";



function getNonTempFrame(frame: FunctionFrame) {
    while (frame && frame.IS_TEMP_CLOSURE)
        frame = frame.prev;
    return frame;
}

function getRootFrame(frame: FunctionFrame) {
    while (!frame.IS_ROOT)
        frame = frame.prev;
    return frame;
}

export function addNodeToBindingIdentifiers(n: JSNode, p: JSNode, frame: FunctionFrame) {

    for (const { node, meta: { parent: par } } of traverse(n, "nodes")
        .filter("type", JSNodeType.IdentifierReference, JSNodeType.IdentifierBinding)
    ) {
        // Check to see if node has already been assigned
        // as could be the case if a parent node has been 
        // processed in full before focus has reached the 
        // child node


        for (const bi of getNonTempFrame(frame).binding_ref_identifiers)
            if (bi.node == node) return;

        const parent = par || p;

        node.IS_BINDING_REF = true;

        getNonTempFrame(frame)
            .binding_ref_identifiers.push({
                node,
                parent,
                index: parent.nodes.indexOf(node)
            });

        return;
    }

    throw new Error(`Missing reference in express ${p.pos.slice()}`);
}

export function isVariableDeclared(var_name: string, frame: FunctionFrame): boolean {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    if (frame.declared_variables.has(var_name))
        return true;
    else if (frame.prev)
        return isVariableDeclared(var_name, frame.prev);
    else
        return false;
}

export function addNameToDeclaredVariables(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    frame.declared_variables.add(var_name);
}

export function addWrittenBindingVariableName(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    const root = getRootFrame(frame);

    if (root.binding_type.has(var_name))
        root.binding_type.get(var_name).flags |= DATA_FLOW_FLAG.WRITTEN;

    getNonTempFrame(frame).output_names.add(var_name);
}

export function addReadBindingVariableName(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    //Return if this name has been assigned before being read.
    if (frame.output_names.has(var_name)) return;

    getNonTempFrame(frame).input_names.add(var_name);
}

export function isBindingVariable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    return getRootFrame(frame).binding_type.has(var_name);
}

export function addBindingVariable(binding_var: BindingVariable, frame: FunctionFrame): boolean {

    const root = getRootFrame(frame);

    if (root.binding_type.has(binding_var.internal_name))
        return false;

    root.binding_type.set(binding_var.internal_name, binding_var);
    return true;

}

/**
 * Add a Data flow flag to the binding type and return true. If the binding type has not been defined, return false.
 * @param binding_var_name 
 * @param flag 
 * @param frame 
 */
export function addBindingVariableFlag(binding_var_name: string, flag: DATA_FLOW_FLAG, frame: FunctionFrame): boolean {

    if (typeof binding_var_name !== "string") throw new Error("[binding_var_name] must be a string.");

    const root = getRootFrame(frame);
    if (root.binding_type.has(binding_var_name)) {
        root.binding_type.get(binding_var_name).flags != flag;
        return true;
    }
    return false;
};



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