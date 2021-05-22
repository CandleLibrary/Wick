import { JSNode } from "@candlefw/js";
import { FunctionFrame } from "./function_frame";

/**
 * Data objects used during compilation of a component
 * class.
 */
export interface CompiledComponentClass {
    methods: JSNode[];
    binding_setup_stmts: JSNode[];
    /**
     * Statements added to the component's init function
     */
    init_stmts: JSNode[];
    teardown_stmts: JSNode[];
    /**
     * Statements added to the component's init_async function
     */
    async_init_frame: FunctionFrame,

    lfu_table_entries: JSNode[];
    lu_public_variables: JSNode[];
    nluf_public_variables: JSNode;
    nlu_index: number;
    method_frames: FunctionFrame[];
}
