import { traverse } from "@candlefw/conflagrate";
import { JSIdentifier, JSNode, JSNodeType } from "@candlefw/js";
import { Lexer } from "@candlefw/wind";
import { BindingVariable, BINDING_VARIABLE_TYPE, DATA_FLOW_FLAG, STATIC_BINDING_STATE } from "../types/binding";
import { IntermediateHook } from "../types/hook";
import { ComponentData } from "../types/component";
import { FunctionFrame } from "../types/function_frame";
import { Component } from "../wick";



function getNonTempFrame(frame: FunctionFrame) {
    while (frame && frame.IS_TEMP_CLOSURE)
        frame = frame.prev;
    return frame;
}

export function getRootFrame(frame: FunctionFrame) {
    while (!frame.IS_ROOT)
        frame = frame.prev;
    return frame;
}

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
/**
 * Adds JS AST node to list of identifiers that will need to be transformed 
 * to map to a binding variable
 * @param node 
 * @param parent 
 * @param frame 
 * @returns 
 */
export function addBindingReference(input_node: JSNode, input_parent: JSNode, frame: FunctionFrame) {

    for (const { node, meta: { parent: par } } of traverse(input_node, "nodes")
        .filter("type", JSNodeType.IdentifierReference, JSNodeType.IdentifierBinding)
    ) {

        // name is already declared within the function scope then
        // do not add to binding_ref_identifiers

        if (!Variable_Is_Declared((<JSIdentifier>node).value, frame)) {

            //@ts-ignore
            node.IS_BINDING_REF = true;

            if (!frame.binding_ref_identifiers.includes(node))
                frame.binding_ref_identifiers.push(<any>node);

            addBindingVariable(frame, (<JSIdentifier>node).value, node.pos);
        }

        return;
    }

    throw new Error(`Missing reference in express ${input_parent.pos.slice()}`);
}

export function getBindingRefCount(frame: FunctionFrame): Map<string, number> {

    const name_map = new Map();

    for (const { value } of frame.binding_ref_identifiers.filter(n => n.IS_BINDING_REF))
        name_map.set(value, (name_map.get(value) || 0) + 1);

    return name_map;
}
export function removeBindingReferences(name: string, frame: FunctionFrame) {
    for (const node of frame.binding_ref_identifiers)
        if (node.value == name)
            node.IS_BINDING_REF = false;
}
/**
 *  Returns true if var_name has been declared within the frame closure
 */
export function Variable_Is_Declared(var_name: string, frame: FunctionFrame): boolean {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    if (frame.declared_variables.has(var_name))
        return true;
    else if (frame.prev)
        return Variable_Is_Declared(var_name, frame.prev);
    else
        return false;
}
/**
 * Add var_name to declared variables. var_name should be declared within a function's arguments list, 
 * or within a let, var, const declaration list. Any binding reference that matches the variable name
 * will be unset.
 * 
 * @param var_name 
 * @param frame 
 */
export function addNameToDeclaredVariables(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    removeBindingReferences(var_name, frame);

    frame.declared_variables.add(var_name);
}

export function addWriteFlagToBindingVariable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    const root = getRootFrame(frame);

    if (root.binding_variables.has(var_name))
        root.binding_variables.get(var_name).flags |= DATA_FLOW_FLAG.WRITTEN;

    getNonTempFrame(frame).output_names.add(var_name);
}

export function addReadFlagToBindingVariable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    //Return if this name has been assigned before being read.
    if (frame.output_names.has(var_name)) return;

    getNonTempFrame(frame).input_names.add(var_name);
}

export function Name_Is_A_Binding_Variable(var_name: string, frame: FunctionFrame) {

    if (typeof var_name !== "string") throw new Error("[var_name] must be a string.");

    return getRootFrame(frame).binding_variables.has(var_name);
}

export function addDefaultValueToBindingVariable(frame: FunctionFrame, name: string, value: JSNode) {

    const root = getRootFrame(frame);

    if (root.binding_variables.has(name))
        root.binding_variables.get(name).default_val = value;
}

export function addBindingVariable(
    frame: FunctionFrame,
    internal_name: string,
    pos: any | Lexer,
    type: BINDING_VARIABLE_TYPE = BINDING_VARIABLE_TYPE.UNDEFINED,
    external_name: string = internal_name,
    flags: DATA_FLOW_FLAG = 0,
): boolean {

    const binding_var: BindingVariable = {
        class_index: -1,
        flags,
        external_name,
        internal_name,
        pos,
        type,
        STATIC_STATE: STATIC_BINDING_STATE.UNCHECKED,
        default_val: null,
        ref_count: 0
    };

    const root = getRootFrame(frame);

    if (root.binding_variables.has(internal_name)) {

        let UPGRADED = false;

        const existing_binding = root.binding_variables.get(internal_name);

        if (
            existing_binding.type == BINDING_VARIABLE_TYPE.UNDEFINED
            &&
            type != BINDING_VARIABLE_TYPE.UNDEFINED
        ) {

            root.binding_variables.set(binding_var.internal_name, binding_var);

            binding_var.flags |= existing_binding.flags;

            binding_var.ref_count = existing_binding.ref_count;

            UPGRADED = true;
        }

        if (existing_binding.external_name == existing_binding.internal_name
            &&
            existing_binding.external_name != external_name) {

            existing_binding.external_name = external_name;

            UPGRADED = true;
        }

        return UPGRADED;
    }

    root.binding_variables.set(binding_var.internal_name, binding_var);

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

    if (root.binding_variables.has(binding_var_name)) {
        root.binding_variables.get(binding_var_name).flags != flag;
        return true;
    }
    return false;
};

/**
 * Return a binding variable object that matches `name` or null
 * @param name @string
 * @param component 
 * @returns 
 */
export function getComponentBinding(name: string, component: ComponentData): BindingVariable {

    if (!component.root_frame.binding_variables.has(name)) return null;

    return component.root_frame.binding_variables.get(name);
}

export function getComponentVariableName(name: string, component: ComponentData) {

    const comp_var = getComponentBinding(name, component);

    if (!comp_var || comp_var.type == BINDING_VARIABLE_TYPE.UNDEFINED) {
        const global_names = getSetOfEnvironmentGlobalNames();
        if (global_names.has(name)) {
            return name;
        }
    }

    if (comp_var)
        switch (comp_var.type) {

            case BINDING_VARIABLE_TYPE.API_VARIABLE:
                return `this.presets.api.${comp_var.external_name}`;

            case BINDING_VARIABLE_TYPE.UNDEFINED:
            case BINDING_VARIABLE_TYPE.MODEL_VARIABLE:
                return `this.model.${comp_var.external_name}`;

            case BINDING_VARIABLE_TYPE.METHOD_VARIABLE:
                return "this." + name;

            case BINDING_VARIABLE_TYPE.GLOBAL_VARIABLE:
                return `window.${comp_var.external_name}`;

            default:
                return `this[${comp_var.class_index}]`;
        }
    else
        return name;

}

export function Binding_Variable_Has_Static_Default_Value(
    binding: BindingVariable,
    component: Component
): boolean {

    let STATIC_STATE = binding.STATIC_STATE;

    if (STATIC_STATE == STATIC_BINDING_STATE.UNCHECKED) {

        STATIC_STATE = STATIC_BINDING_STATE.FALSE;

        if (binding.default_val) {

            STATIC_STATE = STATIC_BINDING_STATE.TRUE;

            outer:
            for (const { node, meta } of traverse(binding.default_val, "nodes")
            ) {
                switch (node.type) {
                    case JSNodeType.IdentifierReference:
                    //If the value is another binding reference then a 

                    case JSNodeType.CallExpression:
                    case JSNodeType.FunctionDeclaration:
                        STATIC_STATE = STATIC_BINDING_STATE.FALSE;
                        break outer;
                }
            }
        }
    }

    binding.STATIC_STATE = STATIC_STATE;

    return STATIC_STATE == STATIC_BINDING_STATE.TRUE;
}

export function getDefaultBindingValue(name: string, component: Component): any {

}

export function Binding_Is_Static(name: string, component: Component) {

}

export function addHook(component: Component, hook: IntermediateHook) {
    component.hooks.push(hook);
};


