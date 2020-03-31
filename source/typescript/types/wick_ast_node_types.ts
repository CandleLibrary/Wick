import { MinTreeNode } from "@candlefw/js";
import { Lexer } from "@candlefw/whind";

export enum WickASTNodeType {
    WickBinding = (147 << 24),
    HTML_IMPORT = (148 << 24),
    HTMLAttribute = (149 << 24),
    HTMLText = (150 << 24),
    HTML_ERROR = (151 << 24),
    HTML_Element = (152 << 24),
    HTML_TEXT = (153 << 24),
    HTML_TT = (154 << 24),
    HTML_I = (155 << 24),
    HTML_B = (156 << 24),
    HTML_BIG = (157 << 24),
    HTML_SMALL = (158 << 24),
    HTML_EM = (159 << 24),
    HTML_STRONG = (160 << 24),
    HTML_DFN = (161 << 24),
    HTML_CODE = (162 << 24),
    HTML_SAMP = (163 << 24),
    HTML_KBD = (164 << 24),
    HTML_VAR = (165 << 24),
    HTML_CITE = (166 << 24),
    HTML_ABBR = (167 << 24),
    HTML_ACRONYM = (168 << 24),
    HTML_SUP = (169 << 24),
    HTML_SPAN = (170 << 24),
    HTML_BDO = (171 << 24),
    HTML_BR = (172 << 24),
    HTML_BODY = (173 << 24),
    HTML_ADDRESS = (174 << 24),
    HTML_DIV = (175 << 24),
    HTML_A = (176 << 24),
    HTML_MAP = (177 << 24),
    HTML_AREA = (178 << 24),
    HTML_LINK = (179 << 24),
    HTML_IMG = (180 << 24),
    HTML_OBJECT = (181 << 24),
    HTML_PARAM = (182 << 24),
    HTML_HR = (183 << 24),
    HTML_P = (184 << 24),
    HTML_H1 = (185 << 24),
    HTML_H2 = (186 << 24),
    HTML_H3 = (187 << 24),
    HTML_H4 = (188 << 24),
    HTML_H5 = (189 << 24),
    HTML_H6 = (190 << 24),
    HTML_PRE = (191 << 24),
    HTML_Q = (192 << 24),
    HTML_BLOCKQUOTE = (193 << 24),
    HTML_INS = (194 << 24),
    HTML_DEL = (195 << 24),
    HTML_DL = (196 << 24),
    HTML_DT = (197 << 24),
    HTML_DD = (198 << 24),
    HTML_OL = (199 << 24),
    HTML_UL = (200 << 24),
    HTML_LI = (201 << 24),
    HTML_FORM = (202 << 24),
    HTML_LABEL = (203 << 24),
    HTML_INPUT = (204 << 24),
    HTML_SELECT = (205 << 24),
    HTML_OPTGROUP = (206 << 24),
    HTML_OPTION = (207 << 24),
    HTML_TEXTAREA = (208 << 24),
    HTML_FIELDSET = (209 << 24),
    HTML_LEGEND = (210 << 24),
    HTML_BUTTON = (211 << 24),
    HTML_TABLE = (212 << 24),
    HTML_CAPTION = (213 << 24),
    HTML_THEAD = (214 << 24),
    HTML_TFOOT = (215 << 24),
    HTML_TBODY = (216 << 24),
    HTML_COLGROUP = (217 << 24),
    HTML_COL = (218 << 24),
    HTML_TR = (219 << 24),
    HTML_TH = (220 << 24),
    HTML_TD = (221 << 24),
    HTML_HEAD = (222 << 24),
    HTML_TITLE = (223 << 24),
    HTML_BASE = (224 << 24),
    HTML_META = (225 << 24),
    HTML_STYLE = (226 << 24),
    HTML_SCRIPT = (227 << 24),
    HTML_NOSCRIPT = (228 << 24),
    HTML_HTML = (229 << 24),
    HTML_SVG = (230 << 24)
}


export interface WickASTNode {
    /**
     * child nodes 
     */
    children: WickASTNode[];
    /**
     * The name of the node type
     */
    type: WickASTNodeType;
    /**
     * 
     */
    IS_BINDING; boolean;
}
export interface WickTextNode {
    /**
     * A text string or Binding 
     */
    data: string | WickBinding;
    /**
     *  true if data is a Binding
     */
    IS_BINDING; boolean;
}

export interface WickBinding {
    primary_ast?: MinTreeNode;
    secondary_ast?: MinTreeNode;
    lex: Lexer;
}


export default interface CompiledWickAST {

}