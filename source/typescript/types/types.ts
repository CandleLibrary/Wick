import { JSNode } from "@candlefw/js";
import { CSSNode } from "@candlefw/css";
import { HTMLNode, HTMLTextNode } from "./wick_ast_node_types.js";
import URL from "@candlefw/url";
import { DOMLiteral } from "./dom_literal.js";
import { PendingBinding, BINDING_SELECTOR } from "./binding";
import { BindingVariable } from "./binding";
import { Lexer } from "@candlefw/wind";

export type ComponentClassStrings = { class_string: string, source_map: string; };
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

export interface FunctionFrame {
    /**
     * true if the frame is created from
     * an anonymous binding expression 
     * in an element attribute
     */
    ATTRIBUTE: boolean,

    name: string,

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
    binding_ref_identifiers: { node: JSNode, parent: JSNode, index: number; }[];

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

export interface ComponentData {

    /**
     * True if errors were encountered when processing
     * the component. Also, if true, this component will 
     * generate an error report element if it is mounted 
     * to the DOM.
     */
    ERRORS: boolean;

    /**
     * Maps @***** selector strings to nodes that should be replaced with 
     * a reference or an array of references that match the selector to a
     * local HTML element or elements. 
     */
    selector_map: Map<string, JSNode[]>;

    /**
     * Count of number of container tags identified in HTML 
     */
    container_count: number;

    /**
     * Child id counter;
     */
    children: number[];

    /**
     * Add new PendingBinding entry to the component.
     * @param arg 
     */
    addBinding(arg: {
        binding_selector: BINDING_SELECTOR | string,
        binding_val: JSNode | HTMLNode | CSSNode | any,
        host_node: JSNode | HTMLNode | CSSNode,
        html_element_index: number;
        pos: Lexer;
    }): void;

    /**
     * Name of a model defined in presets that will be auto assigned to the 
     * component instance when it is created.
     */
    global_model: string;

    /**
     * Functions blocks that identify the input and output variables that are consumed
     * and produced by the function. 
     */
    frames: FunctionFrame[];

    /**
     * Globally unique string identifying this particular component. 
     */
    name: string,

    /**
     * Global string identifiers for this particular component
     */
    names: string[],

    /**
     * A linkage between a binding variable and any element that is 
     * modified by the binding variable, including HTML attributes, 
     * CSS attributes, and other binding variables. 
     */
    bindings: PendingBinding[],

    /**
     * The virtual DOM as described within a component with a .html extension or with a 
     */
    HTML: DOMLiteral;

    CSS: CSSNode[];

    /**
     * URL of source file for this component
     */
    location: URL;

    /**
     * Mapping between import names and hash names of components that referenced in other components. 
     */
    local_component_names: Map<string, string>;

    /**
     * Original source string.
     */
    source: string;

    /**
     * The root function frame
     */
    root_frame: FunctionFrame;
}

export * from "./js_handler.js";