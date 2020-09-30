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
        <container element=div data=\${ data }>
            <a>\${ name }</a>
        </container>
        <container
            data=\${ data }>
            <a>\${ name }</a>
        </container>
    </div>`));

console.log(comp_data.class_string);

const
    comp = new comp_data.class(data),
    elements = comp.ele.children;



assert_group("Browser run", sequence, () => {


    // first set of container children should appear within the root
    // element. 
    assert(elements.length == 4);
    assert(elements[0].tagName == "A");
    assert(elements[0].innerHTML == "1");
    assert(elements[1].tagName == "A");
    assert(elements[1].innerHTML == "2");
    assert(elements[2].tagName == "A");
    assert(elements[2].innerHTML == "3");

    //second set should appear within the container's default
    // div element
    assert(elements[3].tagName == "DIV");

    assert(elements[3].children[0].tagName == "A");
    assert(elements[3].children[0].innerHTML == "1");
    assert(elements[3].children[1].tagName == "A");
    assert(elements[3].children[1].innerHTML == "2");
    assert(elements[3].children[2].tagName == "A");
    assert(elements[3].children[2].innerHTML == "3");

    //Clearing the elements should leave the default div 
    data.data = [];

    await spark.sleep(10);

    assert(elements.length == 2);
    assert(elements[1].tagName == "NULL");
    assert(elements[1].tagName == "DIV");
});



