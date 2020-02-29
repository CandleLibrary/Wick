import CompilerEnv from "./compiler/compiler_environment.js";

import wick_compile from "./compiler/parser.js";

import compiler from "./compiler/component.js";

import Presets from "./presets.js";

import plugin from "./plugin/system.js";

import whind from "@candlefw/whind";

import glow from "@candlefw/glow";

import URL from "@candlefw/url";

import { PresetOptions } from "./types/preset_options.js";

const wick = compiler;

wick.presets = (preset_opt: PresetOptions) => new Presets(preset_opt);

wick.astCompiler = (string) => wick_compile(whind(string), CompilerEnv);

wick.compiler_environment = CompilerEnv;

wick.plugin = plugin;

wick.objects = CompilerEnv.functions;

Presets.default_custom = {
	wick, glow, URL
};

export default wick;


