import { HTMLNode, TextNode } from "@candlefw/html";
import { RootNode } from "./root.mjs";
import { ScriptNode } from "./script.mjs";
import { ScopeNode } from "./scope.mjs";
import { LinkNode } from "./link.mjs";
import { ScopeContainerNode } from "./container.mjs";
import { StyleNode } from "./style.mjs";
import { VoidNode } from "./void.mjs";
import { SVGNode } from "./svg.mjs";
import { SlotNode } from "./slot.mjs";
import { PreNode } from "./pre.mjs";
import { Plugin } from "../../../plugin.mjs";
import { replaceEscapedHTML } from "../../../utils/string.mjs";
import whind from "@candlefw//whind"

//Since all nodes extend the RootNode, this needs to be declared here to prevent module cycles. 
async function CreateHTMLNode(tag, offset, lex) {

    if (await Plugin.parseHTMLonTag(tag, this, lex))
        return null;
    //jump table.
    if (tag[0] == "w")
        switch (tag) {
            case "w-s":
            case "w-scope":
                return new ScopeNode(); //This node is used to 
            case "w-c":
            case "w-container":
                return new ScopeContainerNode(); //This node is used to 
        }
        
    switch (tag) {
        case "a":
            return new LinkNode();
            /** void elements **/
        case "template":
            return new VoidNode();
        case "css":
        case "style":
            return new StyleNode();
        case "js":
        case "script":
            return new ScriptNode();
        case "svg":
        case "path":
            return new SVGNode();
        case "container":
            return new ScopeContainerNode();
        case "scope":
            return new ScopeNode();
        case "slot":
            return new SlotNode();
            //Elements that should not be parsed for binding points.
        case "pre":
        case "code":
            return new PreNode();
    }


    return new RootNode();
}

RootNode.prototype.createHTMLNodeHook = CreateHTMLNode;

// Adding the parseHTMLonTag to the original HTMLNode object. 
HTMLNode.prototype.createHTMLNodeHook = async function(tag, start, lex) { if (await Plugin.parseHTMLonTag(tag, this, lex)) return null; return new HTMLNode(tag); }

// Adding the parseInnerHTMLOnTag plugin to the original HTMLNode object.
HTMLNode.prototype.ignoreTillHook = async function(tag, lex) {
    
    if (await Plugin.parseInnerHTMLOnTag(tag, this, lex)){
        return true;
    }

    if (tag == "script" || tag == "style") // Special character escaping tags.
        return true;

    return false;
}

// Adding replaceEscapedHTML to original HTMLNode object.
HTMLNode.prototype.processTextNodeHook = async function(lex, IS_INNER_HTML) {

    let t = lex.trim(1);

    if (!IS_INNER_HTML)
        return new TextNode(replaceEscapedHTML(t.slice()));

    if (t.string_length > 0)
        return new TextNode(replaceEscapedHTML(t.slice()));

    return null;
}

HTMLNode.prototype.endOfElementHook = async function(){
    return await Plugin.tagHandler(this.tag, this);
}

export { RootNode, CreateHTMLNode };
