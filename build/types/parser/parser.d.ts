import { Lexer } from "@candlefw/whind";
import { WickASTNode } from "../types/wick_ast_node.js";
/**
 * Parses wick markup files and produces an AST of HTML, JS, and CSS nodes.
 *
 * @throws SyntaxError - If the parse fails, a SyntaxError will be thrown indicating
 * the point where the parser was unable to parse the input string.
 *
 * @returns WickASTNode - The root node of an AST.
 */
export default function (input: string | Lexer): WickASTNode;
