import { MinTreeNode } from "@candlefw/js";
import { Lexer } from "@candlefw/whind";
export declare enum WickASTNodeType {
    ERROR = "ERROR",
    HTML = "HTML",
    SCRIPT = "SCRIPT",
    STYLE = "STYLE",
    TEXT = "TEXT"
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
    IS_BINDING: any;
    boolean: any;
}
export interface WickTextNode {
    /**
     * A text string or Binding
     */
    data: string | WickBinding;
    /**
     *  true if data is a Binding
     */
    IS_BINDING: any;
    boolean: any;
}
export interface WickBinding {
    primary_ast?: MinTreeNode;
    secondary_ast?: MinTreeNode;
    lex: Lexer;
}
