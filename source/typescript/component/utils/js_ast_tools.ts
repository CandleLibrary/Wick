import { exp, JSNode } from "@candlefw/js";

/**
 * Create an AST of the form
 * ```js
 * name : property_value
 * 
 * ````
 * 
 * @param name :  A string or @type {JSNode} specifying the name of the property.
 * @param value : A string or @type {JSNode} specifying the value of the property.
 * @param {boolean} COMPUTED
 * If true the returned computed value should appear as:
 * 
 * ```js
 * [name] : property_value
 * ```
 */
export function getPropertyAST(name: string | JSNode, value: string | JSNode, COMPUTED: boolean = false) {
    return exp(`({${name}:${value}})`).nodes[0].nodes[0];
}
/**
 * Create a class method AST
 * @param name  Name of the classrender method
 * @param arg_string  String value of the class method arguments.
 * @param body_string  String value of the class method body.
 */
export function getGenericMethodNode(name = "generic", arg_string = "", body_string = ";") {

    return exp(`({${name}(${arg_string}){${body_string}}})`).nodes[0].nodes[0];
}

export function getObjectLiteralAST(...key_vals) {

    const props =
        key_vals
            .reduce((r, v, i) => ((1 - (i % 2)) ? (r.push([v]), r) : (r.slice(-1)[0][1] = v, r)), [])
            .map(([n, v]) => `"${n}":${v}`);

    return exp(`({${props}})`).nodes[0];
}
