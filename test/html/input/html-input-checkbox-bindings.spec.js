/**[API]:testing 
    Test for two-way binding between a checkbox input and a model data. 

    Reference Info:S
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
    https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick
*/

import wick from "@candlefw/wick";
import spark from "@candlefw/spark";

// Bindings should be two-way on input elements [value] attribute 
// by default

const data = { input_data: true };
const comp = new (await wick(`
import { input_data } from "@model";

export default <div>
<input type="checkbox" value=\${input_data} checked=\${input_data}> 
</div>;`)).class(data);



// Force component update by preempting spark's update
// cycle

assert_group(sequence, () => {

    await spark.sleep(1);

    data.input_data.checked = true;

    await spark.sleep(1);

    assert(comp.ele.children[0].checked == true, browser);

    await spark.sleep(1);

    data.input_data.checked = false;

    assert(data.input_data == false, browser);
});



