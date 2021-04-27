import { Lexer } from "@candlefw/wind";

export interface DOMLiteral {

    parent?: DOMLiteral,

    /**  Names space index id into the namespaces table. */
    namespace_id?: number;

    /**Tag name of the element.  */
    tag_name: string;

    /** Array of attribute {name, value} tuples. */
    attributes?: Array<[string, string]>;

    /** Array of DOM children. */
    children?: DOMLiteral[];

    /**  String data for TextNodes. If it is an empty string then this data will be
        assigned to the TextNode that will ultimately be created.*/
    data?: string;

    /** Index into the component's lookup table for this element. */
    lookup_index?: number;

    /**
     * True if the element belongs to a wick container
     */
    is_container?: boolean;

    /**
     * Slot Name
     */
    slot_name?: string;

    /**
     * True if is a binding.
     */
    is_bindings?: boolean;

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

    ele_index?: number;
}

export interface ContainerDomLiteral extends DOMLiteral {
    /**
     * Ordered list of component names that 
     * Container element needs to load 
     */
    component_names?: string[];

    component_attribs: [string, string][][];

    is_container: true;
}