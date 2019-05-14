import JSParser from "./js.mjs";
import env from "./js.env.mjs";
import identifier from "./nodes/identifier.mjs";
import types from "./types.mjs"

export default {
	parse(lex){
		let l = lex.copy();

		return JSParser(lex, env);
	},

	validate(lex){
		let l = lex.copy();

		console.log(l.slice())
		try{
			let result = JSParser(lex, env);
			console.log(result)
			return true;
		}catch(e){
			console.error(e);
			return false;
		}
	},

	getRootVariables(lex){
		let l = lex.copy();
		
		let ids = new Set();
		let closure = new Set();

		try{
			let result = JSParser(lex, env);

			if(result instanceof identifier){
				ids.add(result.val);
			}else
				result.getRootIds(ids, closure);

			return {ids, ast:result, SUCCESS : true}
		}catch(e){
			return {ids, ast:null, SUCCESS : false};
		}
	},

	types : types
}
