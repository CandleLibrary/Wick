import { Lexer } from "@candlefw/wind";

export interface Comment extends Lexer {
    node?: Node;
}