import Binding from "./binding.js";

import { DataNodeIO } from "../component/io/io.js";

const offset = "";

export default class TextNode {

    constructor(sym, env) {
        this.data = sym[0];
        this.IS_BINDING = (this.data instanceof Binding);
        this.tag = "text";
    }

    toString(off = 0) {
        return `${offset.repeat(off)} ${this.data.toString()}\n`;
    }

    finalize(){
        return this;
    }

    get IS_WHITESPACE(){
        return !this.IS_BINDING && (!this.data.trim());
    }

    mount(element, scope, presets, statics, pinned, ele = document.createTextNode("")) {

        if (ele instanceof Text)
            element.appendChild(ele);

        if (this.IS_BINDING)
            return new DataNodeIO(scope, this.data.bind(scope, null, pinned), ele, this.data.exprb);
        else
            ele.data = this.data;
    }
}
