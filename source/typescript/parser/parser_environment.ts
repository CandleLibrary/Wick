//*/

//CSS
import {
    stylesheet,
    stylerule,
    ruleset,
    compoundSelector,
    comboSelector,
    typeselector,
    selector,
    idSelector,
    classSelector,
    attribSelector,
    pseudoClassSelector,
    pseudoElementSelector,
    parseDeclaration
} from "@candlefw/css";

import { ParserEnvironment } from "@candlefw/hydrocarbon";
import { Lexer } from "@candlefw/whind";

type WickParserEnvironment = ParserEnvironment & {
    /**
     * Toggle for Automatic Semicolon Insertion while error recovering.
     */
    ASI: boolean;
};

const env = <WickParserEnvironment>{
    table: {},
    ASI: true,
    functions: {
        //CSS
        compoundSelector,
        comboSelector,
        selector,
        idSelector,
        classSelector,
        typeselector,
        attribSelector,
        pseudoClassSelector,
        pseudoElementSelector,
        parseDeclaration,
        stylesheet,
        stylerule,
        ruleset,

        eofError(tk, env, output, lex, prv_lex, ss, lu) {
            //Unexpected End of Input
            env.addParseError("Unexpected end of input", lex, env.url);
        },

        generalError(tk, env, output, lex, prv_lex, ss, lu) {
            //Unexpected value
            env.addParseError(`Unexpected token [${tk}]`, lex, env.url);
        },

        defaultError: (tk, env: ParserEnvironment & {ASI:boolean}, output, lex, prv_lex, ss, lu) => {



            if (lex.tx == "//" || lex.tx == "/*") {
                if (lex.tx == "//") {
                    while (!lex.END && lex.ty !== lex.types.nl)
                        lex.next();
                } else
                    if (lex.tx == "/*") {
                        //@ts-ignore lexer state mutates with lex.next in second line
                        while (!lex.END && (lex.tx !== "*" || lex.pk.tx !== "/"))
                            lex.next();
                        lex.assert("*"); //Lex tk == "*"
                    }

                return lu(lex.next());
            }

            /*USED for ASI*/
            if (env.ASI && lex.tx !== ")" && !lex.END) {

                let ENCOUNTERED_END_CHAR = (lex.tx == "}" || lex.END || lex.tx == "</");

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
    /*
    prst: [],

    pushPresets(prst) {
        env.prst.push(prst);
    },

    popPresets() {
        return env.prst.pop();
    },

    get presets() {
        return env.prst[env.prst.length - 1] || null;
    },
    */
    options: {
        integrate: false,
        onstart: () => {
            //env.table = {};
            env.ASI = true;
        }
    }
};

export default env;
