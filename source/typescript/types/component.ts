import { CSSNode } from "@candlelib/css";
import URL from "@candlelib/uri";
import { WickRTComponent } from "../runtime/component.js";
import { RuntimeComponent } from "../entry-point/wick-full.js";
import { IntermediateHook, IndirectHook } from "./hook";
import { Comment } from "./comment.js";
import { WickComponentErrorStore } from "./errors.js";
import { FunctionFrame } from "./function_frame";
import { DOMLiteral, TemplateHTMLNode } from "./html.js";
import { HTMLNode } from "./wick_ast.js";


export type ComponentClassStrings = { class_string: string; source_map: string; };

export interface ComponentStyle {
    data: CSSNode;

    /**
     * If the style is defined within the same file
     * as the component element, the style is considered
     * inlined.
     */
    INLINE: boolean;

    location: string;

    container_element_index: number;
}

export interface ComponentData {
    /**
     * The radiate client side router should be used if 
     * this true and the component is the root of the 
     * component tree. 
     */
    RADIATE: boolean;

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
     * Name of a model defined in presets that will be auto assigned to the
     * component instance when it is created.
     */
    global_model_name: string;

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
    hooks: IntermediateHook[];

    /**
     * The virtual DOM as described within a component with a .html extension or with a
     */
    HTML: DOMLiteral;

    /**
     * HTML elements that should be placed in the head of the document
     */
    HTML_HEAD: HTMLNode[];

    CSS: ComponentStyle[];

    /**
     * URL of source file for this component
     */
    location: URL;

    /**
     * Mapping between import names and hash names of components that are 
     * referenced in other components.
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

    /**
     * List of foreign component hash names that claim this component's 
     * root ele. The first element is the "owner" component that has full 
     * control of the element. Subsequent listed components are "borrowers" 
     * of the element.
     */
    root_ele_claims: string[];

    /**
     * A a template object for use with static pages
     */
    template: TemplateHTMLNode;

    indirect_hooks: IndirectHook<any>[];
}

/**
 * A compiled component that can be mounted to a DOM node.
 */

interface Extension {
    errors: WickComponentErrorStore;
    pending: Promise<Extension & ComponentData>;
    mount: (data?: object, ele?: HTMLElement) => Promise<WickRTComponent>;
    class: typeof RuntimeComponent;
    class_with_integrated_css: typeof RuntimeComponent;
    class_string: string;
}
/**
 * @type {ExtendedComponentData}
 */
export type ExtendedComponentData = (ComponentData & Extension);
