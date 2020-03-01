export class Yielder {
    constructor() {
        this.nx = null;
    }
    complete(node, stack_pointer, node_stack, val_length_stack) {
        return this.completeNext(node, stack_pointer, node_stack, val_length_stack);
    }
    completeNext(node, stack_pointer, node_stack, val_length_stack) {
        if (this.nx)
            return this.nx.complete(node, stack_pointer, node_stack, val_length_stack);
        return node;
    }
    yield(node, stack_pointer, node_stack, val_length_stack) {
        return this.yieldNext(node, stack_pointer, node_stack, val_length_stack);
    }
    yieldNext(node, stack_pointer, node_stack, val_length_stack) {
        if (this.nx)
            return this.nx.yield(node, stack_pointer, node_stack, val_length_stack);
        return node;
    }
    then(yielder, subnode_key) {
        this.key = subnode_key;
        if (this.nx)
            return this.nx.then(yielder, subnode_key);
        this.nx = yielder;
        return yielder;
    }
}
