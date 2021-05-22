import { FunctionFrame } from "../types/function_frame";
import { ComponentData } from "../types/component";

export function createFrame(
    parent_frame: any,
    component: ComponentData,
    DO_NOT_ATTACH: boolean = false,
    TEMPORARY: boolean = DO_NOT_ATTACH
) {

    const function_frame = <FunctionFrame>{
        ast: null,
        declared_variables: new Set(),
        input_names: new Set(),
        output_names: new Set(),
        binding_ref_identifiers: [],
        prev: parent_frame,
        IS_ASYNC: false,
        IS_ROOT: !parent_frame,
        IS_TEMP_CLOSURE: TEMPORARY,
        binding_variables: (!parent_frame) ? new Map : null,
    };

    if (!parent_frame)
        component.root_frame = function_frame;

    if (!DO_NOT_ATTACH)
        component.frames.push(function_frame);

    return function_frame;
}
