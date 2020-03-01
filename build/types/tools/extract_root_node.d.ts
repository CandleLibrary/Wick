import { Yielder } from "./yielder.js";
export interface extractorYielder<T, K extends keyof T> extends Yielder<T, K> {
    receiver: {
        ast?: T | null;
    };
}
/**
 * Extracts root node from a traversed AST, even if the node has been replaced.
 * @param receiver - An object with a property [ast] that will be assigned to the root node.
 */
export declare function extract<T, K extends keyof T>(receiver: {
    ast?: T | null;
}): extractorYielder<T, K>;
