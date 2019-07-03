const for_stmt = ()=>{}
const call_expr = ()=>{}
const identifier = ()=>{}
const catch_stmt = ()=>{}
const try_stmt = ()=>{}
const stmts = ()=>{}
const block = ()=>{}
const lexical = ()=>{}
const binding = ()=>{}
const member = ()=>{}
const assign = ()=>{}
const add = ()=>{}
const sub = ()=>{}
const div = ()=>{}
const mult = ()=>{}
const object = ()=>{}
const base = ()=>{}
const string = ()=>{}
const null_ = ()=>{}
const number = ()=>{}
const bool = ()=>{}
const negate = ()=>{}
const rtrn = ()=>{}
const element_selector = ()=>{}
const attribute = ()=>{}
const wick_binding = ()=>{}
const text = ()=>{}



const env =  {
	table:{},
	ASI:true,
	functions:{
		//HTML
		element_selector,
		attribute,
		wick_binding,
		text,

		//JS
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
		return_stmt:rtrn,
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

	prst:[],
	pushPresets(prst){
		env.prst.push(prst)
	},
	popPresets(){
		return env.prst.pop();
	},
	get presets(){
		return env.prst[env.prst.length -1 ] || null;
	},

	options : {
		integrate : false,
		onstart : ()=>{
			env.table = {};
        	env.ASI = true;	
        }
	}
}

export default env;
