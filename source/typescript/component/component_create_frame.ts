import { ComponentData, FunctionFrame } from "../types/types.js";

export function createFrame(parent_frame: any, TEMPORARY: boolean = false, component: ComponentData) {

    const function_frame = <FunctionFrame>{
        ast: null,
        declared_variables: new Set(),
        input_names: new Set(),
        output_names: new Set(),
        binding_ref_identifiers: [],
        prev: parent_frame,
        IS_ROOT: !parent_frame,
        IS_TEMP_CLOSURE: TEMPORARY,
        binding_type: (!parent_frame) ? new Map : null,
    };

    if (!parent_frame)
        component.root_frame = function_frame;

    if (!TEMPORARY)
        component.frames.push(function_frame);


    return function_frame;
}
