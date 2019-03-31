import { HTMLNode, TextNode } from "@candlefw/html";
import { replaceEscapedHTML } from "../../../utils/string.mjs";

export class PreNode extends HTMLNode {
    build(element) {
        let ele = document.createElement(this.tag);

        for (let i = 0, l = this.attributes.length; i < l; i++) {
            let attr = this.attributes[i];
            ele.setAttribute(attr.name, attr.value);
        }
        //let passing_element = ele;
        let passing_element = (this.tag == "template") ? ele.content : ele;

        for (let node = this.fch; node;
            (node = this.getNextChild(node))) {
            node.build(passing_element);
        }

        if (element) element.appendChild(ele);

        return ele;
    }

    async processTextNodeHook(lex, IS_INNER_HTML) {

        let t = lex.trim(1);

        if (!IS_INNER_HTML)
            return new TextNode(replaceEscapedHTML(t.slice()));

        let txt = "";

        if (t.string_length > 0)
            return new TextNode(replaceEscapedHTML(t.slice()));

        return null;
    }
}
