/**[API]:testing 
 * 
    Inserting simple non-binding content into a slot
    
    Reference Info
    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot
    https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element
*/

import wick from "build/library/wick.js";

// Bindings should be two-way on input elements [value] attribute 
// by default

await wick.server()

const comp = (await wick(`
    import sloted from "./data/slot.wick";

    default export <div>
        <sloted>
            <h1 slot="slot-A">Why Hello There</h1>
        </sloted>
    </div>`)).class();

asserts(comp.ele.children[0].tag == "div");
asserts(comp.ele.children[0].children[0].tag == "span");
asserts(comp.ele.children[0].children[0].children[0].tag == "h1");
asserts(comp.ele.children[0].children[0].children[0].innerText == "Why Hello There");





