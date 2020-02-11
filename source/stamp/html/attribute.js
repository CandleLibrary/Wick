import attribute from "../../compiler/html/attribute.js";
import { AttribIO, InputIO, EventIO } from "../../compiler/component/io/io.js";

attribute.prototype.stamp = function(tools, output, str, eleid, node) {
	if (this.RENDER)
		if (!this.isBINDING) {
			str.push(`${this.name}${this.value ? `="${this.value}"` : "" }`);
		} else {
			let 
				down = this.value.original_ast.render(),
				up = down,
				event = this.name,
				value = "{event:e}";//this.value.original_ast.render();

				this.value.processJSAST();

			switch (this.io_constr) {
				case InputIO:

					if(this.value.ast_other)
						up = this.value.ast_other.render();

					output.js.binds.push({
						ast: tools.buildExpression(`${tools.getElement(output, eleid).name}.value = ${down}`),
						inputs: this.value.args.map(id => ({ name: id.name })),
						outputs: []
					});

					//Checkbox Input elements use the checkbox attribute instead of the value attribute 
					value = "e.target." + (node.getAttribute("type") == "checkbox" ? "checked" : "value");
					event = "input";

					//intentional
				case EventIO:

					output.js.events.push({
						ele: tools.getElement(output, eleid).name,
						event:event.replace("on",""),
						value,
						output: up,
						prevent_propagation: this.name.slice(-1) == "_"
					});

					break;
				case AttribIO:

					output.js.binds.push({
						ast: tools.buildExpression(`${tools.getElement(output, eleid).name}.setAttribute("${this.name}",${this.value.ast.vals[0]})`),
						inputs: this.value.args.filter(id=>id.IS_TAPPED).map(id => ({ name: id.name })),
						outputs: []
					});
					break;
			}

			/*
			//Binding sends value over. 
			const bind = this.value.bind(scope, pinned);
			const io = new this.io_constr(scope, this, bind, this.name, element, this.value.ast_other);
			scope.ios.push(io);
			*/
		}
};