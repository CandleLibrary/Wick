import wick from "../build/library/wick.js";
import spark from "@candlefw/spark";

//Bindings should be two-way on inputs

await wick.server()

const comp_data = await wick(`
    import { input_data } from "@model";

    default export <div>
        <input type="text" data=\${input_data}></input>
    </div>`);


const data = { input_data = "send" };
const comp = new comp_data.class();

// Force component update by prempting spark's update
// cycle

spark.update();

assert(comp_data.ele.children[0].data == "receive");

//HTML
comp_data.ele.children[0].data = "received"
comp_data.ele.children[0].runEvent("input", {})


spark.update();

assert(data.input_data == "receive");



