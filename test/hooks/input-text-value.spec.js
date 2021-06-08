/**
 * Filtered container models 
 */

import wick_server from "../../build/library/entry-point/wick-server.js";
import wick_browser from "@candlelib/wick";
import { TextInputValueHook } from "../../build/library/compiler/ast-build/hooks/input.js";


wick_server.utils.enableTest();

assert_group("Server - Basic text input value binding", () => {

    const comp = (await wick_server(`
     
    var temp = "Hello World";
     
     export default <div> 
        <input type="text" value=\${temp}>
        \${temp}
     </div>
     `));

    assert("Correct hook is created", comp.indirect_hooks.some(s => s.type == TextInputValueHook));

    const ele = await comp.getRootElement();

    assert("Prefill assigns boolean value to checked attribute", ele.children[0].getAttribute("value") == "Hello World");
});