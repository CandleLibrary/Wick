import text from "../../compiler/html/text.js";
import { assignment_expression, types, identifier, member_expression, call_expression, string, parenthasized, this_literal, expression_list, parse as JSParse } from "@candlefw/js";


/* Returns the first expression statment node in the resultant ast of the parse tree of string argument. */
function buildExpression(string) {
    const js_ast = JSParse(string);
    return js_ast.vals[0];
}

text.prototype.stamp = function(tools, output, indent_level = 0, eleid = [0], ctr = null) {
	
	if (this.IS_BINDING) {
		//Create binding and push a placeholder element
		if(ctr){

		}else{
			output.html.push(tools.indent("<span is-text-binding pos=\""+eleid.join("|")+"\"></span>", indent_level));

			this.data.processJSAST();

			output.js.binds.push({
				ast : buildExpression(`${tools.getElement(output, eleid).name}.innerHTML=${this.data.ast.vals[0]}`),
				inputs: this.data.args.map(id => ({ name:id.name })),
				outputs: []
			});

			eleid[eleid.length]++;
		}
	} else
		output.html[output.html.length -1] += this.data;
};