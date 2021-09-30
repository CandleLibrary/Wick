#!/usr/bin/env node
/**
 * Copyright (C) 2021 Anthony Weathersby - Wick Component Compiler
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * Contact: acweathersby.codes@gmail.com
 */

/* 
	The purpose of the wick command line interface is to provide a simple method to compile 
	wick components into standalone HTML, CSS, and JS files that can largely run without the 
	bulk of the Wick library. 

	Certain objects, such as wick container elements, cannot work correctly without some specific wick
	code that is provided within the wick-runtime module. For these elements, the command line will
	provide relevant information to ensure the user is aware of what to do once components have been
	compiled. 
*/

import {
	addCLIConfig,
	getPackageJsonObject,
	processCLIConfig,
	traverseFilesFromRoot
} from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { default_radiate_hooks, default_wick_hooks, RenderPage } from '../compiler/ast-render/webpage.js';
import Presets from "../compiler/common/presets.js";
import { compile_module } from './compile_module.js';
import { ComponentData } from './wick-full.js';
import wick from './wick-server.js';

URI.server();

const
	{ package: pkg, package_dir } = await getPackageJsonObject(new URI(import.meta.url).path),
	HELP_MESSAGE = `
CANDLELIB::Wick v${pkg.version}

Wick Static Component Compiler

candle.wick <input-component> <output-directory>

[Options]

	-h | --help 		Show This Help Message


`;

const IS_FLAT = addCLIConfig("compile", { key: "flat", help_brief: `Output files to a flat directory structure` });

const output_directory = addCLIConfig("compile", { key: "output", help_brief: `Directory in which to output files`, REQUIRES_VALUE: true });

const USE_RADIATE = addCLIConfig("compile",
	{
		key: "use_radiate",
		help_brief:
			`
Use radiate client-side router to handle multi-page sites. 
This causes the compiler to treat every "index.wick" as a separate
page and will output a single-page component for each "index.wick"
entry point. 

Without this option wick will only compile the input component or 
the index.wick of the input directory.
`
	}
);

addCLIConfig("compile",
	{
		key: "compile",
		help_brief:
			`
Statically compile a web application from a source directory.

Wick will automatically handle the compilation & packaging of 
components and will render out a static site that can be 
optionally hydrated with the associated support scripts.

`
	}
).callback = (
		async (args) => {

			//Find all components
			//Build wick and radiate files 
			const input_path = args.trailing_arguments.pop();
			const fsp = (await import("fs")).default.promises;
			const page_components = new Map();
			const components: Map<string, { output_name: string, comp: ComponentData; }> = new Map();
			const root_directory = URI.resolveRelative(input_path);
			const output_directory = URI.resolveRelative("./www/");
			const presets = new Presets();
			const RADIATE = !!USE_RADIATE.value;

			//Compile a list of entry components

			function IsEntryComponent(uri: URI): {
				IS_ENTRY_COMPONENT: boolean;
				output_name?: string;
			} {
				if (uri.filename.slice(0, 5) == "page_") {
					return {
						IS_ENTRY_COMPONENT: true,
						output_name: uri.filename.slice(5)
					};

				}

				return {
					IS_ENTRY_COMPONENT: false
				};
			}

			//Find all wick and html files and compile them into components. 
			for await (const file_uri of traverseFilesFromRoot(
				root_directory, {
				directory_evaluator_function: (uri) => {

					const dir_name = uri.path.split("/").pop();

					//Skip linux "hidden" directories
					if (dir_name[0] == ".")
						return false;

					//Skip package repo folders
					if (dir_name == "node_modules")
						return false;

					return true;
				}
			})) {

				if (["html", "wick"].includes(file_uri.ext.toLowerCase())) {

					const id = file_uri + "";

					const { IS_ENTRY_COMPONENT, output_name } = IsEntryComponent(file_uri);

					if (IS_ENTRY_COMPONENT) {

						page_components.set(output_name, id);

						try {

							const comp = <any>await wick(file_uri, presets);

							components.set(output_name, { output_name, comp });

						} catch (e) {
							console.error(e);
							console.log(id);
							return false;
						}
					}
				} else if ([
					"jpg", "jpeg", "png", "webp", "svg",
					"tiff", "ico", "gif", "avif", "bmp",
				].includes(file_uri.ext.toLowerCase())) {
					console.log(file_uri + "");
				} else if ([
					"css", "js",
				].includes(file_uri.ext.toLowerCase())) {
					console.log(file_uri + "");
				}
			};

			//Remap dependencies

			let USE_WICK_RUNTIME = false;
			let USE_RADIATE_RUNTIME = false;
			let USE_GLOW = false;

			for (const [key, val] of page_components) {

				const { comp: component, output_name } = components.get(key);

				const RADIATE = component.RADIATE;

				if (RADIATE)
					USE_RADIATE_RUNTIME = true;
				else
					USE_WICK_RUNTIME = true;

				const resolved_filepath = URI.resolveRelative(
					"./" + output_name,
					output_directory + ""
				);

				await fsp.mkdir(resolved_filepath + "", { recursive: true });

				const hooks = Object.assign({}, RADIATE ? default_radiate_hooks : default_wick_hooks);

				if (RADIATE)
					hooks.init_script_render = function () {
						return `
				import init_router from "/radiate.js";

				init_router();`;
					};
				else
					hooks.init_script_render = function () {
						return `
			import w from "/wick.js";
		
			w.hydrate();`;
					};

				const { page } = await RenderPage(component, component.presets, hooks);

				await fsp.writeFile(resolved_filepath + "/index.html", page, { encoding: 'utf8' });
			}

			if (USE_RADIATE_RUNTIME) {
				USE_GLOW = true;
				compile_module(
					URI.resolveRelative(
						"./build/library/entry-point/wick-radiate.js",
						package_dir
					) + "",
					output_directory + "radiate.js",
					package_dir
				);
			}

			if (USE_WICK_RUNTIME)
				compile_module(
					URI.resolveRelative(
						"./build/library/entry-point/wick-runtime.js",
						package_dir
					) + "",
					output_directory + "wick.js",
					package_dir
				);
			/* 
			if(USE_GLOW)
				compile_module(
					URI.resolveRelative("./build/library/entry-point/wick-glow.js",
						package_dir
					) + "",
					output_directory + "glow.js",
					package_dir
				);
			//*/

			return;
		}
	);

processCLIConfig();