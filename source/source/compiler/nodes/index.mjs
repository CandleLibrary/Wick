import { HTMLNode, TextNode } from "@candlefw/html";

import { RootNode } from "./root.mjs";
import { ScriptNode } from "./script.mjs";
import { SourceNode } from "./source.mjs";
import { LinkNode } from "./link.mjs";
import { SourceContainerNode } from "./container.mjs";
import { StyleNode } from "./style.mjs";
import { VoidNode } from "./void.mjs";
import { SVGNode } from "./svg.mjs";
import { SlotNode } from "./slot.mjs";
import { PreNode } from "./pre.mjs";
import { Plugin } from "../../../plugin.mjs";
import { replaceEscapedHTML } from "../../../utils/string.mjs";

//Since all nodes extend the RootNode, this needs to be declared here to prevent module cycles. 
async function CreateHTMLNode(tag, offset, lex) {



    if (await Plugin.parseHTMLonTag(tag, this, lex))
        return null;

    //jump table.
    switch (tag[0]) {
        case "w":
            switch (tag) {
                case "w-s":
                    return new SourceNode(); //This node is used to 
                case "w-c":
                    return new SourceContainerNode(); //This node is used to 
            }
            break;
        default:
            switch (tag) {
                case "a":
                    return new LinkNode();
                    /** void elements **/
                case "template":
                    return new VoidNode();
                case "style":
                    return new StyleNode();
                case "script":
                    return new ScriptNode();
                case "svg":
                case "path":
                    return new SVGNode();
                case "slot":
                    return new SlotNode();
                case "pre":
                    return new PreNode();
            }
    }

    return new RootNode();
}

HTMLNode.prototype.processTextNodeHook = async function(lex, IS_INNER_HTML) {

    let t = lex.trim(1);

    if (!IS_INNER_HTML)
        return new TextNode(replaceEscapedHTML(t.slice()));

    if (t.string_length > 0)
        return new TextNode(replaceEscapedHTML(t.slice()));

    return null;
}


RootNode.prototype.createHTMLNodeHook = CreateHTMLNode;

export { RootNode, CreateHTMLNode };
