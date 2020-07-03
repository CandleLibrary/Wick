import { MinTreeNode, MinTreeNodeClass } from "@candlefw/js";
import { Lexer } from "@candlefw/wind";
import { Component } from "../wick";




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
    WickBinding = (147 << 23),
    HTML_IMPORT = (148 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTMLAttribute = (149 << 23) | WickASTNodeClass.HTML_NODE,
    HTMLText = (150 << 23) | WickASTNodeClass.HTML_NODE,
    ERROR = (151 << 23),
    HTML_Element = (152 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TEXT = (153 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TT = (154 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_I = (155 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_B = (156 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BIG = (157 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SMALL = (158 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_EM = (159 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_STRONG = (160 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DFN = (161 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_CODE = (162 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SAMP = (163 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_KBD = (164 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_VAR = (165 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_CITE = (166 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_ABBR = (167 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_ACRONYM = (168 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SUP = (169 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SPAN = (170 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BDO = (171 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BR = (172 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BODY = (173 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_ADDRESS = (174 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DIV = (175 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_A = (176 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_MAP = (177 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_AREA = (178 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_LINK = (179 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_IMG = (180 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_OBJECT = (181 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_PARAM = (182 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_HR = (183 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_P = (184 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H1 = (185 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H2 = (186 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H3 = (187 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H4 = (188 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H5 = (189 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_H6 = (190 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_PRE = (191 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_Q = (192 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BLOCKQUOTE = (193 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_INS = (194 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DEL = (195 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DL = (196 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DT = (197 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_DD = (198 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_OL = (199 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_UL = (200 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_LI = (201 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_FORM = (202 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_LABEL = (203 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_INPUT = (204 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SELECT = (205 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_OPTGROUP = (206 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_OPTION = (207 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TEXTAREA = (208 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_FIELDSET = (209 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_LEGEND = (210 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BUTTON = (211 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TABLE = (212 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_CAPTION = (213 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_THEAD = (214 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TFOOT = (215 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TBODY = (216 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_COLGROUP = (217 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_COL = (218 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TR = (219 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TH = (220 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TD = (221 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_HEAD = (222 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_TITLE = (223 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BASE = (223 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_META = (225 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_STYLE = (226 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SCRIPT = (227 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_NOSCRIPT = (228 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_HTML = (229 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_SVG = (230 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    HTML_BINDING_ELEMENT = (230 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT,
    CompiledBinding = (231 << 23),
    ComponentVariableDeclaration = (232 << 23) | MinTreeNodeClass.STATEMENT
}


export interface WickASTNode {
    import_list?: any[];
    is_container?: boolean;
    /**
     * If node is a <container> node, gives the numerical
     * index order of the container.
     */
    container_id?: number;
    slot_name?: string;
    id?: number;
    child_id?: number;
    component?: Component;
    component_name?: string;
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
    /**
     * Local Identifier name, ie: name within component.
     */
    local?: string;

    /**
     * External Identifer name, ie: name exported to parent. 
     */
    extern?: string;
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