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
	processCLIConfig
} from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { default_radiate_hooks, default_wick_hooks, RenderPage } from '../compiler/ast-render/webpage.js';
import { ComponentData } from '../compiler/common/component.js';
import { Context } from "../compiler/common/context.js";
import { compile_module } from '../server/compile_module.js';
import { loadComponentsFromDirectory } from '../server/load_directory.js';


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
			const root_directory = URI.resolveRelative(input_path);
			const output_directory = URI.resolveRelative("./www/");
			//Compile a list of entry components
			const context = new Context();

			const { page_components, components } = await loadComponentsFromDirectory(
				root_directory, context);

			//Remap dependencies

			let USE_WICK_RUNTIME = false;
			let USE_RADIATE_RUNTIME = false;
			let USE_GLOW = false;

			for (const [component_name, { endpoints }] of page_components) {

				for (const endpoint of endpoints) {

					const { comp: component } = components.get(component_name);

					if (component.TEMPLATE) {

						let data = context.template_data.get(component);

						for (const template_data of data) {

							if (!template_data.page_name)
								component.root_frame.ast.pos.throw(
									"Expected [page_name] for template",
									component.location.toString()
								);

							context.active_template_data = template_data;

							const { USE_RADIATE_RUNTIME: A, USE_WICK_RUNTIME: B }
								= await buildComponentPage(component, context, template_data.page_name, output_directory);

							context.active_template_data = null;

							USE_RADIATE_RUNTIME ||= A;
							USE_WICK_RUNTIME ||= B;
						}
					} else {

						const { USE_RADIATE_RUNTIME: A, USE_WICK_RUNTIME: B }
							= await buildComponentPage(component, context, endpoint, output_directory);

						USE_RADIATE_RUNTIME ||= A;
						USE_WICK_RUNTIME ||= B;
					}
				}


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

async function buildComponentPage(
	component: ComponentData,
	context: Context,
	endpoint: string,
	output_directory: URI
) {
	const fsp = (await import("fs")).promises;

	let
		USE_RADIATE_RUNTIME: boolean = component.RADIATE,
		USE_WICK_RUNTIME: boolean = !component.RADIATE;

	const resolved_filepath = endpoint == "root"
		? output_directory
		: URI.resolveRelative(
			"./" + endpoint,
			output_directory + ""
		);

	await fsp.mkdir(resolved_filepath + "", { recursive: true });

	const hooks = Object.assign({}, USE_RADIATE_RUNTIME ? default_radiate_hooks : default_wick_hooks);

	if (USE_RADIATE_RUNTIME)
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

	const { page } = await RenderPage(
		component,
		context,
		undefined,
		hooks
	);

	await fsp.writeFile(resolved_filepath + "/index.html", page, { encoding: 'utf8' });

	return { USE_RADIATE_RUNTIME, USE_WICK_RUNTIME };
}
