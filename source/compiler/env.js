//*
import {
    script,
    module,
    import_declaration,
    import_clause,
    default_import,
    name_space_import,
    named_imports,
    import_specifier,
    export_declaration,
    export_clause,
    export_specifier,
    throw_statement,
    add_expression,
    and_expression,
    array_literal,
    arrow_function_declaration,
    assignment_expression,
    await_expression,
    binding,
    block_statement,
    bit_and_expression,
    label_statement,
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
    empty_statement,
    null_literal,
    lexical_expression,
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
    parenthasized,
    break_statement,
    continue_statement,
    switch_statement,
    variable_statement,
    case_statement,
    default_case_statement,
    class_method,
    template,
    template_head,
    template_middle,
    template_tail,
    class_declaration,
    for_of_statement,
    for_in_statement,
    super_literal
} from "@candlefw/js";
//*/

//HTML
import element_selector from "./html/element_selector.js";
import attribute from "./html/attribute.js";
import wick_binding from "./html/binding.js";
import text from "./html/text.js";
import js_html_literal from "./html/js_html_literal.js";

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


function create_ordered_list(sym, offset = 0, level = -1, env, lex) {

    for (let i = offset; i < sym.length; i++) {
        const s = sym[i],
            lvl = (s.lvl) ? s.lvl.length : 0,
            li = s.li;

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
        js_wick_node: js_html_literal,

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

        //*        //JS
        super_literal,
        lexical_expression,
        add_expression,
        and_expression,
        argument_list,
        array_literal,
        for_of_statement,
        arrow: arrow_function_declaration,
        arrow_function_declaration,
        assignment_expression,
        await_expression,
        binding,
        bit_and_expression,
        bit_or_expression,
        bit_xor_expression,
        block_statement,
        bool_literal,
        break_statement,
        call_expression,
        case_statement,
        catch_statement,
        class_declaration,
        class_method,
        condition_expression,
        continue_statement,
        debugger_statement,
        default_case_statement,
        default_import,
        delete_expression,
        divide_expression,
        empty_statement,
        equality_expression,
        exponent_expression,
        export_clause,
        export_declaration,
        export_specifier,
        expression_list,
        expression_statement,
        for_statement,
        function_declaration,
        identifier,
        if_statement,
        import_clause,
        import_declaration,
        import_specifier,
        in_expression,
        instanceof_expression,
        label_statement,
        left_shift_expression,
        lexical: lexical_declaration,
        member_expression,
        module,
        modulo_expression,
        multiply_expression,
        name_space_import,
        named_imports,
        negate_expression,
        new_expression,
        null_literal,
        numeric_literal,
        object_literal,
        for_in_statement,
        or_expression,
        parenthasized,
        plus_expression,
        post_decrement_expression,
        post_increment_expression,
        pre_decrement_expression,
        pre_increment_expression,
        property_binding,
        return_statement,
        right_shift_expression,
        right_shift_fill_expression,
        script,
        spread_element,
        statements,
        string,
        string_literal: string,
        subtract_expression,
        switch_statement,
        template,
        template_head,
        template_middle,
        template_tail,
        this_literal,
        throw_statement,
        try_statement,
        typeof_expression,
        unary_not_expression,
        unary_or_expression,
        unary_xor_expression,
        variable_statement,
        void_expression,
        //*/
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
            if (lex.tx == "//" || lex.tx == "/*") {
                if (lex.tx == "//") {
                    while (!lex.END && lex.ty !== lex.types.nl)
                        lex.next();
                } else
                if (lex.tx == "/*") {
                    while (!lex.END && (lex.tx !== "*" || lex.pk.tx !== "/"))
                        lex.next();
                    lex.next(); //"*"
                }

                lex.next();
            }

            /*USED for ASI*/
            if (env.ASI && lex.tx !== ")" && !lex.END) {

                if (lex.tx == "</") // As in "<script> script body => (</)script>"
                    return lu({ tx: ";" });

                let ENCOUNTERED_END_CHAR = (lex.tx == "}" || lex.END || lex.tx == "</");

                while (!ENCOUNTERED_END_CHAR && !prv_lex.END && prv_lex.off < lex.off) {
                    prv_lex.next();
                    if (prv_lex.ty == prv_lex.types.nl)
                        ENCOUNTERED_END_CHAR = true;
                }

                if (ENCOUNTERED_END_CHAR) {
                    lex.tl = 0;
                    return lu({ tx: ";" });
                }
            }

            if (lex.END) {
                lex.tl = 0;
                return lu({ tx: ";" });
            }
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
