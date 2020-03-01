import wick from "./wick.js";
import lite from "../old/stamp/stamp/lite/tools.js.js.js.js.js";
import stamp from "../old/stamp/stamp/stamp.js.js.js.js.js";
import component from "../old/stamp/compiler/component_prototype.js.js.js";
wick.lite = lite;
wick.stamp = stamp; //Compiles wick component into standalone components. 
wick.component_prototype = component.prototype;
export default wick;
