/**[API]:testing 
    Test for two-way binding between a checkbox input and a model data. 

    Reference Info:S
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
    https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick
*/

import wick from "@candlelib/wick";
import spark from "@candlelib/spark";

//import wick from "../../..//build/library/entry-point/wick-server.js";

// Bindings should be two-way on input elements [value] attribute 
// by default

const data = { input_data: true };
const comp_class = (await wick(`
import { input_data } from "@model";

export default <div>
<input type="checkbox" value=\${input_data}> 
</div>;`)).class;
const comp = new comp_class(data);


// Force component update by preempting spark's update
// cycle

assert_group(sequence, () => {

    // Ensure component is connected to DOM, otherwise
    // updates to model will have no effect
    comp.appendToDOM(document.body);

    await spark.sleep(1);

    data.input_data = true;

    await spark.sleep(1);

    assert("Model input on component initialization", browser, comp.ele.children[0].checked == true);

    await spark.sleep(1);

    data.input_data = false;

    await spark.sleep(200);

    assert(browser, comp.ele.children[0].checked == false);

    comp.ele.children[0].checked = true;

    comp.ele.children[0].dispatchEvent(new InputEvent("input"), comp.ele.children[0]);

    await spark.sleep(200);

    assert(browser, data.input_data == true);

});



