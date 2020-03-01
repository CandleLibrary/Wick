import { MinTreeNode } from "@candlefw/js";
import { Lexer } from "@candlefw/whind";

export enum WickASTNodeType {
    ERROR = "ERROR",
    HTML = "HTML",
    SCRIPT = "SCRIPT",
    STYLE = "STYLE",

    TEXT = "TEXT",
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