import { Lexer } from "@candlefw/wind";
import { JSNode } from "@candlefw/js";



export const enum BINDING_VARIABLE_TYPE {
    UNDEFINED = 0,
    CONST_VARIABLE = 64,
    INTERNAL_VARIABLE = 1,
    MODEL_VARIABLE = 16,
    API_VARIABLE = 4,
    PARENT_VARIABLE = 8,
    METHOD_VARIABLE = 2,
    GLOBAL_VARIABLE = 32,
    /**
     * Variables that are replaced with direct
     * property access on the associated object
     */
    DIRECT_ACCESS = 4 | 32
}

export const enum DATA_FLOW_FLAG {
    FROM_PARENT = 1,

    FROM_PRESETS = 2,

    FROM_OUTSIDE = 4,

    EXPORT_TO_CHILD = 8,

    EXPORT_TO_PARENT = 16,

    ALLOW_FROM_CHILD = 32,

    FROM_CHILD = 64,

    FROM_MODEL = 128,

    WRITTEN = 256
}

export const enum STATIC_BINDING_STATE {
    UNCHECKED = 0,
    TRUE = 1,
    FALSE = 2
}


/**
 * A variable within the component that can be 
 * dynamically bound to inputs or outputs
 * 
 * These variables can be declared through import
 * statements, internal var, let, or const assignments,
 * or automatically through any reference to a variable
 * that is undeclared and not a global variable name.
 */
export interface BindingVariable {
    /* Name used for references within the component*/
    internal_name: string;

    /* Name used to access the imported object */
    external_name: string;

    /* Type of reference */
    type: BINDING_VARIABLE_TYPE;

    /* */
    class_index: number;
    flags: DATA_FLOW_FLAG;
    pos: any | Lexer;
    default_val?: JSNode;
    STATIC_STATE: STATIC_BINDING_STATE;
    /**
     * Number of references made to this variable within the component
     */
    ref_count: number;
}