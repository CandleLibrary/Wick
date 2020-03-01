import { Yielder } from "./yielder.js";
export declare class filterYielder<T, K extends keyof T> extends Yielder<T, K> {
    filter_key: string;
    types: Set<string>;
}
export declare function filter<T, K extends keyof T, D extends keyof T>(key: D, ...types: string[]): Yielder<T, K>;
