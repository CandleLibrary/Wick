import { MinTreeNode, MinTreeNodeClass } from "@candlefw/js";
import { Lexer } from "@candlefw/wind";




export const enum WickASTNodeClass {
    HTML_NODE = (1 << 20),

    HTML_ELEMENT = (1 << 21)
}

export const WICK_AST_NODE_TYPE_BASE = 147;
export const WICK_AST_NODE_TYPE_SIZE = 85;


/**
 * Wick node values and types. Extends JavaScript nodes described in @candlefw/js, and CSS nodes described in @candlefw/css
 */
export enum WickASTNodeType {
    WickBinding = (147 << 24),
    HTML_IMPORT = (148 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTMLAttribute = (149 << 24) | WickASTNodeClass.HTML_NODE,
    HTMLText = (150 << 24) | WickASTNodeClass.HTML_NODE,
    ERROR = (151 << 24),
    HTML_Element = (152 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TEXT = (153 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TT = (154 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_I = (155 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_B = (156 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BIG = (157 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SMALL = (158 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_EM = (159 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_STRONG = (160 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DFN = (161 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_CODE = (162 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SAMP = (163 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_KBD = (164 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_VAR = (165 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_CITE = (166 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_ABBR = (167 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_ACRONYM = (168 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SUP = (169 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SPAN = (170 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BDO = (171 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BR = (172 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BODY = (173 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_ADDRESS = (174 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DIV = (175 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_A = (176 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_MAP = (177 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_AREA = (178 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_LINK = (179 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_IMG = (180 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_OBJECT = (181 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_PARAM = (182 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_HR = (183 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_P = (184 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H1 = (185 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H2 = (186 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H3 = (187 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H4 = (188 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H5 = (189 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H6 = (190 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_PRE = (191 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_Q = (192 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BLOCKQUOTE = (193 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_INS = (194 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DEL = (195 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DL = (196 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DT = (197 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DD = (198 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_OL = (199 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_UL = (200 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_LI = (201 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_FORM = (202 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_LABEL = (203 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_INPUT = (204 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SELECT = (205 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_OPTGROUP = (206 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_OPTION = (207 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TEXTAREA = (208 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_FIELDSET = (209 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_LEGEND = (210 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BUTTON = (211 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TABLE = (212 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_CAPTION = (213 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_THEAD = (214 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TFOOT = (215 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TBODY = (216 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_COLGROUP = (217 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_COL = (218 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TR = (219 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TH = (220 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TD = (221 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_HEAD = (222 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TITLE = (223 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BASE = (224 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_META = (225 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_STYLE = (226 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SCRIPT = (227 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_NOSCRIPT = (228 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_HTML = (229 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SVG = (230 << 24) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    CompiledBinding = (231 << 24),
    ComponentVariableDeclaration = (232 << 24) | MinTreeNodeClass.STATEMENT
}


export interface WickASTNode {
    /**
     * child nodes 
     */
    nodes?: WickASTNode[];
    /**
     * The name of the node type
     */
    type: WickASTNodeType;
    /**
     * 
     */
    IS_BINDING?: boolean;

    name_space?: number;

    pos: Lexer;

    tag?: string;

    /**
     * Name of the key of an attribute node.
     */
    name?: string;

    attributes?: WickASTNode[];

    value?: string;
}


export interface WickBindingNode extends WickASTNode {
    primary_ast?: MinTreeNode;
    secondary_ast?: MinTreeNode;
}


export interface WickTextNode {
    /**
     * The name of the node type
     */
    type: WickASTNodeType;

    /**
     * A text string or Binding 
     */
    data: string | WickBindingNode;
    /**
     *  true if data is a Binding
     */
    IS_BINDING; boolean;

    pos: Lexer;
}


export default interface CompiledWickAST {

}