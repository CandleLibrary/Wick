import { buildRenderers, experimentalConstructRenderers, NodeMappings } from "@candlelib/conflagrate";
import { HTMLNodeType, Node } from "../../types/all.js";
import { NodeTypes } from "../source-code-parse/env.js";
import { render_mappings as js_mappings } from '@candlelib/js';



export const wick_mappings: NodeMappings<Node, "type"> = <NodeMappings<Node, "type">>{
    typename: "type",
    type_lookup: null,
    mappings: [
        ...js_mappings.mappings,
        {
            type: HTMLNodeType.HTML_DIV,
            template: "\\<div o:s @attributes... o:s \\> i:s @nodes... i:e  \\</div>",
            format_rule: 0
        },
        {
            type: HTMLNodeType.HTML_TT,
            template: "\\<tt o:s @attributes... o:s \\> i:s @nodes... i:e  \\</tt>"
        },
        {
            type: HTMLNodeType.HTML_I,
            template: "\\<i o:s @attributes... o:s \\> i:s @nodes... i:e  \\</i>"
        },
        {
            type: HTMLNodeType.HTML_B,
            template: "\\<b o:s @attributes... o:s \\> i:s @nodes... i:e  \\</b>"
        },
        {
            type: HTMLNodeType.HTML_BIG,
            template: "\\<big o:s @attributes... o:s \\> i:s @nodes... i:e  \\</big>"
        },
        {
            type: HTMLNodeType.HTML_SMALL,
            template: "\\<small o:s @attributes... o:s \\> i:s @nodes... i:e  \\</small>"
        },
        {
            type: HTMLNodeType.HTML_EM,
            template: "\\<em o:s @attributes... o:s \\> i:s @nodes... i:e  \\</em>"
        },
        {
            type: HTMLNodeType.HTML_STRONG,
            template: "\\<strong o:s @attributes... o:s \\> i:s @nodes... i:e  \\</strong>"
        },
        {
            type: HTMLNodeType.HTML_DFN,
            template: "\\<dfn o:s @attributes... o:s \\> i:s @nodes... i:e  \\</dfn>"
        },
        {
            type: HTMLNodeType.HTML_CODE,
            template: "\\<code o:s @attributes... o:s \\> i:s @nodes... i:e  \\</code>"
        },
        {
            type: HTMLNodeType.HTML_SAMP,
            template: "\\<samp o:s @attributes... o:s \\> i:s @nodes... i:e  \\</samp>"
        },
        {
            type: HTMLNodeType.HTML_KBD,
            template: "\\<kbd o:s @attributes... o:s \\> i:s @nodes... i:e  \\</kbd>"
        },
        {
            type: HTMLNodeType.HTML_VAR,
            template: "\\<var o:s @attributes... o:s \\> i:s @nodes... i:e  \\</var>"
        },
        {
            type: HTMLNodeType.HTML_CITE,
            template: "\\<cite o:s @attributes... o:s \\> i:s @nodes... i:e  \\</cite>"
        },
        {
            type: HTMLNodeType.HTML_ABBR,
            template: "\\<abbr o:s @attributes... o:s \\> i:s @nodes... i:e  \\</abbr>"
        },
        {
            type: HTMLNodeType.HTML_ACRONYM,
            template: "\\<acronym o:s @attributes... o:s \\> i:s @nodes... i:e  \\</acronym>"
        },
        {
            type: HTMLNodeType.HTML_SUP,
            template: "\\<sup o:s @attributes... o:s \\> i:s @nodes... i:e  \\</sup>"
        },
        {
            type: HTMLNodeType.HTML_SPAN,
            template: "\\<span o:s @attributes... o:s \\> i:s @nodes... i:e  \\</span>"
        },
        {
            type: HTMLNodeType.HTML_BDO,
            template: "\\<bdo o:s @attributes... o:s \\> i:s @nodes... i:e  \\</bdo>"
        },
        {
            type: HTMLNodeType.HTML_BR,
            template: "\\<br o:s @attributes... o:s \\/>"
        },
        {
            type: HTMLNodeType.HTML_BODY,
            template: "\\<body o:s @attributes... o:s \\> i:s @nodes... i:e  \\</body>"
        },
        {
            type: HTMLNodeType.HTML_ADDRESS,
            template: "\\<address o:s @attributes... o:s \\> i:s @nodes... i:e  \\</address>"
        },
        {
            type: HTMLNodeType.HTML_A,
            template: "\\<a o:s @attributes... o:s \\> i:s @nodes... i:e  \\</a>"
        },
        {
            type: HTMLNodeType.HTML_MAP,
            template: "\\<map o:s @attributes... o:s \\> i:s @nodes... i:e  \\</map>"
        },
        {
            type: HTMLNodeType.HTML_AREA,
            template: "\\<area o:s @attributes... o:s \\> i:s @nodes... i:e  \\</area>"
        },
        {
            type: HTMLNodeType.HTML_LINK,
            template: "\\<link o:s @attributes... o:s \\> i:s @nodes... i:e  \\</link>"
        },
        {
            type: HTMLNodeType.HTML_IMG,
            template: "\\<img o:s @attributes... o:s \\> i:s @nodes... i:e  \\</img>"
        },
        {
            type: HTMLNodeType.HTML_OBJECT,
            template: "\\<object o:s @attributes... o:s \\> i:s @nodes... i:e  \\</object>"
        },
        {
            type: HTMLNodeType.HTML_PARAM,
            template: "\\<param o:s @attributes... o:s \\> i:s @nodes... i:e  \\</param>"
        },
        {
            type: HTMLNodeType.HTML_HR,
            template: "\\<hr o:s @attributes... o:s \\> i:s @nodes... i:e  \\</hr>"
        },
        {
            type: HTMLNodeType.HTML_P,
            template: "\\<p o:s @attributes... o:s \\> i:s @nodes... i:e  \\</p>"
        },
        {
            type: HTMLNodeType.HTML_H1,
            template: "\\<h1 o:s @attributes... o:s \\> i:s @nodes... i:e  \\</h1>"
        },
        {
            type: HTMLNodeType.HTML_H2,
            template: "\\<h2 o:s @attributes... o:s \\> i:s @nodes... i:e  \\</h2>"
        },
        {
            type: HTMLNodeType.HTML_H3,
            template: "\\<h3 o:s @attributes... o:s \\> i:s @nodes... i:e  \\</h3>"
        },
        {
            type: HTMLNodeType.HTML_H4,
            template: "\\<h4 o:s @attributes... o:s \\> i:s @nodes... i:e  \\</h4>"
        },
        {
            type: HTMLNodeType.HTML_H5,
            template: "\\<h5 o:s @attributes... o:s \\> i:s @nodes... i:e  \\</h5>"
        },
        {
            type: HTMLNodeType.HTML_H6,
            template: "\\<h6 o:s @attributes... o:s \\> i:s @nodes... i:e  \\</h6>"
        },
        {
            type: HTMLNodeType.HTML_PRE,
            template: "\\<pre o:s @attributes... o:s \\> i:s @nodes... i:e  \\</pre>"
        },
        {
            type: HTMLNodeType.HTML_Q,
            template: "\\<q o:s @attributes... o:s \\> i:s @nodes... i:e  \\</q>"
        },
        {
            type: HTMLNodeType.HTML_BLOCKQUOTE,
            template: "\\<blockquote o:s @attributes... o:s \\> i:s @nodes... i:e  \\</blockquote>"
        },
        {
            type: HTMLNodeType.HTML_INS,
            template: "\\<ins o:s @attributes... o:s \\> i:s @nodes... i:e  \\</ins>"
        },
        {
            type: HTMLNodeType.HTML_DEL,
            template: "\\<del o:s @attributes... o:s \\> i:s @nodes... i:e  \\</del>"
        },
        {
            type: HTMLNodeType.HTML_DL,
            template: "\\<dl o:s @attributes... o:s \\> i:s @nodes... i:e  \\</dl>"
        },
        {
            type: HTMLNodeType.HTML_DT,
            template: "\\<dt o:s @attributes... o:s \\> i:s @nodes... i:e  \\</dt>"
        },
        {
            type: HTMLNodeType.HTML_DD,
            template: "\\<dd o:s @attributes... o:s \\> i:s @nodes... i:e  \\</dd>"
        },
        {
            type: HTMLNodeType.HTML_OL,
            template: "\\<ol o:s @attributes... o:s \\> i:s @nodes... i:e  \\</ol>"
        },
        {
            type: HTMLNodeType.HTML_UL,
            template: "\\<ul o:s @attributes... o:s \\> i:s @nodes... i:e  \\</ul>"
        },
        {
            type: HTMLNodeType.HTML_LI,
            template: "\\<li o:s @attributes... o:s \\> i:s @nodes... i:e  \\</li>"
        },
        {
            type: HTMLNodeType.HTML_FORM,
            template: "\\<form o:s @attributes... o:s \\> i:s @nodes... i:e  \\</form>"
        },
        {
            type: HTMLNodeType.HTML_LABEL,
            template: "\\<label o:s @attributes... o:s \\> i:s @nodes... i:e  \\</label>"
        },
        {
            type: HTMLNodeType.HTML_INPUT,
            template: "\\<input o:s @attributes... o:s \\/>"
        },
        {
            type: HTMLNodeType.HTML_SELECT,
            template: "\\<select o:s @attributes... o:s \\> i:s @nodes... i:e  \\</select>"
        },
        {
            type: HTMLNodeType.HTML_OPTGROUP,
            template: "\\<optgroup o:s @attributes... o:s \\> i:s @nodes... i:e  \\</optgroup>"
        },
        {
            type: HTMLNodeType.HTML_OPTION,
            template: "\\<option o:s @attributes... o:s \\> i:s @nodes... i:e  \\</option>"
        },
        {
            type: HTMLNodeType.HTML_TEXTAREA,
            template: "\\<textarea o:s @attributes... o:s \\> i:s @nodes... i:e  \\</textarea>"
        },
        {
            type: HTMLNodeType.HTML_FIELDSET,
            template: "\\<fieldset o:s @attributes... o:s \\> i:s @nodes... i:e  \\</fieldset>"
        },
        {
            type: HTMLNodeType.HTML_LEGEND,
            template: "\\<legend o:s @attributes... o:s \\> i:s @nodes... i:e  \\</legend>"
        },
        {
            type: HTMLNodeType.HTML_BUTTON,
            template: "\\<button o:s @attributes... o:s \\> i:s @nodes... i:e  \\</button>"
        },
        {
            type: HTMLNodeType.HTML_TABLE,
            template: "\\<table o:s @attributes... o:s \\> i:s @nodes... i:e  \\</table>"
        },
        {
            type: HTMLNodeType.HTML_CAPTION,
            template: "\\<caption o:s @attributes... o:s \\> i:s @nodes... i:e  \\</caption>"
        },
        {
            type: HTMLNodeType.HTML_THEAD,
            template: "\\<thead o:s @attributes... o:s \\> i:s @nodes... i:e  \\</thead>"
        },
        {
            type: HTMLNodeType.HTML_TFOOT,
            template: "\\<tfoot o:s @attributes... o:s \\> i:s @nodes... i:e  \\</tfoot>"
        },
        {
            type: HTMLNodeType.HTML_TBODY,
            template: "\\<tbody o:s @attributes... o:s \\> i:s @nodes... i:e  \\</tbody>"
        },
        {
            type: HTMLNodeType.HTML_COLGROUP,
            template: "\\<colgroup o:s @attributes... o:s \\> i:s @nodes... i:e  \\</colgroup>"
        },
        {
            type: HTMLNodeType.HTML_COL,
            template: "\\<col o:s @attributes... o:s \\> i:s @nodes... i:e  \\</col>"
        },
        {
            type: HTMLNodeType.HTML_TR,
            template: "\\<tr o:s @attributes... o:s \\> i:s @nodes... i:e  \\</tr>"
        },
        {
            type: HTMLNodeType.HTML_TH,
            template: "\\<th o:s @attributes... o:s \\> i:s @nodes... i:e  \\</th>"
        },
        {
            type: HTMLNodeType.HTML_TD,
            template: "\\<td o:s @attributes... o:s \\> i:s @nodes... i:e  \\</td>"
        },
        {
            type: HTMLNodeType.HTML_HEAD,
            template: "\\<head o:s @attributes... o:s \\> i:s @nodes... i:e  \\</head>"
        },
        {
            type: HTMLNodeType.HTML_TITLE,
            template: "\\<title o:s @attributes... o:s \\> i:s @nodes... i:e  \\</title>"
        },
        {
            type: HTMLNodeType.HTML_BASE,
            template: "\\<base o:s @attributes... o:s \\> i:s @nodes... i:e  \\</base>"
        },
        {
            type: HTMLNodeType.HTML_META,
            template: "\\<meta o:s @attributes... o:s \\> i:s @nodes... i:e  \\</meta>"
        },
        {
            type: HTMLNodeType.HTML_STYLE,
            template: "\\<style o:s @attributes... o:s \\> i:s @nodes... i:e  \\</style>"
        },
        {
            type: HTMLNodeType.HTML_SCRIPT,
            template: "\\<script o:s @attributes... o:s \\> i:s @nodes... i:e  \\</script>"
        },
        {
            type: HTMLNodeType.HTML_NOSCRIPT,
            template: "\\<noscript o:s @attributes... o:s \\> i:s @nodes... i:e  \\</noscript>"
        },
        {
            type: HTMLNodeType.HTML_HTML,
            template: "\\<html o:s @attributes... o:s \\> i:s @nodes... i:e  \\</html>"
        },
        {
            type: HTMLNodeType.HTML_SVG,
            template: "\\<svg o:s @attributes... o:s \\> i:s @nodes... i:e  \\</svg>"
        },
        {
            type: HTMLNodeType.HTML_BINDING_ELEMENT,
            template: "\\<svg o:s @attributes... o:s \\> i:s @nodes... i:e  \\</svg>"
        },
        {
            type: HTMLNodeType.HTMLAttribute,
            template: "@name { value : \= @value} ",
        },
        {
            type: HTMLNodeType.HTML_Element,
            template: "\\< @tagname o:s @attributes... o:s \\> i:s @nodes... i:e  \\</ @tagname \\>",
        },
        {
            type: HTMLNodeType.WickBinding,
            template: "\\{ @primary_ast \\}",
        },
        {
            type: HTMLNodeType.HTMLText,
            template: "@data",
        },
    ]
};

const lu_table = new Map(wick_mappings.mappings.map((i, j) => [i.type, j]));
wick_mappings.type_lookup = (node, name) => lu_table.get(node.type) || -1;
export const wick_renderers = experimentalConstructRenderers(<NodeMappings<Node, "type">>wick_mappings);

