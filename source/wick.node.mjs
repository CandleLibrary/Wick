import wick from "./wick.js";

import lite from "./lite/tools.js";

import stamp from "./stamp/stamp.js";

import component from "./compiler/component_prototype.js";

wick.lite = lite;

wick.stamp = stamp; //Compiles wick component into standalone components. 

wick.component_prototype = component.prototype;

export default wick;