export function output(receptical) {
    if (!new.target)
        return new output(receptical);
    let nx = null;
    this.complete = function (node) {
        receptical.ast = node;
        if (nx)
            return nx.complete(node);
        return node;
    };
    this.yield = function (node, stack_pointer, node_stack, val_length_stack) {
        if (nx)
            return nx.yield(node, stack_pointer, node_stack, val_length_stack);
        else
            return node;
    };
    this.next_prep = prev => (prev.next = a => this.next(a, prev), prev);
}
