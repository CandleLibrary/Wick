import URL from "@candlefw/url";
import { WickASTNode } from "../types/wick_ast_node";
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
}
/**
 * This functions is used to compile a live Wick component, which can then be immediately
 * mounted to the DOM. It will accept a string containing wick markup, or a
 * URL that points to a wick component.
 *
 * @param input - A string or cfw.URL.
 *
 * @param root_url - A URL to resolve relative paths from.
 */
export default function MakeComponent(input: URL | string, root_url?: URL): Promise<WickComponentProducer>;
export {};
