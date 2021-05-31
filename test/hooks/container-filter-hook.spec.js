/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Static filter expression", () => {

    const comp = (await wick_server(`
     const A = "alpha";
     var B = "bravo";
     let C = "philbert";
     
     export default <container 
        data=\${[{name:"A"},{name:"B"},{name:"C"}]}
        filter=\${ m.name != "A" }
        >
         <div>\${name}</div>
     </container>
     `));

    const comp_instance = comp.createInstance();

    //assert(i, comp.class_string == "");

    assert(comp_instance.ele.childNodes.length == 2);
    assert(comp_instance.ele.childNodes[0].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[0].childNodes[0].childNodes[0].data.trim() == "B");
    assert(comp_instance.ele.childNodes[1].childNodes[0].tagName.trim() == "W-B");
    assert(comp_instance.ele.childNodes[1].childNodes[0].childNodes[0].data.trim() == "C");
});

// Function filter
// Filter function with non-static binding variables