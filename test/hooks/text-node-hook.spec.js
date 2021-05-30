/**
 * Runtime component update text node data value when hooked binding variable
 * values change
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Internal Variable", () => {

    const comp = (await wick_server(`
    
    var b = "test";
    
    export default <div>\${b}</div>
    `));

    const comp_instance = comp.createInstance();

    await comp_instance.sleep();

    assert(comp_instance.ele.childNodes[0].type == 1);
    assert(comp_instance.ele.childNodes[0].data == "test");
});


assert_group("Server - Internal Variable - Prefill", () => {

    const comp = (await wick_server(`
    
    var b = "test";
    
    export default <div>\${b}</div>
    `));

    const comp_instance = comp.createInstance();
    assert(comp_instance.ele.childNodes[0].data.trim() == "test");
});

/*
assert_group("Browser - Internal Variable", browser, () => {

    const comp = (await wick_browser(`

    var b = 0;

    export default <div>\${b}</div>
    `));

    const comp_instance = comp.createInstance();
    await comp_instance.sleep();
    assert(comp_instance.ele.childNodes[0] instanceof  TextNode);
    assert(comp_instance.ele.childNodes[0].data == "0");

});
*/