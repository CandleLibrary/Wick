import { Yielder } from "./yielder.js";
export function replaceable(replace_function) {
    const obj = Object.assign(new Yielder(), {});
    obj.replace_function = replace_function ? replace_function : (node, child, child_index, children) => Object.assign({}, node);
    obj.yield = replaceYield;
    return obj;
}
function replaceYield(node, stack_pointer, node_stack, val_length_stack) {
    const replaceable = Object.assign({
        replace: (node) => replace(this, node, stack_pointer, node_stack, val_length_stack)
    }, node);
    return this.yieldNext(node, stack_pointer, node_stack, val_length_stack);
}
function replace(replaceYielder, replacement_node, stack_pointer, node_stack, val_length_stack) {
    let sp = stack_pointer - 1;
    //need to trace up the current stack and replace each node with a duplicate
    let child = replacement_node;
    while (sp >= 0) {
        const parent = node_stack[sp], index = val_length_stack[sp], children = parent[replaceYielder.key].slice();
        children[index] = child;
        child = replaceYielder.replace_function(parent, child, index, children);
        child[replaceYielder.key] = children;
        node_stack[sp--] = child;
    }
}
