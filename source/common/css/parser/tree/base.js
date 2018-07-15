/**
	Base CSS node. 
*/
export class CSSRule {

    constructor(name) {

        this.name = name;

        this.rules = null;

        this.props = null;

        this.sub_nodes = null;

        this.pseudo_class = null;

        this.pseudo_element = null;

        this.classes = null;

        this.ids = null;

        this.tags = null;
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