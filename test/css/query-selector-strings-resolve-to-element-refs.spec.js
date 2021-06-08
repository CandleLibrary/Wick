/**[API]:testing 
 * 
    Rules in media rule-sets should be scoped to component.
    
    Reference Info:
    https://developer.mozilla.org/en-US/docs/Web/CSS/@media
*/

import wick from "../../build/library/entry-point/wick-server.js";
import assert from "assert";

wick.utils.enableTest();

const comp = (await wick(`

var ctx = "@canvas".getContext2D();

function onload(){
    var t =ctx;
}

export default <div id="main" class="main">
    <canvas id="canvas" width=50 height=50 />
</div >`));

//assert(comp.class_string == "");




