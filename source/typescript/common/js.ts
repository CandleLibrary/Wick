import { exp, JSBindingExpression, JSBindingProperty, JSExpressionClass, JSIdentifier, JSNode, JSNodeClass, JSNodeType } from "@candlefw/js";

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

export function convertObjectToJSNode(obj: any): JSExpressionClass {

    switch (typeof obj) {
        case "string":
            return <JSExpressionClass>exp(`"${obj.replace(/\"/g, "\\\"")}"`);
        case "boolean":
        case "undefined":
        case "number":
            return <JSExpressionClass>exp(`${obj}`);
        case "object": {

            if (Array.isArray(obj)) {
                const node = exp("[]");

                for (const o of obj)
                    //@ts-ignore
                    node.nodes.push(convertObjectToJSNode(o));

                return <JSExpressionClass>node;
            }

            const node = exp("({})").nodes[0];

            for (const name in obj) {
                const val = convertObjectToJSNode(obj[name]);
                //@ts-ignore
                node.nodes.push(<JSBindingProperty>{
                    type: JSNodeType.PropertyBinding,
                    nodes: [exp(name), val],
                    symbol: ":"
                });
            }

            return <JSExpressionClass>node;
        }

    }

    return null;
}

export function Node_Is_Identifier(node: JSNode): node is JSIdentifier {
    return (node.type & JSNodeClass.IDENTIFIER) > 0;
}


export function Expression_Contains_Await(input_node: JSNode) {
    for (const { node } of traverse(input_node, "nodes").filter("type", JSNodeType.AwaitExpression))
        return true;
    return false;
}
