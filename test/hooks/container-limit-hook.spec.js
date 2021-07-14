/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Static limit value", () => {

    const comp = (await wick_server(`
     const A = "alpha";
     var B = "bravo";
     const C = "philbert";
     
     
     export default <container 
        data={[{name:"A"},{name:"B"},{name:C}]}
        limit={ 2 }
        >
         <div>{name}</div>
     </container>
     `));

    const comp_instance = comp.createInstance();

    // assert(i, comp.class_string == "");

    assert(comp_instance.ele.children.length == 2);
    assert(comp_instance.ele.childNodes[0].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[0].childNodes[0].childNodes[0].data.trim() == "A");
    assert(comp_instance.ele.childNodes[1].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[1].childNodes[0].childNodes[0].data.trim() == "B");
});

// Filter function with non-static binding variables


assert_group("Server - Static limit constant value", () => {

    const comp = (await wick_server(`
     const A = "alpha";
     var B = "bravo";
     const C = "philbert";
     const limit = 1;
     
     
     export default <container 
        data={[{name:"A"},{name:"B"},{name:C}]}
        limit={ limit }
        >
         <div>{name}</div>
     </container>
     `));

    const comp_instance = comp.createInstance();

    //assert(i, comp.class_string == "");
    //
    //assert(comp_instance.ele.toString() == "");

    assert(comp_instance.ele.children.length == 1);
});
