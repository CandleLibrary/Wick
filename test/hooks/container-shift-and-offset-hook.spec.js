/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Static shift and offset values", () => {

    const comp = (await wick_server(`
     const A = "alpha";
     var B = "bravo";
     const C = "philbert";
     
     export default <container 
        data=\${[{name:"A"},{name:"B"},{name:C}]}
        shift=\${ 2 }
        offset=\${ 1 }
        >
         <div>\${name}</div>
     </container>
     `));

    const comp_instance = comp.createInstance();

    //assert(i, comp.class_string == "");

    assert(comp_instance.ele.children.length == 1);
    assert(comp_instance.ele.childNodes[0].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[0].childNodes[0].childNodes[0].data.trim() == "philbert");
});

// Filter function with non-static binding variables