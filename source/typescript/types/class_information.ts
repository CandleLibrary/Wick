import { JSNode } from "@candlefw/js";
import { FunctionFrame } from "./function_frame";

/**
 * Data objects used during compilation of a component
 * class.
 */
export interface ClassInformation {
    frames: FunctionFrame[];
    methods: JSNode[];
    binding_init_statements: JSNode[];
    class_initializer_statements: JSNode[];
    class_cleanup_statements: JSNode[];
    nluf_arrays: any[];
    nluf_public_variables: JSNode;
    compiled_ast: JSNode;
    nlu_index: number;
}
