import { RootNode } from "./root";

export class LinkNode extends RootNode {
    _createElement_(presets, source){
        let element = document.createElement("a");
        presets.processLink(element, source);
        return element;
    }
}