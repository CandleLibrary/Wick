import { Lexer } from "@candlelib/wind";
import { ComponentData } from "./component";
import { PresetOptions } from "./presets.js";
import { HTMLNode } from "./wick_ast.js";



export const enum htmlState {
    IS_ROOT = 1,
    EXTERNAL_COMPONENT = 2,
    IS_COMPONENT = 4,
    IS_SLOT_REPLACEMENT = 8,
    IS_INTERLEAVED = 16
}

export interface HTMLHandler<T = HTMLNode, P = HTMLNode> {
    priority: number;
    /**
     *
     * If return object is the node argument, the outgoing ast will not be modified in any way.
     *
     * If return object is undefined, the next handler will be selected to process the node. In
     * this event, the returning handler should not modify the node in any way.
     *
    * If return object is null, the node will be removed from the outgoing AST.
    *
     * @param node
     * @param host_node
     * @param host_element_node
     * @param element_index
     * @param skip
     * @param replace_element Available when parsing a nodes attributes. Allows the HTMLElement node to be replaced or removed.
     * @param component
     * 
     * @async May return a promise that resolves to the givin return types.
     * 
     * @return @type {HTMLNode} | @type {void} | @type {Promise}
     */
    prepareHTMLNode(
        node: T,
        /**
         * The host (or parent) HTMLNode or HTMLAttribute of `node`
         */
        host_node: P,
        /**
         * The host HTMLNode 
         */
        host_element_node: P,
        /**
         * The index position of the HTMLNode when traversed
         * depth first. Zero starting position
         */
        element_index: number,
        skip: () => void,
        component: ComponentData,
        presets: PresetOptions
    ):
        (T | P)
        | void
        | Promise<T | P | void>;
}

export interface TemplateHTMLNode {
    tagName?: string;
    data?: string;
    attributes?: Map<string, string>;
    children?: TemplateHTMLNode[];
    strings?: string[];
    namespace?: number;
}

export type TemplatePackage = {
    html: TemplateHTMLNode[];
    templates: Map<string, TemplateHTMLNode>;
};

export type HookTemplatePackage = {
    html?: TemplateHTMLNode;
    templates?: Map<string, TemplateHTMLNode>;
};

export interface DOMLiteral {
    host_component_index: number;

    /**  Names space index id into the namespaces table. */
    name_space?: number;

    /**Tag name of the element.  */
    tag_name: string;

    /** Array of attribute {name, value} tuples. */
    attributes?: Array<[string, string]>;

    /** Array of DOM children. */
    nodes?: DOMLiteral[];

    /**  String data for TextNodes. If it is an empty string then this data will be
        assigned to the TextNode that will ultimately be created.*/
    data?: string;

    /** Index into the component's lookup table for this element. */
    element_index?: number;

    /**
     * True if the element belongs to a wick container
     */
    IS_CONTAINER?: boolean;

    /**
     * Slot Name
     */
    slot_name?: string;

    /**
     * True if is a binding.
     */
    IS_BINDING?: boolean;

    /**
     * Lexer positioned at original source location.
     */
    pos: Lexer;

    /**
     * Name of the component if this is the
     * component's root element
     */
    component_name?: string;

    container_id?: number;

    parent?: DOMLiteral;
}

export interface ContainerDomLiteral extends DOMLiteral {
    /**
     * Ordered list of component names that 
     * Container element needs to load 
     */
    component_names?: string[];

    component_attributes: [string, string][][];

    IS_CONTAINER: true;
}