/**
	Base CSS node. 
*/

export class CSSNode {
	
	constructor(name){
		
		this.name = null;
		
		this.props = {}

		this.sub_nodes = {}
		this.pseudo_class = {};
	}

	toString(){

	}

	parse(lexer){
		
	}
}

export class CSSValue {
	constructor(){
		this.props = {};
	}
}