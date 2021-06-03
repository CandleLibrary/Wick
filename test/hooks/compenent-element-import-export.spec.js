/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Element Export Statement", () => {

    const comp = (await wick_server(`
    import child_component from "./test/hooks/data/import-export-component.wick";

    let my_data = [3,4,5];
    
    export default  <child_component export="my_data:data"></child_component>;

    export {my_data as data}
     `));

    assert(i, comp.class_string == "");
});

// Function filter
// Filter function with non-static binding variables