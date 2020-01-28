import attribute from "../../compiler/html/attribute.js";

attribute.prototype.stamp = function(lite, output, str) {
	if (this.RENDER)
		if (!this.isBINDING) {
			str.push(`${this.name}${this.value ? `="${this.value}"` : "" }`);
		} else {
			/*
			//Binding sends value over. 
			const bind = this.value.bind(scope, pinned);
			const io = new this.io_constr(scope, this, bind, this.name, element, this.value.ast_other);
			scope.ios.push(io);
			*/
		}
};