import { MinTreeNode } from "@candlefw/js";
import { WickASTNode, WickBindingNode, WickTextNode } from "./wick_ast_node_types.js";
import URL from "@candlefw/url";
import { Lexer } from "@candlefw/wind";
import Presets from "../presets.js";

export interface ComponentVariable {
    name: string,

    flags: number,
    type: number;
    nlui: number;
    usage_flags: number,
    external_name: string,
    local_name: string,
    class_name: number,
    ACCESSED: number,
    ASSIGNED: boolean,
    nodes?: MinTreeNode[];

}
export interface Component {
    /**
     * Functions blocks that identify the input and output variables that are consumed
     * and produced by the function. 
     */
    function_blocks: {

        /**
         * Any binding variable that is referenced within the function.
         */
        input_binding_variables: string[],

        /**
         * Any binding variables that is assigned a value.
         */
        output_binding_variables: string[],

        /**
         * Extracted source AST for this function block
         */
        ast: MinTreeNode;

        type: string;
    }[];

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
     * Any variable within a component that is defined a GLOBAL value that
     * may be produced as the result of the following declaration/references:
     *  - a: Declared within the top most scope of component within a var statement. 
     *  - b: Declared within a components import or export statements. 
     *  - c: Declared within a components data flow statements describing flow between 
     *       a component and its relatives. 
     *  - d: Referenced within a binding expression.  
     */
    binding_variables: Map<string, ComponentVariable>;

    ///**
    // * The original syntax tree.
    // */
    //original_ast: MinTreeNode | WickASTNode;

    /**
     * The virtual DOM as described within a component with a .html extension or with a 
     */
    HTML: { namespace: number, ele: string, id: number, attributes: { name: string, value: string; }[], children: any[]; }[];

    CSS: any[];

    /**
     * URL of source file for this component
     */
    location: URL;

    /**
     * Mapping between import names and hash names of components that referenced in other components. 
     */
    local_component_names: Map<string, string>;
}

export interface BindingInfoContainer {
    node_type: string;
    type: string;
    node: MinTreeNode | WickASTNode | WickTextNode;
    index: number;
    name: string;
    dependent_variables: Set<string>;
}

export const enum BindingType {
    READ = 1,
    WRITE = 2,
    READONLY = 1,
    WRITEONLY = 2,

    READWRITE = 3
}
export interface BindingObject {
    component_variables: Set<string>;
    read_ast?: MinTreeNode;
    write_ast?: MinTreeNode;
    cleanup_ast?: MinTreeNode;
    DEBUG: boolean;
    //TODO - Determine form of an
    annotate: string;
    type: BindingType;

    pos?: Lexer;

    name?: string;
}
export interface PendingBinding {
    html_element_index: number;
    attribute_name: string;
    host_node: WickASTNode;
    binding_node: WickBindingNode;
}
export interface BindingHandler {

    priority: number;
    canHandleBinding(attribute_name: string, node_type: string): boolean;

    prepareBindingObject(attribute_name: string, binding: WickBindingNode, host_node: WickASTNode, element_index: number, component: Component, presets?: Presets): BindingObject;
}
