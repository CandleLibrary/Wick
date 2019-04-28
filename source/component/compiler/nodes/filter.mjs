import { VoidNode } from "./void";

export class FilterNode extends VoidNode {

    /******************************************* HOOKS ****************************************************/

    endOfElementHook() {}

    /**
     * This node only needs to assess attribute values. InnerHTML will be ignored. 
     * @return     {boolean}  { description_of_the_return_value }
     */
    selfClosingTagHook() { return true; }

}