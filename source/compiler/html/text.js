import Binding from "./binding.js";

import { DataNodeIO, TextNodeIO } from "../component/io/io.js";

const offset = "";

export default class TextNode {

    constructor(sym, env, lex) {
        if(sym[0] instanceof Binding){
            this.data = sym[0];
            this.IS_BINDING = true;
        }else{
            this.data = lex.str.slice(env.off, lex.off)
        }
        this.tag = "text";
    }

    toString(off = 0) {
        return `${offset.repeat(off)} ${this.data.toString()}\n`;
    }

    finalize(){
        return this;
    }

    get IS_WHITESPACE(){
        return !this.IS_BINDING && (!this.data.toString().trim());
    }

    mount(element, scope, presets, statics, pinned, ele = document.createTextNode("")) {
        const IS_TEXT_NODE = ele instanceof Text;
        if (IS_TEXT_NODE)
            element.appendChild(ele);

        if (this.IS_BINDING)
            return new (IS_TEXT_NODE ? TextNodeIO : DataNodeIO)(scope, this.data.bind(scope, null, pinned), ele, this.data.exprb);
        else
            ele.data = this.data;
    }
}
