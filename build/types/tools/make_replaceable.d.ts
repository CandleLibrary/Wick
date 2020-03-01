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
export declare function replaceable<T, K extends keyof T>(replace_function: replaceFunctionType<T>): replaceYielder<T, K>;
export {};
