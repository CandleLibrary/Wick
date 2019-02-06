import { RootNode } from "./root.mjs";
import { ScriptNode } from "./script.mjs";
import { SourceNode } from "./source.mjs";
import { LinkNode } from "./link.mjs";
import { SourceTemplateNode } from "./template.mjs";
import { StyleNode } from "./style.mjs";
import { VoidNode } from "./void.mjs";
import { SVGNode } from "./svg.mjs";
import { SlotNode } from "./slot.mjs";
//Since all nodes extend the RootNode, this needs to be declared here to prevent module cycles. 
function CreateHTMLNode(tag) {
    //jump table.
    switch (tag[0]) {
        case "w":
            switch (tag) {
                case "w-s":
                    return new SourceNode(); //This node is used to 
                case "w-c":
                    return new SourceTemplateNode(); //This node is used to 
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
            }
    }

    return new RootNode();
}

RootNode.prototype.createHTMLNodeHook = CreateHTMLNode;

export { RootNode, CreateHTMLNode };