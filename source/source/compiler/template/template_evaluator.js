import { JSExpressionIdentifiers } from "../../../common/js/root";
import { RawValueBinding, EventBinding, ExpressionBinding, DynamicBinding, } from "./basic_bindings";
import {barrier_a_start,barrier_a_end,barrier_b_start,barrier_b_end } from "../../../root/config/global"
const BannedIdentifiers = { "true": true, "false": 1, "class": 1, "function": 1,  "return": 1, "for" : 1, "new" : 1, "let" : 1, "var" : 1, "const" : 1, "Date": 1, "null": 1};

function setIdentifier(id, store, cache) {
    if (!cache[id] && !BannedIdentifiers[id]) {
        store.push(id);
        cache[id] = true;
    }
}

const FunctionCache = new Map();

function processExpression(lex, binds) {

    /* 
     * The token after the second sentinel does not cover the entire bind range.
     * So the text with in the bind range should be a multi token token JS expression. 
     * We should extract all identifiers and use them to create bind points for an ExpressionIO.
     * 
     * The expression should work with a function return statement, as in:
     * ```javasript
     * "return (implied)" name ? "User has a name!" : "User does not have a name!"
     * ```
     */
    const bind_ids = [];

    const function_string = lex.slice();

    const existing_names = {};

    /**TODO? - This could be replaced by a plugin to ensure proper Javascript expressions. Perhaps producing a JS AST */
    let args = JSExpressionIdentifiers(lex);
    //console.log(function_string, args);

    for (let i = 0, l = args.length; i < l; i++)
        setIdentifier(args[i], bind_ids, existing_names);
    bind_ids.push(`return ${function_string}`);
    let funct = (Function).apply(null, bind_ids);

    const bindings = [];

    for (let i = 0, l = bind_ids.length - 1; i < l; i++) {
        let binding = new DynamicBinding();
        binding.tap_name = bind_ids[i];
        bindings.push(binding);
    }

    binds.push(new ExpressionBinding(bindings, funct));
}

/**
 * { function_description }
 * @memberof   module:wick~internals.compiler
 * @param      {Lexer}  lex     The lex
 * @return     {Array}   an
 */
export function evaluate(lex, EVENT = false) {

    let binds = [];


    lex.IWS = false;

    let start = lex.pos;
    while (!lex.END && lex.ty !== lex.types.str) {
        switch (lex.ch) {
            case barrier_a_start:
                if (lex.pk.ch == barrier_b_start || lex.p.ch == barrier_a_start) {

                    let sentinel = (lex.p.ch == barrier_a_start) ? barrier_a_end : barrier_b_end;

                    let pk2 = lex.p.pk;


                    if (pk2.ch == barrier_b_start) {
                        sentinel = barrier_b_end;
                        if (start < lex.p.pos)
                            binds.push(new RawValueBinding(lex.p.slice(start)));

                        lex.p.sync();
                    } else if (start < lex.pos) {
                        //debugger
                        //console.log(lex.slice(start));
                        binds.push(new RawValueBinding(lex.slice(start)));
                    } //create text node


                    lex.sync().n();
                    lex.IWS = true; // Do not produce white space tokens during this portion.
                    let pk = lex.pk;
                    let Message= false;


                    while (!pk.END && (pk.ch !== sentinel || (pk.pk.ch !== barrier_a_end && pk.p.ch !== barrier_a_start) || (pk.p.n().ch === barrier_a_end))) { 
                        let prev = pk.ch;
                        pk.n(); 
                        if(pk.ch == barrier_a_start && prev == barrier_a_end)
                            Message =true;
                    }


                    if (lex.tl < pk.off - lex.off - 1 && !Message) {
                        /***** Start Expression *******/

                        const elex = lex.copy(); //The expression Lexer

                        elex.fence(pk);

                        lex.sync();

                        if (pk.END) //Should still have `))` or `|)` in the input string
                            throw new Error("Should be more to this!");

                        processExpression(elex, binds);

                        lex.a(sentinel);
                        /***** End Expression ********/
                    } else {

                        /************************** Start Single Identifier Binding *******************************/
                        let id = lex.tx;
                        let binding = new DynamicBinding();
                        binding.tap_name = id;
                        let index = binds.push(binding) - 1;
                        lex.n().a(sentinel);

                        if (EVENT) {
                            /***************************** Looking for Event Bindings ******************************************/
                            
                            if (lex.ch == barrier_a_start || lex.ch == barrier_b_start) {

                                binds[index] = new EventBinding(binds[index]);

                                let sentinel = (lex.ch == barrier_a_start) ? barrier_a_end : barrier_b_end;

                                lex.IWS = true; // Do not produce white space tokens during this portion.

                                let pk = lex.pk;

                                while (!pk.END && (pk.ch !== sentinel || (pk.pk.ch !== barrier_a_end))) { pk.n(); }

                                lex.n();

                                if (lex.tl < pk.off - lex.off || BannedIdentifiers[lex.tx]) {

                                    const elex = lex.copy(); //The expression Lexer

                                    elex.fence(pk);

                                    lex.sync();

                                    if (pk.END) //Should still have `))` or `|)` in the input string
                                        throw new Error("Should be more to this!");

                                    const event_binds = [];

                                    processExpression(elex, event_binds);

                                    binds[index].bind = event_binds[0];

                                    lex.a(sentinel);

                                } else {
                                    if (lex.ch !== sentinel) {
                                        let id = lex.tx,
                                            binding;
                                        if (lex.ty !== lex.types.id) {
                                            switch (lex.ty) {
                                                case lex.types.num:
                                                    binding = new RawValueBinding(parseFloat(id));
                                                    break;
                                                case lex.types.str:
                                                    binding = new RawValueBinding(id.slice(1, -1));
                                                    break;
                                                default:
                                                    binding = new RawValueBinding(id.slice);
                                            }
                                        } else {
                                            binding = new DynamicBinding();
                                            binding.tap_name = id;
                                        }
                                        binds[index].bind = binding;
                                        lex.n();
                                    }
                                    lex.a(sentinel);
                                }
                            }
                        }
                    }

                    lex.IWS = false;
                    
                    start = lex.off + 1; //Should at the sentinel.
                    
                    lex.a(barrier_a_end);
                    
                    continue;
                }
                break;
        }
        lex.n();
    }

    if (start < lex.off) {
        lex.off = start;
        lex.END = false;
        lex.tl = 0;
        lex.END = false;

        let DATA_END = start;

        while (!lex.n().END)
            if (!(lex.ty & (lex.types.ws | lex.types.nl)))
                DATA_END = lex.off + lex.tl;
            
        if (DATA_END > start) {
            lex.sl = DATA_END;
            binds.push(new RawValueBinding(lex.slice(start)));
        }
    }

    return binds;
}