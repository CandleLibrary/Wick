/**[API]:testing 
    Test for two-way binding between a text input and a model data. 

    Reference Info:S
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
    https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/oninput
*/

import wick from "../build/library/wick.js";
import spark from "@candlefw/spark";

// Bindings should be two-way on input elements [value] attribute 
// by default

await wick.server()

const data = { input_data = "send" };
const comp = new (await wick(`
    import { input_data } from "@model";

    default export <div>
        <input type="text" value=\${input_data}></input>
    </div>`)).class(data);



// Force component update by prempting spark's update
// cycle

spark.update();

assert(comp.ele.children[0].data == "receive");

//HTML
comp.ele.children[0].data = "received"
comp.ele.children[0].runEvent("input", {})


spark.update();

assert(data.input_data == "receive");



