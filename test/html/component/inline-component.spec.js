/**
 * Component within components
 */

import wick_server from "../../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";


wick_server.utils.enableTest();

assert_group("Server - Parses and compiles inline components", sequence, () => {

    const comp = (await wick_server(`
     
     export default <div>
        <component>
            Hello World
        </component>
     </div>

     `));

    assert(comp == "");

    //assert(wick_server.rt.presets.components.size == 2);
    //assert(comp.local_component_names.size == 1);
    //
    //const name = comp.local_component_names.values().next().value;
    //const child_comp = wick_server.rt.presets.components.get(name);
    //const ele2 = await child_comp.getRootElement();
    //
    //assert(ele2.tag == "div");
    //assert(ele2.childNodes.length == 1);
    //assert(ele2.childNodes[0].data.trim() == "Hello World");
    //
    //const ele1 = await comp.getRootElement();
    //
    //assert(ele1.tag == "div");
    //assert(ele1.children.length == 1);
    //assert(ele1.children[0].getAttribute("class") == name);
});

// Filter function with non-static binding variables
