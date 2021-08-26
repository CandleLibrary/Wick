/**
 * Runtime component update text node data value when hooked binding variable
 * values change
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";

assert_group("Server - Internal Variable", sequence, () => {

    wick_server.utils.enableTest();

    const comp = (await wick_server(`
    
    var b = "test";
    
    export default <div>{b}</div>
    `));

    const comp_instance = comp.createInstance();

    await comp_instance.sleep();

    assert(comp_instance.ele.childNodes[0].type == 1);
    assert(comp_instance.ele.childNodes[0].data.trim() == "test");
});


assert_group("Server - Internal Variable - Prefill", () => {

    wick_server.utils.enableTest();

    const comp = (await wick_server(`
    
    var b = "test";
    
    export default <div>{b}</div>
    `));

    const ele = await comp.getRootElement();

    assert(ele.childNodes[0].childNodes[0].data.trim() == "test");
});


assert_group("Browser - Internal Variable", browser, () => {

    const comp = (await wick_browser(`

    var b = "test";

    export default <div>{b}</div>
    `));

    const comp_instance = comp.createInstance();

    assert(comp_instance.ele.innerText.trim() == "test");

});
