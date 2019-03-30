import { RootNode } from "./root";

/**
 * Void elements don't exist, they evaporate into the void.
 * Element children of VoidNodes are appended to the last element created.
 */
export class VoidNode extends RootNode {

    //createElement() { return null; }

    /******************************************* HOOKS ****************************************************/

    endOfElementHook() {}

    processTextNodeHook() {}

    /******************************************* BUILD ****************************************************/

    build(a, b, c, d, e, f, g, h = false) {
    	if(h)
    		return super.build(a, b, c, d, e, f, g, h)
    }

    /******************************************* CSS ****************************************************/

    linkCSS() {}
}
