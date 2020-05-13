import { MinTreeNode } from "@candlefw/js";
import { WickASTNode, WickBindingNode, WickTextNode } from "./wick_ast_node_types.js";
import URL from "@candlefw/url";
import { Lexer } from "@candlefw/wind";
import Presets from "../component/presets.js";

export interface ComponentVariable {
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
    scripts: {
        type: string, ast: MinTreeNode, binding_variables: string[], locals: Set<string>;
    }[];

    /**
     * List of pending bindings to be
     * processed.
     */
    pending_bindings: PendingBinding[];

    /**
     * List of component names.
     */
    variables: Map<string, ComponentVariable>;
    locals: Set<string>;
    /**
     * The original syntax tree.
     */
    original_ast: MinTreeNode | WickASTNode;

    /**
     * The consumption ready form of the component.
     */
    compiled_ast: MinTreeNode;

    /**
     * List of IdentifierReference nodes that have component
     * names that need to be replaced with equivalent class
     * names.
     */
    declarations: MinTreeNode[];

    /**
     * URL of source file for this component
     */
    source: URL;

    /**
     * List of class method ASTs to compile into
     * the finalized component. 
     */
    class_methods: MinTreeNode[];

    /**
     * List of statement ASTs to add to the component
     * class initializer method.
     */
    class_initializer_statements: MinTreeNode[];

    /**
     * List of statement ASTs to add to the component
     * class cleanup method.
     */
    class_cleanup_statements: MinTreeNode[];

    element: WickASTNode;

    nluf_arrays: MinTreeNode[][];

    addBinding: (PendingBinding) => void;

    /**
     * Names assigned to the component
     */
    names: string[];
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
