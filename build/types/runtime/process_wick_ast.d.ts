import URL from "@candlefw/url";
import Presets from "../presets.js";
import { WickASTNode } from "../types/wick_ast_node.js";
import { WickComponentErrorStore } from "../types/errors.js";
export interface WickRuntimeConstructor {
}
/**
 * Compiles a WickASTNode and returns a constructor for a runtime Wick component
 */
export declare function processWickAST(ast: WickASTNode, presets: Presets, url: URL, errors: WickComponentErrorStore): Promise<WickRuntimeConstructor>;
