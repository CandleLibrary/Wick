/**
	Base CSS node. 
*/
export class CSSRule {

    constructor(name) {

        this.name = name;

        this.rules = {};

        this.props = {};

        this.sub_nodes = {};

        this.pseudo_class = {};

        this.pseudo_element = {};

        this.classes = {};

        this.ids = {};

        this.tags = {};
    }

    addProperty(prop){
    	if(prop)
    		this.props[prop.name] = prop.value;
    }

    comment(lexer) {
        if (lexer.tx == "/") {
            if (lexer.p().tx == "*") {
                lexer.n().n();
                while (lexer.n().tx && lexer.tx != "*") { /* NO OP */ }
                lexer.a("*").a("/");
            } else
                throw new Error("Expecting a `*` ");
        }
    }

    toString() {

    }


}

export class CSSValue {
    constructor() {
        this.props = {};
    }
}