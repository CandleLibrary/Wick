import env from "./env.js";

import parser_loader from "./wick_parser.js";

import { Node } from "../../types/all.js";
import { JSExpressionClass } from "@candlelib/js";
import { CSSNode } from "source/typescript/entry-point/wick-full.js";
import { HTMLNode } from "@candlelib/html";

const parse = await parser_loader;
/**
 * Parses wick markup files and produces an AST of HTML, JS, and CSS nodes.
 *
 * @param {string | Lexer} input
 * 
 * @returns {HTMLNode} - The root node of an
 * 
 * @throws {SyntaxError} - If the parse fails, a SyntaxError will be thrown indicating
 * the point where the parser was unable to parse the input string.
 *
 */
export function parse_component(input: string): { ast: Node, comments: Comment[]; error?: any; } {

    if (typeof input != "string")
        throw new Error("Invalid input type to wick parser =>" + typeof input);

    try {

        const
            { result: [ast] } = parse(input, env),

            //{ value: ast, error } = lrParse<Node>(lex, <ParserData>parser_data, env),

            comments = env.comments as Comment[] || [];

        return { ast, comments, error: null };
    } catch (error) {
        return { ast: null, comments: null, error };
    }
}

export function parse_js_exp(input: string): JSExpressionClass {
    return parse(input, env, parse.javascript__expression).result[0];
};

export function parse_css(input: string): CSSNode {
    return parse(input, env, parse.css__STYLE_SHEET).result[0];
};

export function parse_css_selector(input: string): CSSNode {
    return parse(input, env, parse.css__COMPLEX_SELECTOR).result[0];
};

export function parse_html(input: string): HTMLNode {
    return parse(input, env, parse.html__TAG).result[0];
};
