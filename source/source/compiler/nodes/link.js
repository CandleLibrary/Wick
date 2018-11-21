import { RootNode } from "./root";

export class LinkNode extends RootNode {
    createElement(presets, source){
        let element = document.createElement("a");
        presets.processLink(element, source);
        return element;
    }
}