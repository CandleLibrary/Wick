import { RootNode } from "./root";

/**
 * Void elements don't exist, they evaporate into the void.
 * Element children of VoidNodes are appended to the last element created.
 */
export class VoidNode extends RootNode {

    //createElement() { return null; }

    /******************************************* HOOKS ****************************************************/

    endOfElementHook() { return this }

    processTextNodeHook() {}

    /******************************************* BUILD ****************************************************/

    build(a, b, c, d, e, f, g = false) {
        if (g)
            return super.build(a, b, c, d, e, f, g)
    }

    /******************************************* CSS ****************************************************/

    linkCSS() {}
}
