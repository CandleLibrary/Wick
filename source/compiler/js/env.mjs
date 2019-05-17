import for_stmt from "./nodes/for.mjs"
import call_expr from "./nodes/call.mjs";
import identifier from "./nodes/identifier.mjs";
import catch_stmt from "./nodes/catch.mjs";
import try_stmt from "./nodes/try.mjs";
import stmts from "./nodes/stmts.mjs";
import block from "./nodes/block.mjs";
import lexical from "./nodes/lexical.mjs";
import binding from "./nodes/binding.mjs";
import member from "./nodes/member.mjs";
import assign from "./nodes/assign.mjs";
import add from "./nodes/add.mjs";
import sub from "./nodes/sub.mjs";
import div from "./nodes/div.mjs";
import mult from "./nodes/mult.mjs";
import object from "./nodes/object.mjs";
import base from "./nodes/base.mjs";
import string from "./nodes/string.mjs";
import null_ from "./nodes/null.mjs";
import number from "./nodes/number.mjs";
import bool from "./nodes/bool.mjs";
import negate from "./nodes/negate.mjs";
const env =  {
	table:{},
	ASI:true,
	functions:{
		for_stmt,
		call_expr,
		identifier,
		catch_stmt,
		try_stmt,
		stmts,
		lexical,
		binding,
		member,
		block,
		assign,
		object,
		add,
		sub,
		div,
		mult,
		negate_expr:negate,
		if_stmt:function(sym){this.bool = sym[2]; this.body = sym[4]; this.else = sym[6]},
		while_stmt:function(sym){this.bool = sym[1]; this.body = sym[3]},
		return_stmt:function(sym){this.expr = sym[1]},
		class_stmt: function(sym){this.id = sym[1], this.tail= sym[2]},
		class_tail:function(sym){this.heritage = sym[0]; this.body = sym[2]},
		debugger_stmt: base,
		lex_stmt: function(sym){this.ty = sym[0]; this.declarations = sym[1]},
		var_stmt: function(sym){this.declarations = sym[1], console.log(sym)},
		member_expr: function(sym){this.id = sym[0]; this.expr = sym[2]},
		add_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "ADD"},
		or_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "OR"},
		and_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "AND"},
		sub_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "SUB"},
		mult_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "MUL"},
		div_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "DIV"},
		mod_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "MOD"},
		lt_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "LT"},
		gt_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "GT"},
		lte_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "LTE"},
		gte_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "GTE"},
		eq_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "EQ"},
		seq_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "STRICT_EQ"},
		neq_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "NEQ"},
		sneq_expr : function (sym){this.le = sym[0]; this.re=sym[2]; this.ty = "STRICT_NEQ"},
		unary_not_expr : function (sym){this.expr = sym[1]; this.ty = "NOT"},
		unary_plus : function (sym){this.expr = sym[1]; this.ty = "PRE INCR"},
		unary_minus : function (sym){this.expr = sym[1]; this.ty = "PRE INCR"},
		pre_inc_expr : function (sym){this.expr = sym[1]; this.ty = "PRE INCR"},
		pre_dec_expr : function (sym){this.expr = sym[1]; this.ty = "PRE DEC"},
		post_inc_expr : function (sym){this.expr = sym[0]; this.ty = "POST INCR"},
		post_dec_expr : function (sym){this.expr = sym[0]; this.ty = "POST DEC"},
		condition_expr : function (sym){this.condition = sym[0]; this.le = sym[2]; this.re = sym[4]},
		null_literal :null_,
		numeric_literal : number,
		bool_literal : bool,
		string_literal : string,
		label_stmt : function(sym){this.label =sym[0]; this.stmt = sym[1]},
		funct_decl: function(id,args,body){this.id = id || "Anonymous"; this.args = args; this.body = body, this.scope = false},
		this_expr: function(){},
		defaultError: (tk, env, output, lex, prv_lex) => {
            /*USED for ASI*/
            if (env.ASI && lex.tx !== ")" && !lex.END) {
                let ENCOUNTERED_NL = (lex.tx == "}" || lex.END);

                while (!ENCOUNTERED_NL && !prv_lex.END && prv_lex.off < lex.off) {
                    prv_lex.next();
                    if (prv_lex.ty == prv_lex.types.nl)
                        ENCOUNTERED_NL = true;
                }

	            if (ENCOUNTERED_NL)
	                return ";";
            }

            if(lex.END)
            	return ";";

            return null;
        }

	},


	options : {
		integrate : false,
		onstart : ()=>{
			console.log("SDFS")
			env.table = {};
        	env.ASI = true;	
        }
	}
}

export default env;
