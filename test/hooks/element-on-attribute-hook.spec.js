/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Basic Clicker Listener", () => {

    const comp = (await wick_server(`

    let count = 0;
    
    var greetings  = ["Hola", "Hello", "Salute"] ;
    
    export default  <button onclick=\${count++} > \${ greetings[count % greetings.length] } </button>
     `));

    assert(i, comp.class_string == "");
});

// Function filter
// Filter function with non-static binding variables