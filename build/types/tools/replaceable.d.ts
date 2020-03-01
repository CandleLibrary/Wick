import { Yielder } from "./yielder.js";
/**
 * Called when a child node of a node is replaced. Allows
 * the node to be duplicated and transformed to keep the
 * AST unique.
 */
declare type replaceFunctionType<T> = (node: T, child: T, child_index: number, children: T[]) => T;
export interface replaceYielder<T, K extends keyof T> extends Yielder<T, K> {
    replace_function?: replaceFunctionType<T>;
}
/**
 * Adds a replace method to the node, allowing the node to be replaced with another node.
 *
 * @param {replaceFunctionType} replace_function - A function used to handle the replacement
 * of ancestor nodes when a child node is replaced. Defaults to shallow copy assignments for
 * each ancestor of the replaced node.
 */
export declare function make_replaceable<T, K extends keyof T>(replace_function?: replaceFunctionType<T>): replaceYielder<T, K>;
export {};
