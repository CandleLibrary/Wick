import spark from "@candlelib/spark";
import wick from "../../../build/library/entry-point/wick-server.js";
import { assertTree } from "../../test-tools/tools.js";

const comp = await wick("./test/runtime/dynamic/data/root.wick");

assert_group("Interleaved Component", sequence, () => {

    const comp_instance = new comp.class_with_integrated_css;

    comp_instance.update();

    spark.update();

    assertTree(
        {
            t: "div", c: [{
                d: "test1"
            }, {
                t: "div",
                c: [{ d: "hello world" }]
            },
            { t: "div", c: [{ d: "root" }, { d: "testing" }] }]
        },
        comp_instance.ele
    );
});