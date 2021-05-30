/**
 * Runtime component update text node data value when hooked binding variable
 * values change
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Directly Assigned Static Iterable", () => {

    const comp = (await wick_server(`
     const A = "alpha";
     var B = "bravo";
     let C = "philbert";
     
     export default <container data=\${[{name:A},{name:B},{name:C}]}>
         <div>\${name}</div>
     </container>
     `));

    const comp_instance = comp.createInstance();

    assert(comp_instance.ele.childNodes.length == 3);
    assert(comp_instance.ele.childNodes[0].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[0].childNodes[0].childNodes[0].data.trim() == "alpha");
    assert(comp_instance.ele.childNodes[1].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[1].childNodes[0].childNodes[0].data.trim() == "bravo");
    assert(comp_instance.ele.childNodes[2].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[2].childNodes[0].childNodes[0].data.trim() == "philbert");
});


// Data statically unresolvable is assigned within dynamic component

assert_group("Server - Directly Assigned Dynamic Iterable", () => {

    const comp = (await wick_server(`
     import { test } from "@api"
 
     var A = test;
     var B = "bravo";
     var C = "philbert";
     
     export default <container data=\${[{name:A},{name:B},{name:C}]}>
         <div>\${name}</div>
     </container>
     `));

    //Insert Required API value before instantiating components
    wick_server.rt.addAPI({ test: "alpha" });

    //assert(comp.class_string == "");

    const comp_instance = comp.createInstance();

    await comp_instance.sleep();

    assert(comp_instance.ele.childNodes.length == 3);
    assert(comp_instance.ele.childNodes[0].childNodes[0].data.trim() == "alpha");
    assert(comp_instance.ele.childNodes[1].childNodes[0].data.trim() == "bravo");
    assert(comp_instance.ele.childNodes[2].childNodes[0].data.trim() == "philbert");
});


assert_group("Server - Directly Assigned Dynamic Iterable With Const", () => {

    const comp = (await wick_server(`
     import { test } from "@api"
 
     const A = test;
     const B = "bravo";
     const C = "philbert";
     
     export default <container data=\${[{name:A},{name:B},{name:C}]}>
         <div>\${name}</div>
     </container>
     `));

    //Insert Required API value before instantiating components
    wick_server.rt.addAPI({ test: "alpha" });

    assert(i, comp.class_string == "");

    const comp_instance = comp.createInstance();

    await comp_instance.sleep();

    assert(comp_instance.ele.childNodes.length == 3);
    assert(comp_instance.ele.childNodes[0].childNodes[0].data.trim() == "alpha");
    assert(comp_instance.ele.childNodes[1].childNodes[0].data.trim() == "bravo");
    assert(comp_instance.ele.childNodes[2].childNodes[0].data.trim() == "philbert");
});

 // Awaitable data assignment should show up in async_init.

 // Fully constant data should not produce class code. 



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