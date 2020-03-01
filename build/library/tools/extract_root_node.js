import { Yielder } from "./yielder.js";
/**
 * Extracts root node from a traversed AST, even if the node has been replaced.
 * @param receiver - An object with a property [ast] that will be assigned to the root node.
 */
export function extract(receiver) {
    if (!receiver || typeof receiver !== "object")
        throw new TypeError("Expected argument receiver to be of type [Object] when calling function extract.");
    const obj = Object.assign(new Yielder(), {
        receiver
    });
    obj.complete = extractorComplete;
    return obj;
}
function extractorComplete(node, stack_pointer, node_stack, val_length_stack) {
    this.receiver.ast = node;
    return this.completeNext(node, stack_pointer, node_stack, val_length_stack);
}
