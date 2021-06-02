/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Element Export Statement", () => {

    const comp = (await wick_server(`

    let count = 0;
    
    export default  <div export="count:count"></div>
     `));

    assert(i, comp.class_string == "");
});

// Function filter
// Filter function with non-static binding variables