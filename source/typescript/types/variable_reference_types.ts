export const enum VARIABLE_REFERENCE_TYPE {
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
