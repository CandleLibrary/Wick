/**[API]:testing 
    
*/

import wick_server from "../../build/library/entry-point/wick-server.js";

wick_server.utils.enableTest();

assert_group("Single simple root container element pre-fill with trivial models", sequence, () => {
    const comp = (await wick_server(`
    
    var data = [{v:1},{v:2},{v:3},{v:4},{v:5},{v:6}];

    export default  <container element="div" data=\${ data }>  <a>\${ v }</a> </container>`));

    //Extracting an HTML tree structure from the component's template string
    const root_ele = await comp.getRootElement();

    assert(root_ele.children.length == 6);
    assert(root_ele.children[0].tagName == "A");
    assert(root_ele.children[0].firstChild.tagName == "W-B");
    assert(root_ele.children[0].firstChild.firstChild.data.trim() == "1");
    assert(root_ele.children[1].firstChild.firstChild.data.trim() == "2");
    assert(root_ele.children[2].firstChild.firstChild.data.trim() == "3");
    assert(root_ele.children[3].firstChild.firstChild.data.trim() == "4");
    assert(root_ele.children[4].firstChild.firstChild.data.trim() == "5");
    assert(root_ele.children[5].firstChild.firstChild.data.trim() == "6");
});

