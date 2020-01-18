import compiler from "./compiler/component.js";
import stamp from "./stamp/stamp.js";

import wick_compile from "./compiler/wick.js";
import CompilerEnv from "./compiler/compiler_env.js";
import { Presets } from "./presets.js";
import whind from "@candlefw/whind";
import lite_tools from "./lite/tools.js";
const wick = compiler;

wick.stamp = stamp; //Compiles wick component into standalone components. 
wick.presets = d=>new Presets(d);
wick.astCompiler = function(string){
	return wick_compile(whind(string), CompilerEnv);
};
wick.lite = lite_tools;
wick.compiler_environment = CompilerEnv;
export default wick;


