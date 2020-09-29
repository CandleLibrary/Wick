/**[API]:testing 
    Test for two-way binding between a text input and a model data. 

    Reference Info:S
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
    https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/oninput
*/

import wick from "@candlefw/wick";
import spark from "@candlefw/spark";

// Bindings should be two-way on input elements [value] attribute 
// by default

const
    data = { input_data: "send" },
    comp = new (await wick(`
    import { input_data } from "@model";

    export default <div>
        <input type="text" value="\${input_data}"/>
    </div>`)).class(data);
const ele = comp.ele.children[0];


assert_group("Sever Side", sequence, () => {

    // Force component update by preempting spark's update
    // cycle

    assert(ele.value == "send");

    //HTML
    ele.value = "received";
    ele.runEvent("input", {});

    spark.update();

    assert(data.input_data == "received");
});

assert_group("Browser Side", sequence, () => {

    // Force component update by preempting spark's update

    await spark.sleep(10);

    assert(ele.value == "send");

    //HTML
    ele.value = "received";

    ele.dispatchEvent(new InputEvent('input', {
        view: window,
        bubbles: true,
        cancelable: true
    }));

    await spark.sleep(10);

    assert(data.input_data == "received", browser);
});



