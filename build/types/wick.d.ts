import parser from "./parser/parser.js";
import URL from "@candlefw/url";
import Presets from "./component/presets.js";
import { WickASTNode } from "./types/wick_ast_node.js";
import { WickComponentErrorStore } from "./types/errors.js";
interface WickComponent {
    presets: Presets;
    ast: WickASTNode;
    errors: WickComponentErrorStore;
    pending: Promise<WickComponent>;
}
/**
 * Creates a raw Wick component.
 */
declare function wick(input: string | URL, presets?: Presets): WickComponent;
export { wick, parser };
