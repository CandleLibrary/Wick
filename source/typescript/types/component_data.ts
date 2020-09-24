import { JSNode } from "@candlefw/js";
import { CSSNode } from "@candlefw/css";
import URL from "@candlefw/url";
import { Lexer } from "@candlefw/wind";
import { HTMLNode } from "./wick_ast_node_types.js";
import { DOMLiteral } from "./dom_literal.js";
import { PendingBinding, BINDING_SELECTOR } from "./binding";
import { FunctionFrame } from "./function_frame";
import { Comment } from "./comment.js";
import { ComponentStyle } from "./component_style.js";

export interface ComponentData {

    /**
     * True if errors were encountered when processing
     * the component. Also, if true, this component will
     * generate an error report element if it is mounted
     * to the DOM.
     */
    HAS_ERRORS: boolean;

    errors: Error[];

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
        binding_selector: BINDING_SELECTOR | string;
        binding_val: JSNode | HTMLNode | CSSNode | any;
        host_node: JSNode | HTMLNode | CSSNode;
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
    name: string;

    /**
     * Global string identifiers for this particular component
     */
    names: string[];

    /**
     * A linkage between a binding variable and any element that is
     * modified by the binding variable, including HTML attributes,
     * CSS attributes, and other binding variables.
     */
    bindings: PendingBinding[];

    /**
     * The virtual DOM as described within a component with a .html extension or with a
     */
    HTML: DOMLiteral;

    /**
     * Any information that should be stored in the head of the document
     */
    HTML_HEAD: HTMLNode[];

    CSS: ComponentStyle[];

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

    /**
     * Array of Lexers fenced to comment sections
     */
    comments?: Comment[];
}
