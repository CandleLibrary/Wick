import { RootNode } from "./root";

/**
 * Void elements don't exist, they evaporate into the void.
 * Element children of VoidNodes are appended to the last element created.
 */
export class VoidNode extends RootNode {

    createElement() { return null; }

    /******************************************* HOOKS ****************************************************/

    _endOfElementHook_() {}

    _processTextNodeHook_() {}

    /******************************************* BUILD ****************************************************/

    _build_() {}

    /******************************************* CSS ****************************************************/

    _linkCSS_() {}
}