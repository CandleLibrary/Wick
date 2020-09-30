/**[API]:testing 
    Container with attribute element="null" shall not produce a containing
    element for sub-components, but rather insert sub-component elements directly
    into the parent component element tree. 
*/

import wick from "@candlefw/wick";
import spark from "@candlefw/spark";

const
    data = { data: [{ name: "1" }, { name: "2" }, { name: "3" }] },
    comp_data = (await wick(`
    import { data } from "@model";

    export default <div>
        <container element=null data=\${ data }>
            <a>\${ name }</a>
        </container>
        <container data=\${ data }>
            <a>\${ name }</a>
        </container>
    </div>`)),
    comp = new comp_data.class(data),
    elements = comp.ele.children;




assert_group("Browser run", sequence, browser, () => {
    // Force the component connection to enable 
    // update on model changes.
    keep: comp.CONNECTED = true;
    await spark.sleep(50);
    

    // first set of container children should appear within the root
    // element. 
    assert(elements.length == 4);
    assert(elements[0].tagName == "A");
    assert(elements[0].innerHTML == "1");
    assert(elements[1].tagName == "A");
    assert(elements[1].innerHTML == "2");
    assert(elements[2].tagName == "A");
    assert(elements[2].innerHTML == "3");

    // second set should appear within the container's default
    // div element
    assert(elements[3].tagName == "DIV");

    assert(elements[3].children[0].tagName == "A");
    assert(elements[3].children[0].innerHTML == "1");
    assert(elements[3].children[1].tagName == "A");
    assert(elements[3].children[1].innerHTML == "2");
    assert(elements[3].children[2].tagName == "A");
    assert(elements[3].children[2].innerHTML == "3");

    //Clearing the elements should leave the default null element place holder 
    keep: data.data = [];

    //Overcome the default model polling interval of 1000/30 ms
    await spark.sleep(50);

    assert(elements.length == 2);
    assert(elements[0].tagName == "NULL");
    assert(elements[1].tagName == "DIV");

    keep: data.data = [{ name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }, { name: 5 }];

    await spark.sleep(50);

    assert(elements.length == 6);

    keep: data.data = [];

    await spark.sleep(50);

    assert(elements.length == 2);
    assert(elements[0].tagName == "NULL");
    assert(elements[1].tagName == "DIV");
});