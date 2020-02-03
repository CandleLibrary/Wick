import compiler from "./compiler/component.js";

import wick_compile from "./compiler/wick.js";

import CompilerEnv from "./compiler/compiler_env.js";

import Presets from "./presets.js";

import whind from "@candlefw/whind";

const wick = compiler;

wick.presets = d=>new Presets(d);

wick.astCompiler = (string) => wick_compile(whind(string), CompilerEnv);

wick.compiler_environment = CompilerEnv;

export default wick;


