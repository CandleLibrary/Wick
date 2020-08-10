import { buildRenderers } from "@candlefw/conflagrate";
import { MinTreeNodeDefinitions, MinTreeNodeType } from "@candlefw/js";
import { buildFormatRules, FormatRule as $ } from "@candlefw/conflagrate";
import { CSSTreeNodeDefinitions, CSSTreeNodeType } from "@candlefw/css";

import { WickASTNodeType } from "./types/wick_ast_node_types.js";
export const { format_rules } = buildFormatRules([{
    type: MinTreeNodeType.LexicalDeclaration,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 15
}, {
    type: MinTreeNodeType.FromClause,
    format_rule: $.OPTIONAL_SPACE
}, {
    type: MinTreeNodeType.AssignmentExpression,
    format_rule: $.OPTIONAL_SPACE
}, {
    type: MinTreeNodeType.BindingExpression,
    format_rule: $.OPTIONAL_SPACE
}, {
    type: MinTreeNodeType.IfStatement,
    format_rule: $.OPTIONAL_SPACE
}, {
    type: MinTreeNodeType.Class,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT
}, {
    type: MinTreeNodeType.Script,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT
}, {
    type: MinTreeNodeType.BlockStatement,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: MinTreeNodeType.FunctionBody,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: MinTreeNodeType.ObjectLiteral,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: MinTreeNodeType.Arguments,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: MinTreeNodeType.FormalParameters,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: MinTreeNodeType.ExpressionList,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 14
}, {
    type: WickASTNodeType.HTML_DIV,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 14
}, {
    type: WickASTNodeType.HTML_P,
    format_rule: $.INDENT * 2 | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 14
}]);

const definitions = [ /**/ /**/ ...MinTreeNodeDefinitions /**/,/**/...CSSTreeNodeDefinitions, ...[
    {
        type: WickASTNodeType.HTML_DIV,
        template_pattern: "<div @_attributes...%>^1@...%^0</div>",
        format_rule: 0
    },
    {
        type: WickASTNodeType.HTML_TT,
        template_pattern: "<tt @_attributes...%>^1@...%^0</tt>"
    },
    {
        type: WickASTNodeType.HTML_I,
        template_pattern: "<i @_attributes...%>^1@...%^0</i>"
    },
    {
        type: WickASTNodeType.HTML_B,
        template_pattern: "<b @_attributes...%>^1@...%^0</b>"
    },
    {
        type: WickASTNodeType.HTML_BIG,
        template_pattern: "<big @_attributes...%>^1@...%^0</big>"
    },
    {
        type: WickASTNodeType.HTML_SMALL,
        template_pattern: "<small @_attributes...%>^1@...%^0</small>"
    },
    {
        type: WickASTNodeType.HTML_EM,
        template_pattern: "<em @_attributes...%>^1@...%^0</em>"
    },
    {
        type: WickASTNodeType.HTML_STRONG,
        template_pattern: "<strong @_attributes...%>^1@...%^0</strong>"
    },
    {
        type: WickASTNodeType.HTML_DFN,
        template_pattern: "<dfn @_attributes...%>^1@...%^0</dfn>"
    },
    {
        type: WickASTNodeType.HTML_CODE,
        template_pattern: "<code @_attributes...%>^1@...%^0</code>"
    },
    {
        type: WickASTNodeType.HTML_SAMP,
        template_pattern: "<samp @_attributes...%>^1@...%^0</samp>"
    },
    {
        type: WickASTNodeType.HTML_KBD,
        template_pattern: "<kbd @_attributes...%>^1@...%^0</kbd>"
    },
    {
        type: WickASTNodeType.HTML_VAR,
        template_pattern: "<var @_attributes...%>^1@...%^0</var>"
    },
    {
        type: WickASTNodeType.HTML_CITE,
        template_pattern: "<cite @_attributes...%>^1@...%^0</cite>"
    },
    {
        type: WickASTNodeType.HTML_ABBR,
        template_pattern: "<abbr @_attributes...%>^1@...%^0</abbr>"
    },
    {
        type: WickASTNodeType.HTML_ACRONYM,
        template_pattern: "<acronym @_attributes...%>^1@...%^0</acronym>"
    },
    {
        type: WickASTNodeType.HTML_SUP,
        template_pattern: "<sup @_attributes...%>^1@...%^0</sup>"
    },
    {
        type: WickASTNodeType.HTML_SPAN,
        template_pattern: "<span @_attributes...%>^1@...%^0</span>"
    },
    {
        type: WickASTNodeType.HTML_BDO,
        template_pattern: "<bdo @_attributes...%>^1@...%^0</bdo>"
    },
    {
        type: WickASTNodeType.HTML_BR,
        template_pattern: "<br @_attributes...%>^1@...%^0</br>"
    },
    {
        type: WickASTNodeType.HTML_BODY,
        template_pattern: "<body @_attributes...%>^1@...%^0</body>"
    },
    {
        type: WickASTNodeType.HTML_ADDRESS,
        template_pattern: "<address @_attributes...%>^1@...%^0</address>"
    },
    {
        type: WickASTNodeType.HTML_A,
        template_pattern: "<a @_attributes...%>^1@...%^0</a>"
    },
    {
        type: WickASTNodeType.HTML_MAP,
        template_pattern: "<map @_attributes...%>^1@...%^0</map>"
    },
    {
        type: WickASTNodeType.HTML_AREA,
        template_pattern: "<area @_attributes...%>^1@...%^0</area>"
    },
    {
        type: WickASTNodeType.HTML_LINK,
        template_pattern: "<link @_attributes...%>^1@...%^0</link>"
    },
    {
        type: WickASTNodeType.HTML_IMG,
        template_pattern: "<img @_attributes...%>^1@...%^0</img>"
    },
    {
        type: WickASTNodeType.HTML_OBJECT,
        template_pattern: "<object @_attributes...%>^1@...%^0</object>"
    },
    {
        type: WickASTNodeType.HTML_PARAM,
        template_pattern: "<param @_attributes...%>^1@...%^0</param>"
    },
    {
        type: WickASTNodeType.HTML_HR,
        template_pattern: "<hr @_attributes...%>^1@...%^0</hr>"
    },
    {
        type: WickASTNodeType.HTML_P,
        template_pattern: "<p @_attributes...%>^1@...%^0</p>"
    },
    {
        type: WickASTNodeType.HTML_H1,
        template_pattern: "<h1 @_attributes...%>^1@...%^0</h1>"
    },
    {
        type: WickASTNodeType.HTML_H2,
        template_pattern: "<h2 @_attributes...%>^1@...%^0</h2>"
    },
    {
        type: WickASTNodeType.HTML_H3,
        template_pattern: "<h3 @_attributes...%>^1@...%^0</h3>"
    },
    {
        type: WickASTNodeType.HTML_H4,
        template_pattern: "<h4 @_attributes...%>^1@...%^0</h4>"
    },
    {
        type: WickASTNodeType.HTML_H5,
        template_pattern: "<h5 @_attributes...%>^1@...%^0</h5>"
    },
    {
        type: WickASTNodeType.HTML_H6,
        template_pattern: "<h6 @_attributes...%>^1@...%^0</h6>"
    },
    {
        type: WickASTNodeType.HTML_PRE,
        template_pattern: "<pre @_attributes...%>^1@...%^0</pre>"
    },
    {
        type: WickASTNodeType.HTML_Q,
        template_pattern: "<q @_attributes...%>^1@...%^0</q>"
    },
    {
        type: WickASTNodeType.HTML_BLOCKQUOTE,
        template_pattern: "<blockquote @_attributes...%>^1@...%^0</blockquote>"
    },
    {
        type: WickASTNodeType.HTML_INS,
        template_pattern: "<ins @_attributes...%>^1@...%^0</ins>"
    },
    {
        type: WickASTNodeType.HTML_DEL,
        template_pattern: "<del @_attributes...%>^1@...%^0</del>"
    },
    {
        type: WickASTNodeType.HTML_DL,
        template_pattern: "<dl @_attributes...%>^1@...%^0</dl>"
    },
    {
        type: WickASTNodeType.HTML_DT,
        template_pattern: "<dt @_attributes...%>^1@...%^0</dt>"
    },
    {
        type: WickASTNodeType.HTML_DD,
        template_pattern: "<dd @_attributes...%>^1@...%^0</dd>"
    },
    {
        type: WickASTNodeType.HTML_OL,
        template_pattern: "<ol @_attributes...%>^1@...%^0</ol>"
    },
    {
        type: WickASTNodeType.HTML_UL,
        template_pattern: "<ul @_attributes...%>^1@...%^0</ul>"
    },
    {
        type: WickASTNodeType.HTML_LI,
        template_pattern: "<li @_attributes...%>^1@...%^0</li>"
    },
    {
        type: WickASTNodeType.HTML_FORM,
        template_pattern: "<form @_attributes...%>^1@...%^0</form>"
    },
    {
        type: WickASTNodeType.HTML_LABEL,
        template_pattern: "<label @_attributes...%>^1@...%^0</label>"
    },
    {
        type: WickASTNodeType.HTML_INPUT,
        template_pattern: "<input @_attributes...%>^1@...%^0</input>"
    },
    {
        type: WickASTNodeType.HTML_SELECT,
        template_pattern: "<select @_attributes...%>^1@...%^0</select>"
    },
    {
        type: WickASTNodeType.HTML_OPTGROUP,
        template_pattern: "<optgroup @_attributes...%>^1@...%^0</optgroup>"
    },
    {
        type: WickASTNodeType.HTML_OPTION,
        template_pattern: "<option @_attributes...%>^1@...%^0</option>"
    },
    {
        type: WickASTNodeType.HTML_TEXTAREA,
        template_pattern: "<textarea @_attributes...%>^1@...%^0</textarea>"
    },
    {
        type: WickASTNodeType.HTML_FIELDSET,
        template_pattern: "<fieldset @_attributes...%>^1@...%^0</fieldset>"
    },
    {
        type: WickASTNodeType.HTML_LEGEND,
        template_pattern: "<legend @_attributes...%>^1@...%^0</legend>"
    },
    {
        type: WickASTNodeType.HTML_BUTTON,
        template_pattern: "<button @_attributes...%>^1@...%^0</button>"
    },
    {
        type: WickASTNodeType.HTML_TABLE,
        template_pattern: "<table @_attributes...%>^1@...%^0</table>"
    },
    {
        type: WickASTNodeType.HTML_CAPTION,
        template_pattern: "<caption @_attributes...%>^1@...%^0</caption>"
    },
    {
        type: WickASTNodeType.HTML_THEAD,
        template_pattern: "<thead @_attributes...%>^1@...%^0</thead>"
    },
    {
        type: WickASTNodeType.HTML_TFOOT,
        template_pattern: "<tfoot @_attributes...%>^1@...%^0</tfoot>"
    },
    {
        type: WickASTNodeType.HTML_TBODY,
        template_pattern: "<tbody @_attributes...%>^1@...%^0</tbody>"
    },
    {
        type: WickASTNodeType.HTML_COLGROUP,
        template_pattern: "<colgroup @_attributes...%>^1@...%^0</colgroup>"
    },
    {
        type: WickASTNodeType.HTML_COL,
        template_pattern: "<col @_attributes...%>^1@...%^0</col>"
    },
    {
        type: WickASTNodeType.HTML_TR,
        template_pattern: "<tr @_attributes...%>^1@...%^0</tr>"
    },
    {
        type: WickASTNodeType.HTML_TH,
        template_pattern: "<th @_attributes...%>^1@...%^0</th>"
    },
    {
        type: WickASTNodeType.HTML_TD,
        template_pattern: "<td @_attributes...%>^1@...%^0</td>"
    },
    {
        type: WickASTNodeType.HTML_HEAD,
        template_pattern: "<head @_attributes...%>^1@...%^0</head>"
    },
    {
        type: WickASTNodeType.HTML_TITLE,
        template_pattern: "<title @_attributes...%>^1@...%^0</title>"
    },
    {
        type: WickASTNodeType.HTML_BASE,
        template_pattern: "<base @_attributes...%>^1@...%^0</base>"
    },
    {
        type: WickASTNodeType.HTML_META,
        template_pattern: "<meta @_attributes...%>^1@...%^0</meta>"
    },
    {
        type: WickASTNodeType.HTML_STYLE,
        template_pattern: "<style @_attributes...%>^1@...%^0</style>"
    },
    {
        type: WickASTNodeType.HTML_SCRIPT,
        template_pattern: "<script @_attributes...%>^1@...%^0</script>"
    },
    {
        type: WickASTNodeType.HTML_NOSCRIPT,
        template_pattern: "<noscript @_attributes...%>^1@...%^0</noscript>"
    },
    {
        type: WickASTNodeType.HTML_HTML,
        template_pattern: "<html @_attributes...%>^1@...%^0</html>"
    },
    {
        type: WickASTNodeType.HTML_SVG,
        template_pattern: "<svg @_attributes...%>^1@...%^0</svg>"
    },
    {
        type: WickASTNodeType.HTML_BINDING_ELEMENT,
        template_pattern: "<svg @_attributes...%>^1@...%^0</svg>"
    },
    {
        type: WickASTNodeType.HTMLAttribute,
        template_pattern: { default: "@name=\"@value\"", not_value: "@name" },
    },
    {
        type: WickASTNodeType.HTML_Element,
        template_pattern: "<@tagname @_attributes...%>^1@...%^0</@tagname>",
    },
    {
        type: WickASTNodeType.WickBinding,
        template_pattern: "(( @_primary_ast ))",
    },
    {
        type: WickASTNodeType.HTMLText,
        template_pattern: "@data",
    },
]];
const renderers = buildRenderers(definitions, Object.assign({}, CSSTreeNodeType, WickASTNodeType, MinTreeNodeType));

export { renderers };
