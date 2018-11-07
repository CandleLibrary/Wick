import {VoidNode} from "./void";

export class StyleNode extends VoidNode {
    _processTextNodeHook_(lex) {
        //Feed the lexer to a new CSS Builder
        let css = this.getCSS();

        lex.IWS = true;
        lex.tl = 0;
        lex.n();

        css._parse_(lex).catch((e) => {
            throw e;
        });
    }
}
