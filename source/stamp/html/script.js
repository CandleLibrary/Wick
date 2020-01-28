import element from "../../compiler/html/script.js";

import { assignment_expression, types, identifier, member_expression, call_expression, string, parenthasized, this_literal, expression_list, parse as JSParse } from "@candlefw/js";

import { GetOutGlobals, AddEmit as addEmitExpression, AsyncInClosure, copyAST } from "../../compiler/js/script_functions.js";

/* Returns the first expression statment node in the resultant ast of the parse tree of string argument. */
function buildExpression(string) {
    const js_ast = JSParse(string);
    return js_ast.vals[0];
}

element.prototype.stamp = function(tools, output, indent_level = 0, eleid = [0]) {
	if (this.READY) {

		this.on.processJSAST();

		output.js.binds.push({
			ast: copyAST(this.original_ast),
			on: this.on.args.map(id => ({ name:id.name })),
			inputs: this.args.map(id => ({ name:id.name })),
			outputs: GetOutGlobals(this.original_ast, { custom: {} }).ids.map(id => ({ name:id.vals[0] }))
		});
	}
};