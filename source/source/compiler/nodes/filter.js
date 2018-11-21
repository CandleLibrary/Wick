import { VoidNode } from "./void";

export class FilterNode extends VoidNode {

    /******************************************* HOOKS ****************************************************/

    _endOfElementHook_() {}

    /**
     * This node only needs to assess attribute values. InnerHTML will be ignored. 
     * @return     {boolean}  { description_of_the_return_value }
     */
    _selfClosingTagHook_() { return true; }

}