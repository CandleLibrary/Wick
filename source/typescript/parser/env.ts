//CSS
import {
    url,
    percentage,
    length,
    parseDeclaration,
    CSSNodeTypeLU
} from "@candlefw/css";

import { ParserEnvironment } from "@candlefw/hydrocarbon";
import { Lexer } from "@candlefw/wind";
import { JSParserEnvironment, JSParserEnv, JSNodeTypeLU } from "@candlefw/js";

import { HTMLNodeTypeLU } from "../types/wick_ast_node_types.js";

export const NodeTypes = Object.assign({}, CSSNodeTypeLU, HTMLNodeTypeLU, JSNodeTypeLU);

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

    typ: NodeTypes,

    cls: Object.assign({}, JSParserEnvironment.cls),

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

        frrh: (tk, env: ParserEnvironment & { ASI: boolean; }, output, lex, prv_lex, ss, lu) => {
            const val = JSParserEnvironment.functions.frrh(tk, env, output, lex, prv_lex, ss, lu);

            if (val >= 0) return val;

            return -1;
        },

        lrrh: (tk, env: ParserEnvironment & { ASI: boolean; }, output, lex, prv_lex, ss, lu) => {
            const val = JSParserEnvironment.functions.lrrh(tk, env, output, lex, prv_lex, ss, lu);

            if (val >= 0) return val;

            return -1;
        },
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
