import { RootNode } from "./root";

/**
 * SVG HTMLElements to be created with the svg namespace in order to be rendered correctly.
 * @class      SVGNode (name)
 */
export class SVGNode extends RootNode {
    createElement(presets, source){
        return document.createElementNS("http://www.w3.org/2000/svg", this.tag);
    }
}