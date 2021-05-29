/**[API]:testing 
 * 
    
    
    Reference Info:
    https://developer.mozilla.org/en-US/docs/Web/CSS/@media
*/
/**
 * If binding are found within a textarea, then by default these will be rendered in the text ares
 * as-is. This behavior should instead reflect an intuitive understanding: the data a binding attaches to
 * should update the value attribute of the <textarea>. 
 */
import wick from "../../build/library/entry-point/wick-server.js";

wick.utils.enableTest();

const comp = (await wick(`
var style;

function onload() {
    styles = "Test Result Data"
};

export default <div>
    <textarea>\${styles}</textarea>
</div >;
`));

assert(i, await comp.getHTMLString() == "");