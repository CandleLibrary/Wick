import Binding from "./binding.js";

import { ContainerLinkIO, TextNodeIO } from "../component/io/io.js";

const offset = "";

export default class TextNode {

    constructor(sym, env) {
        this.data = sym[0] || "";
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
        return !this.IS_BINDING && (!this.data.toString().trim());
    }

    mount(element, scope, presets, statics, pinned, ele = document.createTextNode("")) {
        const IS_TEXT_NODE = ele instanceof Text;

        if (IS_TEXT_NODE)
            element.appendChild(ele);

        if (this.IS_BINDING){
            const io =  new (IS_TEXT_NODE ? TextNodeIO : ContainerLinkIO)(scope, this.data.bind(scope, null, pinned), ele, this.data.exprb);
            scope.ios.push(io);
            return io;
        }
        else
            ele.data = this.data;
    }
}
