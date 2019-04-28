import { RootNode } from "./root";

/**
 * SVG HTMLElements to be created with the svg namespace in order to be rendered correctly.
 * @class      SVGNode (name)
 */
export class SVGNode extends RootNode {
    createElement(presets, scope) {
        return document.createElementNS("http://www.w3.org/2000/svg", this.tag);
    }

    createHTMLNodeHook(tag) {
        //jump table.
        switch (tag[0]) {
            case "w":
                switch (tag) {
                    case "w-s":
                        return new ScopeNode(); //This node is used to 
                    case "w-c":
                        return new ScopeContainerNode(); //This node is used to 
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
                }
        }

        return new SVGNode();
    }
}
