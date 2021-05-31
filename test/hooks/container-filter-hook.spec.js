/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Static filter expression", () => {

    const comp = (await wick_server(`
     var R = 2;
     const A = R + 3;
     var B = "bravo";
     let C = "philbert";
     
     export default <container 
        data=\${[{name:"A"},{name:"B"},{name:A}]}
        filter=\${ m.name != "A" }
        >
         <div>\${name}</div>
     </container>
     `));

    //assert(i, comp.class_string == "");

    const comp_instance = comp.createInstance();

    assert(comp_instance.ele.childNodes.length == 2);
    assert(comp_instance.ele.childNodes[0].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[0].childNodes[0].childNodes[0].data.trim() == "B");
    assert(comp_instance.ele.childNodes[1].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[1].childNodes[0].childNodes[0].data.trim() == "5");
});

// Function filter
// Filter function with non-static binding variables