import { Lexer } from "@candlefw/wind";
import { JSNode } from "@candlefw/js";



export const enum BINDING_VARIABLE_TYPE {
    UNDEFINED = 0,
    
    
    /**
     * Indirect variables that require one level
     * of indirection.
     */
    INTERNAL_VARIABLE = 1,
    PARENT_VARIABLE = 2,
    MODEL_VARIABLE = 4,
    
    /**
     * A Global variable that should be wrapped into a an
     * observerable 
     */
    GLOBAL_VARIABLE = 8,

    /**
     * Static variable that could replaced directly with 
     * its assigned value
     */
    
    METHOD_VARIABLE = 16,
    CONST_INTERNAL_VARIABLE = 32,
    API_VARIABLE = 64,
    MODULE_MEMBER_VARIABLE = 128,
    MODULE_VARIABLE = 256,

    /**
     * Variables that are replaced with direct
     * property access on the associated object
     */
    DIRECT_ACCESS = 16 | 32 | 64 | 128 | 256,
}

/**
 * These flags govern how data can move
 * through the boundaries of a component
 */
export const enum BINDING_FLAG {
    FROM_PARENT = 1,

    FROM_PRESETS = 2,

    FROM_OUTSIDE = 4,

    ALLOW_EXPORT_TO_PARENT = 16,

    ALLOW_UPDATE_FROM_CHILD = 64,

    ALLOW_UPDATE_FROM_MODEL = 128,

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
    flags: BINDING_FLAG;
    pos: any | Lexer;
    default_val?: JSNode;
    STATIC_STATE: STATIC_BINDING_STATE;
    /**
     * Number of references made to this variable within the component
     */
    ref_count: number;
}