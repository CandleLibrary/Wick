import element from "../../compiler/html/script.js.js";

import { GetOutGlobals, copyAST } from "../js/script_functions.js.js.js.js.js";


element.prototype.stamp = function(tools, output, indent_level = 0, eleid = [0]) {
	if (this.READY) {

		this.on.processJSAST();

		output.js.binds.push({
			IS_ASYNC : this.IS_ASYNC,
			ast: copyAST(this.original_ast),
			on: this.on.args.map(id => ({ name:id.name })),
			inputs: this.args.filter(id=>id.IS_TAPPED).map(id => ({ name:id.name })),
			outputs: GetOutGlobals(this.original_ast, { custom: {} }).ids.map(id => ({ name:id.vals[0] }))
		});
	}
};