/**[API]:testing 
 * 
    
    
    Reference Info:
    https://developer.mozilla.org/en-US/docs/Web/CSS/@media
*/

import wick from "../../build/library/entry-point/wick-server.js";

wick.utils.enableTest();

const comp = (await wick(`

import {m1} from "@model"

var b = 0;

export default <div>
    <container data=\${test} filter=\${ m.test == 2 + b - c }>
        <div ></div>
    </div>
</container>`));

assert(comp.class_string == "");