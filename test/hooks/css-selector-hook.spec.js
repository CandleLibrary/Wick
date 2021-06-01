/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Basic text input value binding", () => {

    const comp = (await wick_server(`
     
    var temp = "@a.test1";

    temp.style = "color:red";
     
     export default <div> 
        <canvas></canvas>
        <a class="test1">TESTA</a>
        <a class="test2">TESTB</a>
     </div>
     `));


    assert(comp.class_string == "");
    const comp_instance = comp.createInstance();
});