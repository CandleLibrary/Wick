/**
 * Basic JS Parser Kludge to get legitimate foreign identifiers from expressions.
 * This could later be expanded into a full JS parser to generate proper JS ASTs.
 * @class      JSExpressionIdentifiers 
 * @param      {Lexer}  lex     The lex
 * @return     {Object}  { description_of_the_return_value }
 */
export function JSExpressionIdentifiers(lex) {
    let _identifiers_ = [];
    let model_cache = {};

    let IN_OBJ = false,
        CAN_BE_ID = true;
    while (!lex.END) {
        
        switch (lex.ty) {
            case lex.types.id:
                if (!IN_OBJ || CAN_BE_ID) {
                    let id = lex.tx;
                    if (!model_cache[id]) {
                        _identifiers_.push(lex.tx);
                        model_cache[id] = true;
                    }
                }   
                break;
            case lex.types.op:
            case lex.types.sym:
            case lex.types.ob:
            case lex.types.cb:
                switch (lex.ch) {
                    case "+":
                    case ">":
                    case "<":
                    case "/":
                    case "*":
                    case "-":
                        CAN_BE_ID = true;
                        break;
                    case "[":
                        IN_OBJ = false;
                        CAN_BE_ID = true;
                        break;
                    case "{":
                    case ".": //Property Getters
                        CAN_BE_ID = false;
                        IN_OBJ = true;
                        break;
                    case "]":
                    case ";":
                    case "=":
                    case "}":
                    case "(":
                        IN_OBJ = false;
                        break;
                    case ",":
                        if (IN_OBJ)
                            CAN_BE_ID = false;
                        else
                            IN_OBJ = false;
                        break;
                    case ":":
                    case "=":
                        CAN_BE_ID = true;
                }
                break;
        }
        lex.n();
    }


    return _identifiers_;
}