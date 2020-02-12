import compiler from "./compiler/component.js";

import wick_compile from "./compiler/wick_parser.js";

import CompilerEnv from "./compiler/compiler_environment.js";

import Presets from "./presets.js";

import whind from "@candlefw/whind";

import plugin from "./plugin/system.js";

import glow from "@candlefw/glow";

import URL from "@candlefw/url";

const wick = compiler;

wick.presets = d=>new Presets(d);

wick.astCompiler = (string) => wick_compile(whind(string), CompilerEnv);

wick.compiler_environment = CompilerEnv;

wick.plugin = plugin;

Presets.default_custom = {
	wick, glow, URL
};

export default wick;


