import URL from "@candlefw/url";
import { WickComponentErrorCode } from "../types/errors";
import parser from "../parser/parser.js";
import { WickASTNodeType } from "../types/wick_ast_node";
import { processWickAST } from "../component/process_wick_ast";
/**
 * This functions is used to compile a live Wick component, which can then be immediately
 * mounted to the DOM. It will accept a string containing wick markup, or a
 * URL that points to a wick component.
 *
 * @param input - A string or cfw.URL.
 *
 * @param root_url - A URL to resolve relative paths from.
 */
export default async function MakeComponent(input, root_url) {
    const error_store = { errors: [] };
    let wick_syntax_string = input;
    /**
     * If a string has been passed the we need to determine if it is a wick component
     * or a URL. The naive way to do this is to check to see if the leading character
     * is [ < ], since an HTML wick component must begin with an HTML tag. This will
     * only work if the string does not have leading spaces, and does not allow for other
     * wick component syntax forms that may be implemented. The inverse of this would
     * be to check for the protocol portion of a URL at the beginning of the string; however,
     * if we allow relative URL paths then this would not catch such forms.
     *
     * Another way to test for URLiness is to check for white spaces, since well formatted
     * URLs do not have whitespace characters. This does require scanning the entire string
     * to ensure that there are no whitespace characters within. It also does not take into account
     * possible HTML syntax that does not yield whitespace characters, such as `<div>no-white-space</div>`.
     *
     * For now, a brute force method will be to use the URL constructor parse the input string. We test for the
     * presence of a hostname and/or path on the result, and if the string yields values for these, we
     * assume the string is a URL and proceed to fetch data from the URL. If a resource cannot be fetched,
     * we proceed with parsing the string as a wick component.
     */
    const url = URL.resolveRelative(input + "", root_url || URL);
    if (input instanceof URL || url.path || url.host) {
        try {
            wick_syntax_string = await url.fetchText(false);
        }
        catch (e) {
            error_store.errors.push({
                message: `Tried to retrieve component data from ${url.toString()} but received error.`,
                ref: WickComponentErrorCode.FAILED_TO_FETCH_RESOURCE,
                error_object: e instanceof Error ? e : null,
                URL: url
            });
        }
    }
    let ast = null;
    /**
     * We are now assuming that the input has been converted to a string containing wick markup.
     * We'll let the parser handle any syntax errors.
     */
    try {
        ast = parser(wick_syntax_string);
    }
    catch (e) {
        error_store.errors.push({
            message: `Failed to parse wick component`,
            ref: WickComponentErrorCode.SYNTAX_ERROR_DURING_PARSE,
            error_object: e instanceof Error ? e : null,
            URL: url
        });
        /**
         * Since we were unable to process the input we'll create an error ast that can be used to generate
         * an error report component.
         */
        ast = { type: WickASTNodeType.ERROR, errors: error_store };
    }
    const processed_ast = await processWickAST(ast, error_store);
    return {
        AST: processed_ast,
        IS_READY: true,
        URL: url
    };
}
;
