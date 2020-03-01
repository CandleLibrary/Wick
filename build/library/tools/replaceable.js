import { Yielder } from "./yielder.js";
import { getChildContainerLength } from "./child_container_functions.js";
/**
 * Adds a replace method to the node, allowing the node to be replaced with another node.
 *
 * @param {replaceFunctionType} replace_function - A function used to handle the replacement
 * of ancestor nodes when a child node is replaced. Defaults to shallow copy assignments for
 * each ancestor of the replaced node.
 */
export function make_replaceable(replace_function) {
    const obj = Object.assign(new Yielder(), {});
    obj.replace_function = replace_function ? replace_function : (node, child, child_index, children) => Object.assign({}, node);
    obj.yield = replaceYield;
    return obj;
}
function replaceYield(node, stack_pointer, node_stack, val_length_stack) {
    const replaceable = Object.assign({
        index: (val_length_stack[stack_pointer - 1] & 0xFFFF) - 1,
        replace: (node) => replace(this, node, stack_pointer, node_stack, val_length_stack)
    }, node);
    return this.yieldNext(replaceable, stack_pointer, node_stack, val_length_stack);
}
function replace(replaceYielder, replacement_node, stack_pointer, node_stack, val_length_stack) {
    const key = replaceYielder.key;
    let sp = stack_pointer;
    //need to trace up the current stack and replace each node with a duplicate
    let node = replacement_node;
    while (sp >= 0) {
        const len = val_length_stack[sp], limit = len & 0xFFFF0000 >>> 16, index = len & 0xFFFF, new_child_children_length = getChildContainerLength(node, key);
        if (new_child_children_length < limit)
            val_length_stack[sp] |= (new_child_children_length << 16);
        if (node == null)
            val_length_stack[sp]--;
        node_stack[sp] = node;
        if (--sp > -1) {
            const parent = node_stack[sp], children = parent[replaceYielder.key].slice();
            children[(val_length_stack[sp] & 0xFFFF) - 1] = node;
            node = replaceYielder.replace_function(parent, node, (val_length_stack[sp] & 0xFFFF) - 1, children);
            node[replaceYielder.key] = children;
        }
    }
}
