/**[API]:testing 
 * 
    Create component with slots data
    
    Reference Info
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot
    https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element
*/

import wick from "../../..//build/library/entry-point/wick-server.js";
import assert from "assert";
import { getInstanceHTML, getRenderedHTML, createComponentInstance, assertTree } from "../../test-tools/tools.js";

assert_group("Basic", () => {

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
        const DOM = await getInstanceHTML(comp, presets);
        assert(DOM.tagName == "div");
        assert(DOM.children[0].tagName == "slotdiv");
        assert(DOM.children[0].children[0].tagName == "span");
        assert(DOM.children[0].children[0].children[0].tagName == "h1");
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
        const DOM = await getInstanceHTML(comp, presets);
        // assert(DOM.tag == "div");
        assert(DOM.children[0].tagName == "a");
        assert(DOM.children[1].tagName == "slotdiv");
        assert(DOM.children[1].children[0].tagName == "span");
        assert(DOM.children[1].children[0].children[0].tagName == "h1");
        assert(DOM.children[1].children[0].children[1].tagName == "h1");
        assert(DOM.children[1].children[1].tagName == "h1");
        assert(DOM.children[1].children[2].tagName == "a");
        assert(DOM.children[1].children[2].children[0].tagName == "slot");
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
        const DOM = await getInstanceHTML(comp, presets);
        const str = await getRenderedHTML(comp, presets);
        assert(DOM.tagName == "slotdiv");
        assert(DOM.children[2].children[0].tagName == "div");
        assert(DOM.children[2].children[1].data == " default text value ");
    });

});

assert_group("Runtime", () => {
    assert_group("Component bindings work with slotted elements", sequence, () => {

        const
            comp = await wick(`
    import default_slot from "./test/html/slots/data/slot.wick";

    var d = "test_ed";

    export default <default_slot>
        <div>!!!test!!!</div>
        default text value
        <div>test \${(d + "123") }</div>
    </default_slot>
    `),
            comp_instance = await createComponentInstance(comp);

        assertTree({
            t: "slotdiv",
            c: [{
                t: "span"
            }, , {
                t: "a",
                c: [
                    { t: "div", c: [{ d: "!!!test!!!" }] },
                    { d: "default text value" },
                    {
                        t: "div", c: [
                            { d: "test" },
                            { d: "test_ed123" }
                        ]
                    }
                ]
            }]
        }, comp_instance.ele);
    });
});


