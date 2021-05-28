/**[API]:testing 
    Container with a data attribute comprised of an expression should 
    perform that expression on load provided all binding references are
    defined.
*/

import spark from "@candlelib/spark";
import wick from "@candlelib/wick";

const

    data = { data: [] },


    comp_data = (await wick(`
    import { test } from "@api";

    export default <div>
        <container data=\${ test() }>  <a>\${ name }</a> </container>
        <container data=\${ test().filter(e=>(e.name==2)) }>  <a>\${ name }</a> </container>
    </div>`));


keep: wick.rt.presets.addAPIObject("test", () => [{ name: 1 }, { name: 2 }]);

assert(wick.rt.presets.api.test != undefined);
assert(wick.rt.presets.api.test.default != undefined);

assert_group("Server run", 5000, sequence, () => {

    const
        comp = new comp_data.class(data),
        elements = comp.ele.children;
    await spark.sleep(20);
    assert(elements.length == 2);
    assert(elements[0].children.length == 2);
    assert(elements[1].children.length == 1);
});

assert_group("Browser run", sequence, browser, () => {
    const

        comp = new comp_data.class(data),
        elements = comp.ele.children;
    await spark.sleep(20);
    assert(elements.length == 2);
    assert(elements[0].children.length == 2);
    assert(elements[1].children.length == 1);
});



