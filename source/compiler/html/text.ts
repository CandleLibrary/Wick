import Binding from "./binding.js";

import { ContainerLinkIO, TextNodeIO } from "../component/io/io.js";

const offset = "    ",
    html_entities = [
    [/&lt;/g, "<"],
    [/&gt;/g, ">"],
    [/&lpar;/g, "("],
    [/&rpar;/g, ")"],
    [/&quot;/g, '"'],
    [/&nbsp;/g, "\u00a0"],
    [/&amp;/g, '&']
];

function replaceEntities(text){
    return html_entities
            .reduce(((r,e)=>r.replace(e[0],e[1])),text)
            .replace(/&#x([a-fA-F\d]{4});/, (d,m)=>String.fromCharCode(parseInt("0x"+m)));
}

export default class TextNode {

    constructor(sym) {
        this.IS_BINDING = (sym[0] instanceof Binding);
        this.data = sym[0] || "";
        this.unescaped_data = "";
        this.tag = "text";

        if(!this.IS_BINDING)
            this.unescaped_data = replaceEntities(this.data);
    }

    toString(data, off = 0) {
        return `${offset.repeat(off)} ${this.data.toString(data)}`;
    }

    finalize() {
        return this;
    }

    get IS_WHITESPACE() {
        return !this.IS_BINDING && (!this.data.toString().trim());
    }

    mount(element, scope, presets, statics, pinned, ele = document.createTextNode("")) {
        const IS_TEXT_NODE = ele instanceof Text;

        if (IS_TEXT_NODE)
            element.appendChild(ele);

        if (this.IS_BINDING) {
            const bind = this.data.bind(scope, null, pinned),
                io = new(IS_TEXT_NODE ? TextNodeIO : ContainerLinkIO)(scope, bind.main, ele, bind.alt);
            scope.ios.push(io);
            return io;
        } else
            ele.data = this.unescaped_data;
    }
}