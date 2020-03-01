import { Yielder } from "./yielder.js";
export class filterYielder extends Yielder {
}
export function filter(key, ...types) {
    const obj = Object.assign(new filterYielder(), {
        filter_key: key,
        types: new Set(types)
    });
    obj.yield = filterYield;
    return obj;
}
function filterYield(node, stack_pointer, node_stack, val_length_stack) {
    const type = node[this.filter_key] + "";
    if (this.types.has(type))
        return this.yieldNext(node, stack_pointer, node_stack, val_length_stack);
    return null;
}
