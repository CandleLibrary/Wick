//CSS
import {
    url,
    percentage,
    length,
    parseDeclaration,
    CSSTreeNodeType
} from "@candlefw/css";

import { ParserEnvironment } from "@candlefw/hydrocarbon/build/library/runtime.js";
import { Lexer } from "@candlefw/wind";
import { MinTreeNodeClass, MinTreeNodeType, JSParserEnvironment, JSParserEnv } from "@candlefw/js";

import { WickASTNodeType } from "../types/wick_ast_node_types.js";

type WickParserEnvironment = ParserEnvironment & JSParserEnv & {
    ASI: boolean;
    /**
     * Test
     */
    typ: any;
    cls: any;
};
const env = <WickParserEnvironment>{

    table: {},

    ASI: true,

    typ: Object.assign(WickASTNodeType, MinTreeNodeType, CSSTreeNodeType),

    cls: Object.assign({}, MinTreeNodeClass),

    functions: {
        //CSS
        parseDeclaration,
        url,
        percentage,
        length,

        //JS
        parseTemplate: JSParserEnvironment.functions.parseTemplate,
        parseString: JSParserEnvironment.functions.parseString,
        reinterpretArrowParameters: JSParserEnvironment.functions.reinterpretArrowParameters,
        reinterpretParenthesized: JSParserEnvironment.functions.reinterpretParenthesized,
        buildJSAST: JSParserEnvironment.functions.buildJSAST,

        eofError(tk, env, output, lex) {
            //Unexpected End of Input
            env.addParseError("Unexpected end of input", lex, env.url);
        },

        generalError(tk, env, output, lex) {
            //Unexpected value
            env.addParseError(`Unexpected token [${tk}]`, lex, env.url);
        },

        defaultError: (tk, env: ParserEnvironment & { ASI: boolean; }, output, lex, prv_lex, ss, lu) => {
            if (lex.tx == "//" || lex.tx == "/*") {
                if (lex.tx == "//") {
                    while (!lex.END && lex.ty !== lex.types.nl)
                        lex.next();

                    if (lex.END) {
                        lex.tl = 0;
                        return 0;//lu({ tx: ";" });
                    }
                } else
                    if (lex.tx == "/*") {
                        //@ts-ignore
                        while (!lex.END && (lex.tx !== "*" || lex.pk.tx !== "/"))
                            lex.next();
                        lex.next(); //"*"

                    }

                return lu(lex.next());
            }


            /*USED for Automatic Semicolon Insertion*/
            if (env.ASI && lex.tx !== ")" && !lex.END) {

                let ENCOUNTERED_END_CHAR = (lex.tx == "}" || lex.END);

                while (!ENCOUNTERED_END_CHAR && !prv_lex.END && prv_lex.off < lex.off) {
                    prv_lex.next();
                    if (prv_lex.ty == prv_lex.types.nl)
                        ENCOUNTERED_END_CHAR = true;
                }

                if (lex.tx == "</") // As in "<script> script body => (</)script>"
                {
                    lex.tl = 0;
                    return lu(<Lexer>{ tx: ";" });
                }


                if (ENCOUNTERED_END_CHAR) {
                    lex.tl = 0;
                    return lu(<Lexer>{ tx: ";" });
                }
            }

            if (lex.ty == lex.types.sym && lex.tx.length > 1) {
                //Try splitting up the symbol
                lex.tl = 0;

                lex.next(lex, false);
                return lu(lex);
            }

            if (lex.END) {
                lex.tl = 0;
                return lu(<Lexer>{ tx: ";" });
            }
        }
    },

    options: {
        integrate: false,

        onstart: () => {

            //env.table = {};
            env.ASI = true;
        }
    }

};

export default env;
