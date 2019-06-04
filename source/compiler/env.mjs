import {
    for_stmt,
    call_expr,
    identifier,
    catch_stmt,
    try_stmt,
    stmts as statements,
    block,
    lexical,
    binding,
    member,
    assign,
    add,
    exp,
    sub,
    div,
    mult,
    object,
    debugger_stmt,
    string,
    null_,
    number,
    bool,
    negate,
    rtrn,
    condition,
    array_literal,
    this_expr,
    property_binding,
    arrow,
    funct_decl,
    expression_list,
    if_stmt,
    post_inc,
    post_dec,
    expr_stmt,
    _or,
    _and,
    not,
    new_member_stmt,
    spread,
    equal,
    greater,
    greater_eq,
    less,
    less_eq
} from "@candlefw/js";

//HTML
import element_selector from "./html/element_selector.mjs";
import attribute from "./html/attribute.mjs";
import wick_binding from "./html/binding.mjs";
import text from "./html/text.mjs";

const env = {
    table: {},
    ASI: true,
    functions: {
        //HTML
        element_selector,
        attribute,
        wick_binding,
        text,

        //JS
        //JS
        add,
        and: _and,
        array_literal,
        arrow,
        assign,
        binding,
        block,
        bool_literal: bool,
        call_expr,
        catch_stmt,
        condition_expr: condition,
        debugger_stmt,
        div,
        eq: equal,
        exp,
        expr_stmt,
        expression_list,
        for_stmt,
        funct_decl,
        gt: greater,
        gteq: greater_eq,
        identifier,
        if_stmt,
        lexical,
        lt: less,
        lteq: less_eq,
        member,
        mult,
        negate_expr: negate,
        null_literal: null_,
        numeric_literal: number,
        object,
        or: _or,
        post_dec_expr: post_dec,
        post_inc_expr: post_inc,
        property_binding,
        unary_not_expr: not,
        new_member_stmt,
        spread_expr: spread,
        return_stmt: rtrn,
        stmts:statements,
        string_literal: string,
        sub,
        this_expr,
        try_stmt,
        while_stmt: function(sym) {
            this.bool = sym[1];
            this.body = sym[3];
        },
        var_stmt: function(sym) { this.declarations = sym[1] },
        mod_expr: function(sym) {
            this.le = sym[0];
            this.re = sym[2];
            this.ty = "MOD";
        },
        seq_expr: function(sym) {
            this.le = sym[0];
            this.re = sym[2];
            this.ty = "STRICT_EQ";
        },
        neq_expr: function(sym) {
            this.le = sym[0];
            this.re = sym[2];
            this.ty = "NEQ";
        },
        sneq_expr: function(sym) {
            this.le = sym[0];
            this.re = sym[2];
            this.ty = "STRICT_NEQ";
        },
        unary_plus: function(sym) {
            this.expr = sym[1];
            this.ty = "PRE INCR";
        },
        unary_minus: function(sym) {
            this.expr = sym[1];
            this.ty = "PRE INCR";
        },
        pre_inc_expr: function(sym) {
            this.expr = sym[1];
            this.ty = "PRE INCR";
        },
        pre_dec_expr: function(sym) {
            this.expr = sym[1];
            this.ty = "PRE DEC";
        },

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
