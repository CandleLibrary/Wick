export interface DOMLiteral {

    /**  Names space index id into the namespaces table. */
    n: number;

    /**Tag name of the element.  */
    t: string;

    /** Array of attribute {name, value} tuples. */
    a: Array<[string, string]>;

    /** Array of DOM children. */
    c: DOMLiteral[];

    /**  String data for TextNodes. If t is an empty string then this data will be
        assigned to the TextNode that will ultimately be created.*/
    d: string;

    /** If true then the Element should be imported as a wick component.  */
    w?: boolean;

    /** Index into the lookup table for this element. */
    i?: number;

    /**
     * Name of a named component
     */
    cp?: string;

    /**
     * Hash name of container component
     */
    ct?: boolean;

    /**
     * Slot Name
     */
    sl?: string;

    /**
     * Namespace id
     */
    ns?: number;

    /**
     * True if is a binding.
     */
    b?: boolean;
}
