import spark from "@candlelib/spark";
import wick from "@candlelib/wick";
import { assert } from "console";

const source = `
 var count = 0;
 
 export default <button onclick={++count}>Clicked {count}{count == 1 ? " time" : " times"}</button>
 `;

assert_group("Clicker component updates button's innerHTML - Browser", browser, sequence, () => {

    wick.utils.enableTest();

    const model = { limit: 1 };

    const comp = await(await wick(source)).mount(model, document.body);

    await spark.sleep(20);

    assert(comp.ele.innerHTML == "Clicked 0 times");

    await comp.dispatchEvent("root", "click");

    assert(comp.ele.innerHTML == "Clicked 1 time");

    await comp.dispatchEvent("root", "click");

    assert(comp.ele.innerHTML == "Clicked 2 times");

    await comp.dispatchEvent("root", "click");
    await comp.dispatchEvent("root", "click");
    await comp.dispatchEvent("root", "click");
    await comp.dispatchEvent("root", "click");
    await comp.dispatchEvent("root", "click");
    await comp.dispatchEvent("root", "click");
    await comp.dispatchEvent("root", "click");

    assert(comp.ele.innerText == "Clicked 9 times");
});