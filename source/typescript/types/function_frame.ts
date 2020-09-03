import { JSNode } from "@candlefw/js";
import { BindingVariable } from "./binding";

export interface FunctionFrame {
    /**
     * true if the frame is created from
     * an anonymous binding expression
     * in an element attribute
     */
    ATTRIBUTE: boolean;

    name: string;

    /**
     * An optional copy of the frame's ast object.
     */
    backup_ast?: JSNode;

    /**
     * Any binding variable that is referenced within the function.
     */
    declared_variables: Set<string>;

    /**
     * Identifiers that have no declaration and no presence in the
     * the global object and thus must be a binding identifier reference.
     */
    binding_ref_identifiers: { node: JSNode; parent: JSNode; index: number; }[];

    /**
     * Binding variable names that are read by the method.
     */
    input_names: Set<string>;

    /**
     * Binding variable names that are written to by the method.
     */
    output_names: Set<string>;

    /**
     * Extracted source AST for this function block
     */
    ast: JSNode;

    prev?: FunctionFrame;

    /**
     * If this frame is the first one in the frame chain
     * then it is root.
     */
    IS_ROOT: boolean;

    IS_TEMP_CLOSURE: boolean;

    /**
     * Array of bindings types that have been declared in
     * the root frame either through a var statement or
     * from an import/export statement.
     */
    binding_type?: Map<string, BindingVariable>;

    /**
     * Index of lookup location of the rendered component method
     */
    index?: number;
}
