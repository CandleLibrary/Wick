import { RootNode } from "./root";

export class LinkNode extends RootNode {
    _createElement_(presets){
        let element = document.createElement("a");
        presets.processLink(element);
        return element;
    }
}