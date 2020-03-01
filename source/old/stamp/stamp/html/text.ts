import text from "../../compiler/html/text.js.js";

text.prototype.stamp = function(tools, output, indent_level = 0, eleid = [0], ctr = 0) {
	
	if (this.IS_BINDING) {
		//Create binding and push a placeholder element
		this.data.processJSAST();
		
		if(ctr){
			output.js.binds.push({
				ast: tools.buildExpression(`this.c${ctr}.l(${this.data.ast.vals[0]})`),
				inputs: this.data.args.map(id => ({ name:id.name })),
				outputs: []
			});
		}else{
			output.html.push(tools.indent("<span></span>", indent_level));

			output.js.binds.push({
				ast : tools.buildExpression(`${tools.getElement(output, eleid).name}.innerHTML=${this.data.ast.vals[0]}`),
				inputs: this.data.args.map(id => ({ name:id.name })),
				outputs: []
			});

			eleid[eleid.length-1]++;
		}
	} else
		output.html[output.html.length -1] += this.data;
};