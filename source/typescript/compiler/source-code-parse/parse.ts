import { HTMLNode } from "@candlelib/html";
import { JSExpressionClass } from "@candlelib/js";
import { CSSNode } from "source/typescript/entry-point/wick-full.js";
import { Node } from "../../types/all.js";
import { metrics } from '../metrics.js';
import env from "./env.js";
import framework from "./parser_new.js";

const { parse, entry_points } = await framework;

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

    const run_tag = metrics.startRun("Parse Component");

    if (typeof input != "string")
        throw new Error("Invalid input type to wick parser =>" + typeof input);

    try {
        const
            { result: [ast], err } = parse(input, env, entry_points.wick);

        if (err)
            throw err;

        const
            comments = env.comments as Comment[] || [];


        return { ast, comments, error: null };

    } catch (error) {

        return { ast: null, comments: null, error };

    } finally {

        metrics.endRun(run_tag);
    }
};

function parse_core(input: string, entry_point: number, run_title: string) {
    const run_tag = metrics.startRun(run_title);
    try {

        const
            { result: [ast], err } = parse(input, env, entry_point);

        if (err)
            throw err;

        return ast;
    } finally {
        metrics.endRun(run_tag);
    }
}

export function parse_js_exp(input: string): JSExpressionClass {
    return parse_core(input, entry_points.js_expression, "Parse JS Expression");
};

export function parse_css(input: string): CSSNode {
    return parse_core(input, entry_points.css_stylesheet, "Parse CSS");
};

export function parse_css_selector(input: string): CSSNode {
    return parse_core(input, entry_points.css_selector, "Parse CSS Selector");
};

export function parse_html(input: string): HTMLNode {
    return parse_core(input, entry_points.html, "Parse HTML");
};
