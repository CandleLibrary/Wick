import { JSNode } from "@candlefw/js";
import { FunctionFrame } from "./function_frame";

/**
 * Data objects used during compilation of a component
 * class.
 */
export interface CompiledComponentClass {
    methods: JSNode[];
    binding_setup_stmts: JSNode[];
    setup_stmts: JSNode[];
    teardown_stmts: JSNode[];
    nluf_public_variables: JSNode;
    nlu_index: number;
}
