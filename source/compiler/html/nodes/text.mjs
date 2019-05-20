import Binding from "./binding.mjs";

import {TextNodeIO} from "../../component/io/io.mjs";

export default class TextNode{

	constructor(sym, env){
        this.data = sym[0];
        this.IS_BINDING = (this.data instanceof Binding);
	}

    toString(off = 0) {
        return `${offset.repeat(off)} ${this.data.toString()}\n`;
    }

	mount(element, scope, statics){
		const ele = document.createTextNode("")
		
		element.appendChild(ele);

		if(this.IS_BINDING){
			const bind = this.data.bind(scope);
			const io = new TextNodeIO(scope, bind, ele, this.data.exprb);

		}else{
			ele.data = this.data;
		}
	}
}