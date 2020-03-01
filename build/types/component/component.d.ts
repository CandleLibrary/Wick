import URL from "@candlefw/url";
import { WickComponentErrorStore } from "../types/errors.js";
import { WickASTNode } from "../types/wick_ast_node.js";
import Presets from "./presets.js";
interface WickComponentProducer {
    /**
     * True when compilation on the component has completed and it is
     * ready to produce DOM elements.
     */
    IS_READY: boolean;
    /**
     * The underlying abstract syntax tree that defines the component.
     */
    AST: WickASTNode;
    /**
     * A URL pointing to the original location of the component. Can be
     * the same as the webpage or working directory if a string was passed
     * to MakeComponent function.
     */
    URL: URL;
    /**
     * {WickComponentErrorStore}
     */
    errors: WickComponentErrorStore;
}
/**
 * This functions is used to compile a Wick component, which can then be immediately
 * It will accept a string containing wick markup, or a URL that points to a wick component.
 *
 * @param input {number}
 * @param presets {PresetOptions} -
 * @param root_url
 */
export default function MakeComponent(input: URL | string, presets?: Presets, root_url?: URL): Promise<WickComponentProducer>;
export {};
