import {
    add_expression,
    and_expression,
    array_literal,
    arrow_function_declaration,
    assignment_expression,
    await_expression,
    binding,
    block_statement,
    bit_and_expression,
bit_or_expression,
bit_xor_expression,
    bool_literal,
    call_expression,
    catch_statement,
    condition_expression,
    debugger_statement,
    delete_expression,
    divide_expression,
    equality_expression,
    exponent_expression,
    expression_list,
    expression_statement,
    for_statement,
    function_declaration,
    identifier,
    if_statement,
    in_expression,
    instanceof_expression,
    left_shift_expression,
    lexical_declaration,
    member_expression,
    modulo_expression,
    multiply_expression,
    negate_expression,
    new_expression,
    null_literal,
    numeric_literal,
    object_literal,
    or_expression,
    plus_expression,
    post_decrement_expression,
    post_increment_expression,
    pre_decrement_expression,
    pre_increment_expression,
    property_binding,
    right_shift_expression,
    right_shift_fill_expression,
    return_statement,
    spread_element,
    statements,
    string,
    subtract_expression,
    this_literal,
    try_statement,
    typeof_expression,
    unary_not_expression,
    unary_or_expression,
    unary_xor_expression,
    void_expression,
    argument_list,
    parenthasized

} from "@candlefw/js";

//HTML
import element_selector from "./html/element_selector.mjs";
import attribute from "./html/attribute.mjs";
import wick_binding from "./html/binding.mjs";
import text from "./html/text.mjs";

//CSS
import {
    compoundSelector,
    comboSelector,
    selector,
    idSelector,
    classSelector,
    attribSelector,
    pseudoClassSelector,
    pseudoElementSelector,
    parseDeclaration
} from "@candlefw/css";


function create_ordered_list(sym, offset = 0, level = -1, env, lex) {

    for (let i = offset; i < sym.length; i++) {
        const s = sym[i],
            lvl = (s.lvl) ? s.lvl.length : 0,
            li = s.li;
            console.log(s.lvl)

        if (lvl > level) {
            create_ordered_list(sym, i, lvl, env, lex);
        } else if (lvl < level) {
            sym[offset] = element_selector("ul", null, sym.splice(offset, i - offset), env, lex);
            return;
        } else
            sym[i] = li;
    }

    return sym[offset] = element_selector("span", null, sym.splice(offset, sym.length - offset), env, lex);
}

const env = {
    table: {},
    ASI: true,
    functions: {
        //HTML
        element_selector,
        attribute,
        wick_binding,
        text,

        //CSS
        compoundSelector,
        comboSelector,
        selector,
        idSelector,
        classSelector,
        attribSelector,
        pseudoClassSelector,
        pseudoElementSelector,
        parseDeclaration,

        //JS
        parenthasized,
        add_expression,
        and_expression,
        array_literal,
        arrow_function_declaration,
        assignment_expression,
        await_expression,
        bit_and_expression,
bit_or_expression,
bit_xor_expression,
        binding,
        block_statement,
        bool_literal,
        call_expression,
        catch_statement,
        condition_expression,
        debugger_statement,
        delete_expression,
        divide_expression,
        equality_expression,
        exponent_expression,
        expression_list,
        expression_statement,
        for_statement,
        function_declaration,
        identifier,
        if_statement,
        in_expression,
        instanceof_expression,
        left_shift_expression,
        lexical: lexical_declaration,
        member_expression,
        modulo_expression,
        multiply_expression,
        negate_expression,
        new_expression,
        null_literal,
        numeric_literal,
        object_literal,
        or_expression,
        plus_expression,
        post_decrement_expression,
        post_increment_expression,
        pre_decrement_expression,
        pre_increment_expression,
        property_binding,
        right_shift_expression,
        right_shift_fill_expression,
        return_statement,
        spread_element,
        statements,
        string_literal: string,
        string,
        subtract_expression,
        this_literal,
        try_statement,
        typeof_expression,
        unary_not_expression,
        unary_or_expression,
        unary_xor_expression,
        void_expression,
        argument_list,
        arrow: arrow_function_declaration,

        //MARKDOWN
        create_ordered_list,

        while_stmt: function(sym) {
            this.bool = sym[1];
            this.body = sym[3];
        },
        var_stmt: function(sym) { this.declarations = sym[1] },

        label_stmt: function(sym) {
            this.label = sym[0];
            this.stmt = sym[1];
        },

        defaultError: (tk, env, output, lex, prv_lex, ss, lu) => {
            /*USED for ASI*/

            if (env.ASI && lex.tx !== ")" && !lex.END) {

                if (lex.tx == "</") // As in "<script> script body => (</)script>"
                    return lu.get(";");

                let ENCOUNTERED_END_CHAR = (lex.tx == "}" || lex.END || lex.tx == "</");

                while (!ENCOUNTERED_END_CHAR && !prv_lex.END && prv_lex.off < lex.off) {
                    prv_lex.next();
                    if (prv_lex.ty == prv_lex.types.nl)
                        ENCOUNTERED_END_CHAR = true;
                }

                if (ENCOUNTERED_END_CHAR)
                    return lu.get(";");
            }

            if (lex.END)
                return lu.get(";");
        }
    },

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

    options: {
        integrate: false,
        onstart: () => {
            env.table = {};
            env.ASI = true;
        }
    }
};

export default env;
