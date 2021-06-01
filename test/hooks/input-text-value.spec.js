/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Basic text input value binding", () => {

    const comp = (await wick_server(`
     
    var temp = "Hello World";
     
     export default <div> 
        <input type="text" value=\${temp}>
        \${temp}
     </div>
     `));


    assert(comp.class_string == "");
    const comp_instance = comp.createInstance();
});

assert_group("Server - Basic text input value binding", () => {

    const comp = (await wick_server(`
     
    var temp = "Hello World";
     
     export default <div> 
        <input type="text" value=\${temp}>
        \${temp}
     </div>
     `));


    // /assert(i, comp.class_string == "");
    const comp_instance = comp.createInstance();
});