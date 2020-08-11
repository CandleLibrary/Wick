import { JSNode, JSNodeClass } from "@candlefw/js";
import { Lexer } from "@candlefw/wind";
import { Component } from "../wick";




export const enum WickNodeClass {
    HTML_NODE = (1 << 20),

    HTML_ELEMENT = (1 << 21)
}

export const WICK_AST_NODE_TYPE_BASE = 147;
export const WICK_AST_NODE_TYPE_SIZE = 85;


/**
 * Wick node values and types. Extends JavaScript nodes described in @candlefw/js, and CSS nodes described in @candlefw/css
 */

export const enum WickNodeType {
    WickBinding = (147 << 23),
    HTML_IMPORT = ((148 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTMLAttribute = ((149 << 23) | WickNodeClass.HTML_NODE),
    HTMLText = ((150 << 23) | WickNodeClass.HTML_NODE),
    ERROR = ((151 << 23)),
    HTML_Element = ((152 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TEXT = ((153 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TT = ((154 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_I = ((155 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_B = ((156 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_BIG = ((157 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_SMALL = ((158 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_EM = ((159 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_STRONG = ((160 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_DFN = ((161 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_CODE = ((162 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_SAMP = ((163 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_KBD = ((164 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_VAR = ((165 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_CITE = ((166 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_ABBR = ((167 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_ACRONYM = ((168 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_SUP = ((169 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_SPAN = ((170 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_BDO = ((171 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_BR = ((172 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_BODY = ((173 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_ADDRESS = ((174 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_DIV = ((175 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_A = ((176 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_MAP = ((177 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_AREA = ((178 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_LINK = ((179 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_IMG = ((180 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_OBJECT = ((181 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_PARAM = ((182 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_HR = ((183 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_P = ((184 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_H1 = ((185 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_H2 = ((186 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_H3 = ((187 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_H4 = ((188 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_H5 = ((189 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_H6 = ((190 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_PRE = ((191 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_Q = ((192 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_BLOCKQUOTE = ((193 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_INS = ((194 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_DEL = ((195 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_DL = ((196 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_DT = ((197 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_DD = ((198 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_OL = ((199 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_UL = ((200 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_LI = ((201 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_FORM = ((202 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_LABEL = ((203 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_INPUT = ((204 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_SELECT = ((205 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_OPTGROUP = ((206 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_OPTION = ((207 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TEXTAREA = ((208 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_FIELDSET = ((209 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_LEGEND = ((210 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_BUTTON = ((211 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TABLE = ((212 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_CAPTION = ((213 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_THEAD = ((214 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TFOOT = ((215 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TBODY = ((216 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_COLGROUP = ((217 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_COL = ((218 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TR = ((219 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TH = ((220 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TD = ((221 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_HEAD = ((222 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_TITLE = ((223 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_BASE = ((223 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_META = ((225 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_STYLE = ((226 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_SCRIPT = ((227 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_NOSCRIPT = ((228 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_HTML = ((229 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_SVG = ((230 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    HTML_BINDING_ELEMENT = ((230 << 23) | WickNodeClass.HTML_NODE | WickNodeClass.HTML_ELEMENT),
    CompiledBinding = ((231 << 23)),
    ComponentVariableDeclaration = ((232 << 23))
};

export enum WickNodeTypeLU {
    WickBinding = WickNodeType.WickBinding,
    HTML_IMPORT = WickNodeType.HTML_IMPORT,
    HTMLAttribute = WickNodeType.HTMLAttribute,
    HTMLText = WickNodeType.HTMLText,
    ERROR = WickNodeType.ERROR,
    HTML_Element = WickNodeType.HTML_Element,
    HTML_TEXT = WickNodeType.HTML_TEXT,
    HTML_TT = WickNodeType.HTML_TT,
    HTML_I = WickNodeType.HTML_I,
    HTML_B = WickNodeType.HTML_B,
    HTML_BIG = WickNodeType.HTML_BIG,
    HTML_SMALL = WickNodeType.HTML_SMALL,
    HTML_EM = WickNodeType.HTML_EM,
    HTML_STRONG = WickNodeType.HTML_STRONG,
    HTML_DFN = WickNodeType.HTML_DFN,
    HTML_CODE = WickNodeType.HTML_CODE,
    HTML_SAMP = WickNodeType.HTML_SAMP,
    HTML_KBD = WickNodeType.HTML_KBD,
    HTML_VAR = WickNodeType.HTML_VAR,
    HTML_CITE = WickNodeType.HTML_CITE,
    HTML_ABBR = WickNodeType.HTML_ABBR,
    HTML_ACRONYM = WickNodeType.HTML_ACRONYM,
    HTML_SUP = WickNodeType.HTML_SUP,
    HTML_SPAN = WickNodeType.HTML_SPAN,
    HTML_BDO = WickNodeType.HTML_BDO,
    HTML_BR = WickNodeType.HTML_BR,
    HTML_BODY = WickNodeType.HTML_BODY,
    HTML_ADDRESS = WickNodeType.HTML_ADDRESS,
    HTML_DIV = WickNodeType.HTML_DIV,
    HTML_A = WickNodeType.HTML_A,
    HTML_MAP = WickNodeType.HTML_MAP,
    HTML_AREA = WickNodeType.HTML_AREA,
    HTML_LINK = WickNodeType.HTML_LINK,
    HTML_IMG = WickNodeType.HTML_IMG,
    HTML_OBJECT = WickNodeType.HTML_OBJECT,
    HTML_PARAM = WickNodeType.HTML_PARAM,
    HTML_HR = WickNodeType.HTML_HR,
    HTML_P = WickNodeType.HTML_P,
    HTML_H1 = WickNodeType.HTML_H1,
    HTML_H2 = WickNodeType.HTML_H2,
    HTML_H3 = WickNodeType.HTML_H3,
    HTML_H4 = WickNodeType.HTML_H4,
    HTML_H5 = WickNodeType.HTML_H5,
    HTML_H6 = WickNodeType.HTML_H6,
    HTML_PRE = WickNodeType.HTML_PRE,
    HTML_Q = WickNodeType.HTML_Q,
    HTML_BLOCKQUOTE = WickNodeType.HTML_BLOCKQUOTE,
    HTML_INS = WickNodeType.HTML_INS,
    HTML_DEL = WickNodeType.HTML_DEL,
    HTML_DL = WickNodeType.HTML_DL,
    HTML_DT = WickNodeType.HTML_DT,
    HTML_DD = WickNodeType.HTML_DD,
    HTML_OL = WickNodeType.HTML_OL,
    HTML_UL = WickNodeType.HTML_UL,
    HTML_LI = WickNodeType.HTML_LI,
    HTML_FORM = WickNodeType.HTML_FORM,
    HTML_LABEL = WickNodeType.HTML_LABEL,
    HTML_INPUT = WickNodeType.HTML_INPUT,
    HTML_SELECT = WickNodeType.HTML_SELECT,
    HTML_OPTGROUP = WickNodeType.HTML_OPTGROUP,
    HTML_OPTION = WickNodeType.HTML_OPTION,
    HTML_TEXTAREA = WickNodeType.HTML_TEXTAREA,
    HTML_FIELDSET = WickNodeType.HTML_FIELDSET,
    HTML_LEGEND = WickNodeType.HTML_LEGEND,
    HTML_BUTTON = WickNodeType.HTML_BUTTON,
    HTML_TABLE = WickNodeType.HTML_TABLE,
    HTML_CAPTION = WickNodeType.HTML_CAPTION,
    HTML_THEAD = WickNodeType.HTML_THEAD,
    HTML_TFOOT = WickNodeType.HTML_TFOOT,
    HTML_TBODY = WickNodeType.HTML_TBODY,
    HTML_COLGROUP = WickNodeType.HTML_COLGROUP,
    HTML_COL = WickNodeType.HTML_COL,
    HTML_TR = WickNodeType.HTML_TR,
    HTML_TH = WickNodeType.HTML_TH,
    HTML_TD = WickNodeType.HTML_TD,
    HTML_HEAD = WickNodeType.HTML_HEAD,
    HTML_TITLE = WickNodeType.HTML_TITLE,
    HTML_BASE = WickNodeType.HTML_BASE,
    HTML_META = WickNodeType.HTML_META,
    HTML_STYLE = WickNodeType.HTML_STYLE,
    HTML_SCRIPT = WickNodeType.HTML_SCRIPT,
    HTML_NOSCRIPT = WickNodeType.HTML_NOSCRIPT,
    HTML_HTML = WickNodeType.HTML_HTML,
    HTML_SVG = WickNodeType.HTML_SVG,
    HTML_BINDING_ELEMENT = WickNodeType.HTML_BINDING_ELEMENT,
    CompiledBinding = WickNodeType.CompiledBinding,
    ComponentVariableDeclaration = WickNodeType.ComponentVariableDeclaration,
}


export interface WickNode {
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
    nodes?: WickNode[];
    /**
     * The nodes numerical type
     */
    type: WickNodeType;
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

    attributes?: WickNode[];

    value?: string;
}


export interface WickBindingNode extends WickNode {
    //@ts-ignore
    type: WickNodeType.WickBinding,
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
    type: WickNodeType;

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

export interface WickContainerASTNode extends WickNode {

    is_container: true,
    components: Component[],

    component_names: string[],

    component_attributes: [string, string][][];

}