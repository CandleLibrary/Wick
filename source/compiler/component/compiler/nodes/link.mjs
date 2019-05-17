import { RootNode } from "./root";

export class LinkNode extends RootNode {
    createElement(presets, scope){
        let element = document.createElement("a");
        presets.processLink(element, scope);
        return element;
    }

    build(...s){
    	super.build(...s)
    }
}
