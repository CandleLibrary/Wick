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

import { addCLIConfig, getPackageJsonObject, getProcessArgs, processCLIConfig } from "@candlelib/paraffin";
import URL from "@candlelib/uri";


const
	{ package: pkg } = await getPackageJsonObject(new URL(import.meta.url).path),
	HELP_MESSAGE = `
CANDLELIB::Wick v${pkg.version}

Template Component Compiler

candle.cure <input-component> <output-directory>

[Options]

	-h | --help 		Show This Help Message


`;

const IS_FLAT = addCLIConfig("compile", { key: "flat", help_brief: `Output files to a flat directory structure` });
const output_directory = addCLIConfig("compile", { key: "output", help_brief: `Directory to output files`, REQUIRES_VALUE: true });

addCLIConfig("compile",
	{
		key: "compile",
		help_brief:
			`Statically compile a web application from a source directory.`
	}
).callback(
	async (args) => {

		//Find all components
		//Compile
		//Analyze component information
		//Extract dependency information and
		//wherever possible merge into output folder
		//Identify the root file. 
		console.log("hello world");


		return;
	}
);

processCLIConfig();