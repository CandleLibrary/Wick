#!/usr/bin/env node

/* 
	The purpose of the wick command line interface is to provide a simple method to compile 
	wick components into standalone HTML, CSS, and JS files that can largely run without the 
	bulk of the wick library. 

	Certain objects, such as wick container elements, cannot work correctly without some specific wick
	code that is provided within the wick.lite module. For these elements, the command line will
	provide relevent information to ensure the user is aware of what to do once components have been
	compiled. 

	In the future, compilation targs such as Java will be provided to allow wick compononts to run in environemnts
	outside of a browser ecosystem. 
*/

//CandleFW stuffs
import URL from "@candlefw/url";
import html from "@candlefw/html";
import wick from "@candlefw/wick";

//Turn on NodeJS File Handling

URL.G = new URL(process.cwd() + "/");

//Third Party stuff
import * as commander from "commander";

//Node stuffs
import path from "path";
import fs from "fs";
import readline from "readline";
import util from "util";
import { fileURLToPath } from 'url';

const fsp = fs.promises;


/* ************* PROGRAM ************************/

const program = commander.default;

program
	.version("0.8.10")
	.parse(process.argv);

program
	.command("compile <wick_component_js_or_html>")
	.description(" Compiles a wick component into standalone HTML, CSS, and JS files that can largely run without the bulk of the wick library. ")
	.action(async (wick_component_js_or_html, cmd) => {
			const file = wick_component_js_or_html;

			//Load wick component
			const component = wick(file);

			//Stamp Component
			const root = await wick.stamp(component);

			await fsp.writeFile(path.join(process.cwd(), "test_index.html"), wick.lite.createSelfContainedPage(root), { encoding: "utf8", flags: "w+" });

			//Export stamp data
	});

(async () => {
	//Fill the window object with shims objects that match objects found on the browser 
	global.window = {
		getComputedStyle : ()=>({getPropertyValue:()=>"0"}),
		console: {},
		Math: {},
		document: {},
	};
	await html.polyfill();
	await URL.polyfill();
	program.parse(process.argv);
})();