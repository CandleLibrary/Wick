/**
 * Filtered container models 
 */

import spark from "@candlelib/spark";
import wick_browser from "@candlelib/wick";


wick_browser.utils.enableTest();

assert_group("Browser - Basic CSS selector string", browser, sequence, () => {

    // Needed to allow time for the CSS parser to initialize
    await spark.sleep(500);

    const comp = (await wick_browser(`
     
    var temp = "@a.test1";

    temp.style.color = "red";

    var temp2 = "@a.test2";

    temp2.style.color = "blue";
     
     export default <div> 
        <canvas></canvas>
        <a class="test1">TESTA</a>
        <a class="test2">TESTB</a>
     </div>
     `));
    const comp_instance = new comp.class();

    assert(comp_instance.ele.children[1].style.color == "red");
    assert(comp_instance.ele.children[2].style.color == "blue");

});