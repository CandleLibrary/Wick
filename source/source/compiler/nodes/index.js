import { RootNode } from "./root";
import { ScriptNode } from "./script";
import { SourceNode } from "./source";
import { LinkNode } from "./link";
import { SourceTemplateNode } from "./template";
import { StyleNode } from "./style";
import { VoidNode } from "./void";

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
            }
    }

    return new RootNode();
}

RootNode.prototype._createHTMLNodeHook_ = CreateHTMLNode;

export { RootNode, CreateHTMLNode };