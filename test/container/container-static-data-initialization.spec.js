/**[API]:testing 
    Container with a data attribute comprised of an expression shall 
    perform that expression on component load provided all binding references 
    are defined.
*/

import wick from "@candlefw/wick";
import spark from "@candlefw/spark";

const

    data = { data: [] },

    comp_data = (await wick(`
    import { test } from "@api";

    export default <div>
        <container data=\${ test() }>  <a>\${ name }</a> </container>
        <container data=\${ test().filter(e=>e.name==2) }>  <a>\${ name }</a> </container>
    </div>`));

keep: wick.rt.presets.api.test = () => [{ name: 1 }, { name: 2 }];

const

    comp = new comp_data.class(data),

    elements = comp.ele.children;

spark.sleep(20);

assert_group("Server run", sequence, () => {
    assert(elements.length == 2);
    assert(elements[0].children.length == 2);
    assert(elements[1].children.length == 1);
});

assert_group("Browser run", sequence, browser, () => {
    assert(elements.length == 2);
    assert(elements[0].children.length == 2);
    assert(elements[1].children.length == 1);
});



