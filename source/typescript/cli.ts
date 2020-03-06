#!/usr/bin/env node
//@ts-nocheck
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
import wick from "./wick.node.mjs";

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
	.version("0.8.11")
	.parse(process.argv);

program
	.command("compile <wick_component_js_or_html>")
	.description(" Compiles a wick component into standalone HTML, CSS, and JS files that can independent of wick or with wick.lite")
	.option("-o, --output <path>", "Optional output location. Defaults to CWD.")
	.option("-s, --head <head>", "An optional file containing a <head> HTML template")
	.option("-s, --body <body>", "An optional file containing HTML content to append to the <body>")
	.option("-n, --name <output_name>", "The name to give to the output file. Defaults to index.html")
	.option("--place-root-in-body <maininbodyid>", "Append the root component HTML to the body instead of rendering from template.")
	.action(async (wick_component_js_or_html, cmd) => {
		const file = wick_component_js_or_html,
			dir = cmd.path ? path.resolve(cmd.path) : process.cwd(),
			name = cmd.output_name ? cmd.output_name : "index.html",
			maininbodyid = cmd.placeRootInBody || "";

		let
			head = cmd.head ? path.resolve(cmd.head) : "",
			body = cmd.body ? path.resolve(cmd.body) : "";

		if (head)
			try {
				head = await fsp.readFile(path.resolve(head), { encoding: "utf8" });
			} catch (e) {
				console.log(e);
			}

		if (body)
			try {
				body = await fsp.readFile(path.resolve(body), { encoding: "utf8" });
			} catch (e) {
				console.log(e);
			}

		//Stamp Component
		const root = await wick.stamp(wick(file)),
			options = {
				head,
				body,
				set_root_in_body: maininbodyid
			};
		await fsp.writeFile(path.join(dir, name), wick.lite.createSelfContainedPage(root, options), { encoding: "utf8", flags: "w+" });

		//Export stamp data
	});

(async () => {
	//Fill the window object with shims objects that match objects found on the browser 
	g.window = {
		getComputedStyle: () => ({ getPropertyValue: () => "0" }),
		console: {},
		Math: {},
		alert: () => { },
		document: {},
	};
	await html.polyfill();
	await URL.polyfill();
	program.parse(process.argv);
})();