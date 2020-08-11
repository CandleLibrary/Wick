import { JSNode, JSNodeClass } from "@candlefw/js";
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

export const enum WickASTNodeType {
    WickBinding = (147 << 23),
    HTML_IMPORT = ((148 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTMLAttribute = ((149 << 23) | WickASTNodeClass.HTML_NODE),
    HTMLText = ((150 << 23) | WickASTNodeClass.HTML_NODE),
    ERROR = ((151 << 23)),
    HTML_Element = ((152 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TEXT = ((153 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TT = ((154 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_I = ((155 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_B = ((156 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_BIG = ((157 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_SMALL = ((158 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_EM = ((159 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_STRONG = ((160 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_DFN = ((161 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_CODE = ((162 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_SAMP = ((163 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_KBD = ((164 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_VAR = ((165 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_CITE = ((166 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_ABBR = ((167 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_ACRONYM = ((168 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_SUP = ((169 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_SPAN = ((170 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_BDO = ((171 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_BR = ((172 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_BODY = ((173 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_ADDRESS = ((174 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_DIV = ((175 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_A = ((176 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_MAP = ((177 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_AREA = ((178 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_LINK = ((179 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_IMG = ((180 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_OBJECT = ((181 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_PARAM = ((182 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_HR = ((183 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_P = ((184 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_H1 = ((185 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_H2 = ((186 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_H3 = ((187 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_H4 = ((188 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_H5 = ((189 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_H6 = ((190 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_PRE = ((191 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_Q = ((192 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_BLOCKQUOTE = ((193 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_INS = ((194 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_DEL = ((195 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_DL = ((196 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_DT = ((197 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_DD = ((198 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_OL = ((199 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_UL = ((200 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_LI = ((201 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_FORM = ((202 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_LABEL = ((203 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_INPUT = ((204 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_SELECT = ((205 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_OPTGROUP = ((206 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_OPTION = ((207 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TEXTAREA = ((208 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_FIELDSET = ((209 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_LEGEND = ((210 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_BUTTON = ((211 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TABLE = ((212 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_CAPTION = ((213 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_THEAD = ((214 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TFOOT = ((215 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TBODY = ((216 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_COLGROUP = ((217 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_COL = ((218 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TR = ((219 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TH = ((220 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TD = ((221 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_HEAD = ((222 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_TITLE = ((223 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_BASE = ((223 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_META = ((225 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_STYLE = ((226 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_SCRIPT = ((227 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_NOSCRIPT = ((228 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_HTML = ((229 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_SVG = ((230 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    HTML_BINDING_ELEMENT = ((230 << 23) | WickASTNodeClass.HTML_NODE | WickASTNodeClass.HTML_ELEMENT),
    CompiledBinding = ((231 << 23)),
    ComponentVariableDeclaration = ((232 << 23))
};

export enum WickASTNodeTypeLU {
    WickBinding = WickASTNodeType.WickBinding,
    HTML_IMPORT = WickASTNodeType.HTML_IMPORT,
    HTMLAttribute = WickASTNodeType.HTMLAttribute,
    HTMLText = WickASTNodeType.HTMLText,
    ERROR = WickASTNodeType.ERROR,
    HTML_Element = WickASTNodeType.HTML_Element,
    HTML_TEXT = WickASTNodeType.HTML_TEXT,
    HTML_TT = WickASTNodeType.HTML_TT,
    HTML_I = WickASTNodeType.HTML_I,
    HTML_B = WickASTNodeType.HTML_B,
    HTML_BIG = WickASTNodeType.HTML_BIG,
    HTML_SMALL = WickASTNodeType.HTML_SMALL,
    HTML_EM = WickASTNodeType.HTML_EM,
    HTML_STRONG = WickASTNodeType.HTML_STRONG,
    HTML_DFN = WickASTNodeType.HTML_DFN,
    HTML_CODE = WickASTNodeType.HTML_CODE,
    HTML_SAMP = WickASTNodeType.HTML_SAMP,
    HTML_KBD = WickASTNodeType.HTML_KBD,
    HTML_VAR = WickASTNodeType.HTML_VAR,
    HTML_CITE = WickASTNodeType.HTML_CITE,
    HTML_ABBR = WickASTNodeType.HTML_ABBR,
    HTML_ACRONYM = WickASTNodeType.HTML_ACRONYM,
    HTML_SUP = WickASTNodeType.HTML_SUP,
    HTML_SPAN = WickASTNodeType.HTML_SPAN,
    HTML_BDO = WickASTNodeType.HTML_BDO,
    HTML_BR = WickASTNodeType.HTML_BR,
    HTML_BODY = WickASTNodeType.HTML_BODY,
    HTML_ADDRESS = WickASTNodeType.HTML_ADDRESS,
    HTML_DIV = WickASTNodeType.HTML_DIV,
    HTML_A = WickASTNodeType.HTML_A,
    HTML_MAP = WickASTNodeType.HTML_MAP,
    HTML_AREA = WickASTNodeType.HTML_AREA,
    HTML_LINK = WickASTNodeType.HTML_LINK,
    HTML_IMG = WickASTNodeType.HTML_IMG,
    HTML_OBJECT = WickASTNodeType.HTML_OBJECT,
    HTML_PARAM = WickASTNodeType.HTML_PARAM,
    HTML_HR = WickASTNodeType.HTML_HR,
    HTML_P = WickASTNodeType.HTML_P,
    HTML_H1 = WickASTNodeType.HTML_H1,
    HTML_H2 = WickASTNodeType.HTML_H2,
    HTML_H3 = WickASTNodeType.HTML_H3,
    HTML_H4 = WickASTNodeType.HTML_H4,
    HTML_H5 = WickASTNodeType.HTML_H5,
    HTML_H6 = WickASTNodeType.HTML_H6,
    HTML_PRE = WickASTNodeType.HTML_PRE,
    HTML_Q = WickASTNodeType.HTML_Q,
    HTML_BLOCKQUOTE = WickASTNodeType.HTML_BLOCKQUOTE,
    HTML_INS = WickASTNodeType.HTML_INS,
    HTML_DEL = WickASTNodeType.HTML_DEL,
    HTML_DL = WickASTNodeType.HTML_DL,
    HTML_DT = WickASTNodeType.HTML_DT,
    HTML_DD = WickASTNodeType.HTML_DD,
    HTML_OL = WickASTNodeType.HTML_OL,
    HTML_UL = WickASTNodeType.HTML_UL,
    HTML_LI = WickASTNodeType.HTML_LI,
    HTML_FORM = WickASTNodeType.HTML_FORM,
    HTML_LABEL = WickASTNodeType.HTML_LABEL,
    HTML_INPUT = WickASTNodeType.HTML_INPUT,
    HTML_SELECT = WickASTNodeType.HTML_SELECT,
    HTML_OPTGROUP = WickASTNodeType.HTML_OPTGROUP,
    HTML_OPTION = WickASTNodeType.HTML_OPTION,
    HTML_TEXTAREA = WickASTNodeType.HTML_TEXTAREA,
    HTML_FIELDSET = WickASTNodeType.HTML_FIELDSET,
    HTML_LEGEND = WickASTNodeType.HTML_LEGEND,
    HTML_BUTTON = WickASTNodeType.HTML_BUTTON,
    HTML_TABLE = WickASTNodeType.HTML_TABLE,
    HTML_CAPTION = WickASTNodeType.HTML_CAPTION,
    HTML_THEAD = WickASTNodeType.HTML_THEAD,
    HTML_TFOOT = WickASTNodeType.HTML_TFOOT,
    HTML_TBODY = WickASTNodeType.HTML_TBODY,
    HTML_COLGROUP = WickASTNodeType.HTML_COLGROUP,
    HTML_COL = WickASTNodeType.HTML_COL,
    HTML_TR = WickASTNodeType.HTML_TR,
    HTML_TH = WickASTNodeType.HTML_TH,
    HTML_TD = WickASTNodeType.HTML_TD,
    HTML_HEAD = WickASTNodeType.HTML_HEAD,
    HTML_TITLE = WickASTNodeType.HTML_TITLE,
    HTML_BASE = WickASTNodeType.HTML_BASE,
    HTML_META = WickASTNodeType.HTML_META,
    HTML_STYLE = WickASTNodeType.HTML_STYLE,
    HTML_SCRIPT = WickASTNodeType.HTML_SCRIPT,
    HTML_NOSCRIPT = WickASTNodeType.HTML_NOSCRIPT,
    HTML_HTML = WickASTNodeType.HTML_HTML,
    HTML_SVG = WickASTNodeType.HTML_SVG,
    HTML_BINDING_ELEMENT = WickASTNodeType.HTML_BINDING_ELEMENT,
    CompiledBinding = WickASTNodeType.CompiledBinding,
    ComponentVariableDeclaration = WickASTNodeType.ComponentVariableDeclaration,
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
     * The nodes numerical type
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
    //@ts-ignore
    type: WickASTNodeType.WickBinding,
    /**
     * Local Identifier name, ie: name within component.
     */
    local?: string;

    /**
     * External Identifer name, ie: name exported to parent. 
     */
    extern?: string;
    primary_ast?: JSNode;
    secondary_ast?: JSNode;

    pos: Lexer;
}


export interface WickTextNode {
    /**
     * The nodes numerical type
     */
    type: WickASTNodeType;

    /**
     * A text string or Binding 
     */
    data: string;
    /**
     *  true if data is a Binding
     */
    IS_BINDING; boolean;

    pos: Lexer;
}

export interface WickContainerASTNode extends WickASTNode {

    is_container: true,
    components: Component[],

    component_names: string[],

    component_attributes: [string, string][][];

}