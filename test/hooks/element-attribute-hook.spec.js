/**
 * Filtered container models 
 */

import wick_browser from "@candlelib/wick";

// Function filter
// Filter function with non-static binding variables
//*
assert_group("Browser - Basic generic attribute", browser, () => {

    const comp = (await wick_browser(`

        let count = 0;

        export default  <button count=\${count+1}/>;
    `));

    const instance = new comp.class();

    const ele = instance.ele;

    assert(ele.getAttribute("count") == "1");

});
//*/

assert_group("Browser - Basic style assignment", browser, () => {

    const comp = (await wick_browser(`

        let color = "red";

        export default  <button style=\${ \`color:\${color}\`  }/>;
    `));

    const instance = new comp.class();

    const ele = instance.ele;

    assert(ele.style.color == "red");

});