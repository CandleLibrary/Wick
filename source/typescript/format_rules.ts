import { WickASTNodeType } from "./types/wick_ast_node_types.js";
import { buildRenderers } from "@candlefw/conflagrate";
import { MinTreeNodeDefinitions, MinTreeNodeType } from "@candlefw/js";
import { buildFormatRules, FormatRule as $ } from "@candlefw/conflagrate";
export const { format_rules } = buildFormatRules([{
    type: MinTreeNodeType.LexicalDeclaration,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT * 2 | $.MIN_LIST_ELE_LIMIT * 15
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
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: MinTreeNodeType.FormalParameters,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT | $.MIN_LIST_ELE_LIMIT * 5
}, {
    type: MinTreeNodeType.ExpressionList,
    format_rule: $.INDENT | $.OPTIONAL_SPACE | $.LIST_SPLIT | $.MIN_LIST_ELE_LIMIT * 14
}]);
const definitions = [/**/ ...MinTreeNodeDefinitions /**/, ...[
    {
        type: WickASTNodeType.HTML_DIV,
        template_pattern: "<div>@... </div>",
        format_rule: 0
    },
    {
        type: WickASTNodeType.HTML_A,
        template_pattern: "<a @attributes[] />",
        format_rule: 0
    },
    {
        type: WickASTNodeType.CompiledBinding,
        template_pattern: "<test>",
        format_rule: 0
    },
    {
        type: WickASTNodeType.HTMLText,
        template_pattern: "<test>",
        format_rule: 0
    },
]];
export const renderers = buildRenderers(definitions, Object.assign(WickASTNodeType, MinTreeNodeType));
