/**[API]:testing 
 * 
    Create component with slots data
    
    Reference Info
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot
    https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element
*/

import wick from "@candlefw/wick";
import assert from "assert";
import { getInstanceHTML, getRenderedHTML } from "../../test-tools/tools.js";

assert_group("Basic", () => {
    await wick.server();

    const presets = wick.setPresets();

    assert(presets != undefined);

    assert_group("Single slot in an imported child module", sequence, () => {
        const comp = await wick(`
import slot from "./test/html/slots/data/slot.wick";

export default <div>
    <slot>
        <h1 slot="slot-A">Why Hello There</h1>
    </slot>
</div>
`, presets);

        assert(comp != undefined);
        const DOM = getInstanceHTML(comp, presets);
        assert(DOM.tag == "div");
        assert(DOM.children[0].tag == "slotdiv");
        assert(DOM.children[0].children[0].tag == "span");
        assert(DOM.children[0].children[0].children[0].tag == "h1");
    });

    assert_group("Slot found within a interleaved template component", sequence, () => {

        const comp = await wick(`
    import interleaved from "./test/html/slots/data/interleaved_comp.wick";
    
    export default <interleaved>
        <h1 slot="slot-A">Slottable A1</h1>
        <h1 slot="slot-A">Slottable A2</h1>
        <h1 slot="slot-B">Slottable B1</h1>
    </interleaved>
    `, presets);
        assert(comp != undefined);
        const DOM = getInstanceHTML(comp, presets);
        // assert(DOM.tag == "div");
        assert(DOM.children[0].tag == "a");
        assert(DOM.children[1].tag == "slotdiv");
        assert(DOM.children[1].children[0].tag == "span");
        assert(DOM.children[1].children[0].children[0].tag == "h1");
        assert(DOM.children[1].children[0].children[1].tag == "h1");
        assert(DOM.children[1].children[1].tag == "h1");
        assert(DOM.children[1].children[2].tag == "a");
        assert(DOM.children[1].children[2].children[0].tag == "slot");
    });


    assert_group("Un-slotted nodes are appended to the location of the first: interleaved", sequence, () => {

        const comp = await wick(`
    import default_slot from "./test/html/slots/data/slot.wick";
    
    export default <default_slot>
        <div>test</div>
        default text value
        <div>test</div>
    </default_slot>
    `, presets);
        assert(comp != undefined);

        const DOM = getInstanceHTML(comp, presets);
        const str = getRenderedHTML(comp, presets);
        assert(DOM.tag == "slotdiv");
        assert(DOM.children[2].children[0].tag == "div");
        assert(DOM.children[2].children[1].data == " default text value ");
        assert(str == "");
    });

});





