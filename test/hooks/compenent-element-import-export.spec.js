/**
 * Filtered container models 
 */

import { ExportToChildAttributeHook } from "../../build/library/compiler/ast-build/hooks/data-flow.js";
import wick_server from "../../build/library/entry-point/wick-server.js";


wick_server.utils.enableTest();

assert_group("Server - Element Export Statement", () => {

    const comp = (await wick_server(`
    import child_component from "./test/hooks/data/import-export-component.wick";

    let my_data = [4,5,6];
    
    export default  <child_component export={my_data as data}></child_component>;

    export {my_data as data}
     `));

    assert("Correct hook is created", comp.indirect_hooks.some(s => s.type == ExportToChildAttributeHook) == true);

    const ele = await comp.getRootElement();

    assert("Prefill data present", ele.innerText == "1,2,3,4,5,6");

});

// Function filter
// Filter function with non-static binding variables