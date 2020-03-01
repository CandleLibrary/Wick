import { Lexer } from "@candlefw/whind";
import { lrParse } from "@candlefw/hydrocarbon";
import { ParserData } from "@candlefw/hydrocarbon/build/types/types/parser_data";

import parser_data from "./wick_parser.js";
import env from "./parser_environment.js";
import { WickASTNode } from "../types/wick_ast_node.js";

/**
 * Parses wick markup files and produces an AST of HTML, JS, and CSS nodes.
 * 
 * @throws SyntaxError - If the parse fails, a SyntaxError will be thrown indicating
 * the point where the parser was unable to parse the input string.
 * 
 * @returns WickASTNode - The root node of an AST.
 */
export default function (input: string | Lexer): WickASTNode {

    let lex: string | Lexer = null;

    if (typeof input == "string")
        lex = new Lexer(input);
    else lex = input;

    const parse_result = lrParse(lex, <ParserData>parser_data, env);

    if (parse_result.error)
        throw new SyntaxError(parse_result.error);

    return <WickASTNode>parse_result.value;
}