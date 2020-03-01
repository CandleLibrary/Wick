import { Yielder } from "./yielder.js";
declare type ASTIterator<T, K extends keyof T> = Iterable<T> & {
    /**
     * Adds a node Yielder to the end of the yield chain.
     *
     * @param next_yielder A Node Yielder
     */
    then: (arg0: Yielder<T, K>) => ASTIterator<T, K>;
};
/**
 * This template function will traverse a generic AST of type {T} and return nodes depth first. It uses Yielders
 * to perform non-destructive transforms on the AST.
 * @param node - The root node of the AST tree.
 * @param children_key - The property of the node that contains its immediate descendants
 * @param max_depth - The maximum level of the tree to return nodes from, starting level at 1 for the root node.
 */
export declare function traverse<T, K extends keyof T>(node: T, children_key: K, max_depth?: number): ASTIterator<T, K>;
export {};
