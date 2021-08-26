/**[API]:testing 
 * 
    Rules in media rule-sets should be scoped to component.
    
    Reference Info:
    https://developer.mozilla.org/en-US/docs/Web/CSS/@media
*/

import wick, { test } from "@candlelib/wick";
import assert from "assert";

test.reset();


const comp = (await wick(`<div> <style> @media screen { root { color:red; } .div { position:absolute }  } </style> </div>`));

assert(test.getCompiledCSSString(comp, "component_class_name") === "@media screen{.component_class_name{color:#ff0000}\n.component_class_name .div{position:absolute}}");





