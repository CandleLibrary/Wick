import { Lexer } from "@candlefw/wind";

import { lrParse, ParserData } from "@candlefw/hydrocarbon/build/library/runtime.js";

import parser_data from "./wick_parser.js";
import env from "./env.js";
import { HTMLNode } from "../types/wick_ast_node_types.js";



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
export default function (input: string | Lexer, source = ""): HTMLNode {

    let lex: string | Lexer = null;

    if (typeof input == "string")
        lex = new Lexer(input);
    else lex = input;

    if (source)
        lex.source = source;

    const parse_result = lrParse(lex, <ParserData>parser_data, env);

    if (parse_result.error)
        throw new SyntaxError(parse_result.error);

    return <HTMLNode>parse_result.value;
}