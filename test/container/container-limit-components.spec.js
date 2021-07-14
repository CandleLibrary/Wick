/**[API]:testing 
    Container with element attribute shall change the default container 
    element to a tag type defined by the element attribute value.
*/

import wick from "@candlelib/wick";

const

    data = { data: [] },

    comp_data = (await wick(`
    import { data } from "@model";

    export default <div>
        <container element="div" data={ data }>  <a>{ name }</a> </container>
        <container element="ul" data={ data }>  <a>{ name }</a> </container>
        <container element="ol" data={ data }>  <a>{ name }</a> </container>
        <container element="a" data={ data }>  <a>{ name }</a> </container>
        <container data={ data }>  <a>{ name }</a> </container>
    </div>`)),
    comp = new comp_data.class(data),

    elements = comp.ele.children;

assert_group("Server run", sequence, () => {
    assert(elements.length == 5);
    assert(elements[0].tagName == "DIV");
    assert(elements[1].tagName == "UL");
    assert(elements[2].tagName == "OL");
    assert(elements[3].tagName == "A");
    assert(elements[4].tagName == "DIV");
});

assert_group("Browser run", sequence, browser, () => {
    assert(elements.length == 5);
    assert(elements[0].tagName == "DIV");
    assert(elements[1].tagName == "UL");
    assert(elements[2].tagName == "OL");
    assert(elements[3].tagName == "A");
    assert(elements[4].tagName == "DIV");
});



