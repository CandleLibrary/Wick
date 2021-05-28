import {
    CustomFormatFunction,
    renderCompressed as CFLrenderCompressed,
    renderWithFormatting as CFLrenderWithFormatting,
    renderWithSourceMap as CFLrenderWithSourceMap,
    renderWithFormattingAndSourceMap as CFLrenderWithFormattingAndSourceMap,
    FormatRule
} from "@candlelib/conflagrate";
import { FormatFunction as JSFormatFunction, JSNode } from "@candlelib/js";
import { CSSNode, FormatFunction as CSSFormatFunction } from "@candlelib/css";

import { renderers, format_rules } from "./rules.js";
import { Node } from "../../types/all.js";


export const FormatFunction: CustomFormatFunction<Node> = (val, prop_name, node) => {

    let str = JSFormatFunction(val, prop_name, <JSNode>node);

    str = CSSFormatFunction(str, prop_name, <CSSNode>node);

    return str;

};

export function renderCompressed(
    node: Node
) {
    return CFLrenderCompressed<Node>(node, renderers, FormatFunction);
}

export function renderWithFormatting(
    node: Node,
    //format rules
    fr: FormatRule[] = format_rules.format_rules
) {
    return CFLrenderWithFormatting<Node>(node, renderers, fr, FormatFunction);
}

export function renderWithSourceMap(
    node: Node,

    //source map data
    map: Array<number[]> = null,
    source_index = -1,
    names: Map<string, number> = null,
) {

    return CFLrenderWithSourceMap<Node>(node, renderers, map, source_index, undefined, FormatFunction);
}

export function renderWithFormattingAndSourceMap(
    node: Node,

    //format rules
    fr: FormatRule[] = format_rules.format_rules,
    formatString = FormatFunction,


    //source map data
    map: Array<number[]> = null,
    source_index = -1,
    names: Map<string, number> = null,
) {
    return CFLrenderWithFormattingAndSourceMap<Node>(node, renderers, fr, formatString, map, source_index, names);
}