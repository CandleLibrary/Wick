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
import wick_server from "./wick-server.js";
import { getPackageJsonObject, getProcessArgs } from "@candlelib/paraffin";
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

const args = getProcessArgs({
	port: true,
	p: "port",
	"help": false,
	"h": "help",
	"?": "help"
});

if (args.help) {
	console.log(HELP_MESSAGE);
	process.exit(0);
}

console.log(args);

/**
 * Use Cases
 *
 * Testing
 *
 * Static Site Compiling
 */
