import {VoidNode} from "./void";

export class StyleNode extends VoidNode {
    processTextNodeHook(lex) {
        //Feed the lexer to a new CSS Builder
        let css = this.getCSS();

        lex.IWS = true;
        lex.tl = 0;
        lex.n;

        css.parse(lex).catch((e) => {
            throw e;
        });
    }
}
