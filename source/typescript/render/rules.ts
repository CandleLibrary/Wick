import { buildRenderers } from "@candlefw/conflagrate";
import { JSNodeDefinitions, JSNodeType } from "@candlefw/js";
import { buildFormatRules, FormatRule as $ } from "@candlefw/conflagrate";
import { CSSNodeDefinitions } from "@candlefw/css";


import { WickNodeType } from "../types/wick_ast_node_types.js";
import { NodeTypes } from "../parser/env.js";

export const format_rules = buildFormatRules([{
    type: JSNodeType.LexicalDeclaration,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 15
}, {
    type: JSNodeType.FromClause,
    format_rule: $.OPTIONAL_SPACE
}, {
    type: JSNodeType.AssignmentExpression,
    format_rule: $.OPTIONAL_SPACE
}, {
    type: JSNodeType.BindingExpression,
    format_rule: $.OPTIONAL_SPACE
}, {
    type: JSNodeType.IfStatement,
    format_rule: $.OPTIONAL_SPACE
}, {
    type: JSNodeType.Class,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT
}, {
    type: JSNodeType.Script,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT
}, {
    type: JSNodeType.BlockStatement,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: JSNodeType.FunctionBody,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: JSNodeType.ObjectLiteral,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: JSNodeType.Arguments,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: JSNodeType.FormalParameters,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: JSNodeType.ExpressionList,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 14
}, {
    type: WickNodeType.HTML_DIV,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 14
}, {
    type: WickNodeType.HTML_P,
    format_rule: $.INDENT * 2 | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 14
}]);

const definitions = [ /**/ /**/ ...JSNodeDefinitions /**/,/**/...CSSNodeDefinitions, ...[
    {
        type: WickNodeType.HTML_DIV,
        template_pattern: "<div @_attributes...%>^1@...%^0</div>",
        format_rule: 0
    },
    {
        type: WickNodeType.HTML_TT,
        template_pattern: "<tt @_attributes...%>^1@...%^0</tt>"
    },
    {
        type: WickNodeType.HTML_I,
        template_pattern: "<i @_attributes...%>^1@...%^0</i>"
    },
    {
        type: WickNodeType.HTML_B,
        template_pattern: "<b @_attributes...%>^1@...%^0</b>"
    },
    {
        type: WickNodeType.HTML_BIG,
        template_pattern: "<big @_attributes...%>^1@...%^0</big>"
    },
    {
        type: WickNodeType.HTML_SMALL,
        template_pattern: "<small @_attributes...%>^1@...%^0</small>"
    },
    {
        type: WickNodeType.HTML_EM,
        template_pattern: "<em @_attributes...%>^1@...%^0</em>"
    },
    {
        type: WickNodeType.HTML_STRONG,
        template_pattern: "<strong @_attributes...%>^1@...%^0</strong>"
    },
    {
        type: WickNodeType.HTML_DFN,
        template_pattern: "<dfn @_attributes...%>^1@...%^0</dfn>"
    },
    {
        type: WickNodeType.HTML_CODE,
        template_pattern: "<code @_attributes...%>^1@...%^0</code>"
    },
    {
        type: WickNodeType.HTML_SAMP,
        template_pattern: "<samp @_attributes...%>^1@...%^0</samp>"
    },
    {
        type: WickNodeType.HTML_KBD,
        template_pattern: "<kbd @_attributes...%>^1@...%^0</kbd>"
    },
    {
        type: WickNodeType.HTML_VAR,
        template_pattern: "<var @_attributes...%>^1@...%^0</var>"
    },
    {
        type: WickNodeType.HTML_CITE,
        template_pattern: "<cite @_attributes...%>^1@...%^0</cite>"
    },
    {
        type: WickNodeType.HTML_ABBR,
        template_pattern: "<abbr @_attributes...%>^1@...%^0</abbr>"
    },
    {
        type: WickNodeType.HTML_ACRONYM,
        template_pattern: "<acronym @_attributes...%>^1@...%^0</acronym>"
    },
    {
        type: WickNodeType.HTML_SUP,
        template_pattern: "<sup @_attributes...%>^1@...%^0</sup>"
    },
    {
        type: WickNodeType.HTML_SPAN,
        template_pattern: "<span @_attributes...%>^1@...%^0</span>"
    },
    {
        type: WickNodeType.HTML_BDO,
        template_pattern: "<bdo @_attributes...%>^1@...%^0</bdo>"
    },
    {
        type: WickNodeType.HTML_BR,
        template_pattern: "<br @_attributes...%>^1@...%^0</br>"
    },
    {
        type: WickNodeType.HTML_BODY,
        template_pattern: "<body @_attributes...%>^1@...%^0</body>"
    },
    {
        type: WickNodeType.HTML_ADDRESS,
        template_pattern: "<address @_attributes...%>^1@...%^0</address>"
    },
    {
        type: WickNodeType.HTML_A,
        template_pattern: "<a @_attributes...%>^1@...%^0</a>"
    },
    {
        type: WickNodeType.HTML_MAP,
        template_pattern: "<map @_attributes...%>^1@...%^0</map>"
    },
    {
        type: WickNodeType.HTML_AREA,
        template_pattern: "<area @_attributes...%>^1@...%^0</area>"
    },
    {
        type: WickNodeType.HTML_LINK,
        template_pattern: "<link @_attributes...%>^1@...%^0</link>"
    },
    {
        type: WickNodeType.HTML_IMG,
        template_pattern: "<img @_attributes...%>^1@...%^0</img>"
    },
    {
        type: WickNodeType.HTML_OBJECT,
        template_pattern: "<object @_attributes...%>^1@...%^0</object>"
    },
    {
        type: WickNodeType.HTML_PARAM,
        template_pattern: "<param @_attributes...%>^1@...%^0</param>"
    },
    {
        type: WickNodeType.HTML_HR,
        template_pattern: "<hr @_attributes...%>^1@...%^0</hr>"
    },
    {
        type: WickNodeType.HTML_P,
        template_pattern: "<p @_attributes...%>^1@...%^0</p>"
    },
    {
        type: WickNodeType.HTML_H1,
        template_pattern: "<h1 @_attributes...%>^1@...%^0</h1>"
    },
    {
        type: WickNodeType.HTML_H2,
        template_pattern: "<h2 @_attributes...%>^1@...%^0</h2>"
    },
    {
        type: WickNodeType.HTML_H3,
        template_pattern: "<h3 @_attributes...%>^1@...%^0</h3>"
    },
    {
        type: WickNodeType.HTML_H4,
        template_pattern: "<h4 @_attributes...%>^1@...%^0</h4>"
    },
    {
        type: WickNodeType.HTML_H5,
        template_pattern: "<h5 @_attributes...%>^1@...%^0</h5>"
    },
    {
        type: WickNodeType.HTML_H6,
        template_pattern: "<h6 @_attributes...%>^1@...%^0</h6>"
    },
    {
        type: WickNodeType.HTML_PRE,
        template_pattern: "<pre @_attributes...%>^1@...%^0</pre>"
    },
    {
        type: WickNodeType.HTML_Q,
        template_pattern: "<q @_attributes...%>^1@...%^0</q>"
    },
    {
        type: WickNodeType.HTML_BLOCKQUOTE,
        template_pattern: "<blockquote @_attributes...%>^1@...%^0</blockquote>"
    },
    {
        type: WickNodeType.HTML_INS,
        template_pattern: "<ins @_attributes...%>^1@...%^0</ins>"
    },
    {
        type: WickNodeType.HTML_DEL,
        template_pattern: "<del @_attributes...%>^1@...%^0</del>"
    },
    {
        type: WickNodeType.HTML_DL,
        template_pattern: "<dl @_attributes...%>^1@...%^0</dl>"
    },
    {
        type: WickNodeType.HTML_DT,
        template_pattern: "<dt @_attributes...%>^1@...%^0</dt>"
    },
    {
        type: WickNodeType.HTML_DD,
        template_pattern: "<dd @_attributes...%>^1@...%^0</dd>"
    },
    {
        type: WickNodeType.HTML_OL,
        template_pattern: "<ol @_attributes...%>^1@...%^0</ol>"
    },
    {
        type: WickNodeType.HTML_UL,
        template_pattern: "<ul @_attributes...%>^1@...%^0</ul>"
    },
    {
        type: WickNodeType.HTML_LI,
        template_pattern: "<li @_attributes...%>^1@...%^0</li>"
    },
    {
        type: WickNodeType.HTML_FORM,
        template_pattern: "<form @_attributes...%>^1@...%^0</form>"
    },
    {
        type: WickNodeType.HTML_LABEL,
        template_pattern: "<label @_attributes...%>^1@...%^0</label>"
    },
    {
        type: WickNodeType.HTML_INPUT,
        template_pattern: "<input @_attributes...%>^1@...%^0</input>"
    },
    {
        type: WickNodeType.HTML_SELECT,
        template_pattern: "<select @_attributes...%>^1@...%^0</select>"
    },
    {
        type: WickNodeType.HTML_OPTGROUP,
        template_pattern: "<optgroup @_attributes...%>^1@...%^0</optgroup>"
    },
    {
        type: WickNodeType.HTML_OPTION,
        template_pattern: "<option @_attributes...%>^1@...%^0</option>"
    },
    {
        type: WickNodeType.HTML_TEXTAREA,
        template_pattern: "<textarea @_attributes...%>^1@...%^0</textarea>"
    },
    {
        type: WickNodeType.HTML_FIELDSET,
        template_pattern: "<fieldset @_attributes...%>^1@...%^0</fieldset>"
    },
    {
        type: WickNodeType.HTML_LEGEND,
        template_pattern: "<legend @_attributes...%>^1@...%^0</legend>"
    },
    {
        type: WickNodeType.HTML_BUTTON,
        template_pattern: "<button @_attributes...%>^1@...%^0</button>"
    },
    {
        type: WickNodeType.HTML_TABLE,
        template_pattern: "<table @_attributes...%>^1@...%^0</table>"
    },
    {
        type: WickNodeType.HTML_CAPTION,
        template_pattern: "<caption @_attributes...%>^1@...%^0</caption>"
    },
    {
        type: WickNodeType.HTML_THEAD,
        template_pattern: "<thead @_attributes...%>^1@...%^0</thead>"
    },
    {
        type: WickNodeType.HTML_TFOOT,
        template_pattern: "<tfoot @_attributes...%>^1@...%^0</tfoot>"
    },
    {
        type: WickNodeType.HTML_TBODY,
        template_pattern: "<tbody @_attributes...%>^1@...%^0</tbody>"
    },
    {
        type: WickNodeType.HTML_COLGROUP,
        template_pattern: "<colgroup @_attributes...%>^1@...%^0</colgroup>"
    },
    {
        type: WickNodeType.HTML_COL,
        template_pattern: "<col @_attributes...%>^1@...%^0</col>"
    },
    {
        type: WickNodeType.HTML_TR,
        template_pattern: "<tr @_attributes...%>^1@...%^0</tr>"
    },
    {
        type: WickNodeType.HTML_TH,
        template_pattern: "<th @_attributes...%>^1@...%^0</th>"
    },
    {
        type: WickNodeType.HTML_TD,
        template_pattern: "<td @_attributes...%>^1@...%^0</td>"
    },
    {
        type: WickNodeType.HTML_HEAD,
        template_pattern: "<head @_attributes...%>^1@...%^0</head>"
    },
    {
        type: WickNodeType.HTML_TITLE,
        template_pattern: "<title @_attributes...%>^1@...%^0</title>"
    },
    {
        type: WickNodeType.HTML_BASE,
        template_pattern: "<base @_attributes...%>^1@...%^0</base>"
    },
    {
        type: WickNodeType.HTML_META,
        template_pattern: "<meta @_attributes...%>^1@...%^0</meta>"
    },
    {
        type: WickNodeType.HTML_STYLE,
        template_pattern: "<style @_attributes...%>^1@...%^0</style>"
    },
    {
        type: WickNodeType.HTML_SCRIPT,
        template_pattern: "<script @_attributes...%>^1@...%^0</script>"
    },
    {
        type: WickNodeType.HTML_NOSCRIPT,
        template_pattern: "<noscript @_attributes...%>^1@...%^0</noscript>"
    },
    {
        type: WickNodeType.HTML_HTML,
        template_pattern: "<html @_attributes...%>^1@...%^0</html>"
    },
    {
        type: WickNodeType.HTML_SVG,
        template_pattern: "<svg @_attributes...%>^1@...%^0</svg>"
    },
    {
        type: WickNodeType.HTML_BINDING_ELEMENT,
        template_pattern: "<svg @_attributes...%>^1@...%^0</svg>"
    },
    {
        type: WickNodeType.HTMLAttribute,
        template_pattern: { default: "@name=\"@value\"", not_value: "@name" },
    },
    {
        type: WickNodeType.HTML_Element,
        template_pattern: "<@tagname @_attributes...%>^1@...%^0</@tagname>",
    },
    {
        type: WickNodeType.WickBinding,
        template_pattern: "(( @_primary_ast ))",
    },
    {
        type: WickNodeType.HTMLText,
        template_pattern: "@data",
    },
]];

export const renderers = buildRenderers(definitions, NodeTypes);

