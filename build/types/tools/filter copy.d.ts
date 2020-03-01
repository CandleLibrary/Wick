import { Yielder } from "./yielder.js";
export interface filterYielder<T, K extends keyof T, TypeKey extends keyof T> extends Yielder<T, K> {
    filter_key: TypeKey;
    types: Set<string>;
}
export declare function filter<T, K extends keyof T, TypeKey extends keyof T>(key: TypeKey, ...types: string[]): filterYielder<T, K, TypeKey>;
