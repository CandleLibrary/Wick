/**
 * Filtered container models 
 */

import spark from "@candlelib/spark";
import wick_browser from "@candlelib/wick";


wick_browser.utils.enableTest();

const comp = (await wick_browser(`

let count = 0;

var greetings  = ["Hola", "Hello", "Salute"] ;

export default  <button onclick=\${count++} > \${ greetings[count % (greetings.length)] } </button>
 `));

//assert(comp.class_string == "");
assert_group("Browser - Basic Clicker Listener", browser, sequence, () => {


    const instance = comp.mount({}, document.body);

    instance.ele.dispatchEvent(new Event("click"), instance.ele);

    await spark.sleep(100);

    instance.ele.dispatchEvent(new Event("click"), instance.ele);

    await spark.sleep(100);

    //instance.ele.dispatchEvent(new Event("click"), instance.ele);

    await spark.sleep(300);

    assert(instance.ele.innerText == "Salute");
});

// Function filter
// Filter function with non-static binding variables