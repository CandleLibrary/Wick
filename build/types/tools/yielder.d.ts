export declare class Yielder<T, K extends keyof T> {
    nx: Yielder<T, K>;
    key: K;
    constructor();
    complete(node: T, stack_pointer: number, node_stack: T[], val_length_stack: number[]): T | null;
    completeNext(node: T, stack_pointer: number, node_stack: T[], val_length_stack: number[]): T | null;
    yield(node: T, stack_pointer: number, node_stack: T[], val_length_stack: number[]): T | null;
    yieldNext(node: T, stack_pointer: number, node_stack: T[], val_length_stack: number[]): T | null;
    then(yielder: Yielder<T, K>, subnode_key: K): Yielder<T, K>;
}
