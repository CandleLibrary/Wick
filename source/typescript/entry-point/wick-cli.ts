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
import { RenderPage } from '../compiler/ast-render/webpage.js';
import wick from './wick-server.js';
import Presets from "../compiler/common/presets.js";


const
	{ package: pkg } = await getPackageJsonObject(new URI(import.meta.url).path),
	HELP_MESSAGE = `
CANDLELIB::Wick v${pkg.version}

Template Component Compiler

candle.cure <input-component> <output-directory>

[Options]

	-h | --help 		Show This Help Message


`;

const IS_FLAT = addCLIConfig("compile", { key: "flat", help_brief: `Output files to a flat directory structure` });
const output_directory = addCLIConfig("compile", { key: "output", help_brief: `Directory in which to output files`, REQUIRES_VALUE: true });

addCLIConfig("compile",
	{
		key: "compile",
		help_brief:
			`Statically compile a web application from a source directory.`
	}
).callback = (
		async (args) => {

			//Find all components
			//Build wick and radiate files 
			console.log("hello world");

			const fsp = (await import("fs")).default.promises;
			const page_components = new Map();
			const components = new Map();
			const root_directory = new URI(process.cwd());
			const output_directory = URI.resolveRelative("./www", root_directory + "/");
			const presets = new Presets();

			console.log({ presets });

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
			}
			)) {

				if (["html", "wick"].includes(file_uri.ext.toLowerCase())) {

					const id = file_uri + "";

					if (file_uri.filename == "index")
						page_components.set(file_uri.dir.slice((root_directory + "").length), id);

					components.set(id, await wick(file_uri));

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

			for (const [key, val] of page_components) {

				const component = components.get(val);

				const resolved_filepath = URI.resolveRelative("." + key, output_directory + '/');

				await fsp.mkdir(resolved_filepath + "", { recursive: true });

				const { page } = await RenderPage(component, presets);

				await fsp.writeFile(resolved_filepath + "/index.html", page, { encoding: 'utf8' });
			}


			return;
		}
	);

processCLIConfig();