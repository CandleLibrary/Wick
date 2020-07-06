import { MinTreeNode } from "@candlefw/js";

import { FunctionFrame, BindingVariable, DATA_FLOW_FLAG, VARIABLE_REFERENCE_TYPE } from "../types/types.js";

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

export function addNodeToBindingIdentifiers(node: MinTreeNode, parent: MinTreeNode, frame: FunctionFrame) {
    getNonTempFrame(frame)
        .binding_ref_identifiers.push({
            node,
            parent,
            index: parent.nodes.indexOf(node)
        });
}

export function isVariableDeclared(var_name: string, frame: FunctionFrame): boolean {
    if (frame.declared_variables.has(var_name))
        return true;
    else if (frame.prev)
        return isVariableDeclared(var_name, frame.prev);
    else
        return false;
}

export function addNameToDeclaredVariables(var_name: string, frame: FunctionFrame) {
    frame.declared_variables.add(var_name);
}

export function addWrittenBindingVariableName(var_name: string, frame: FunctionFrame) {
    const root = getRootFrame(frame);


    if (root.binding_type.has(var_name))
        root.binding_type.get(var_name).flags |= DATA_FLOW_FLAG.WRITTEN;

    getNonTempFrame(frame).
        output_names.add(var_name);
}

export function addReadBindingVariableName(var_name: string, frame: FunctionFrame) {
    getNonTempFrame(frame).
        input_names.add(var_name);
}

export function isBindingVariable(var_name: string, frame: FunctionFrame) {
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
    const root = getRootFrame(frame);
    if (root.binding_type.has(binding_var_name)) {
        root.binding_type.get(binding_var_name).flags != flag;
        return true;
    }
    return false;
};