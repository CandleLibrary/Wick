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

import { bidirectionalTraverse, traverse, TraverseState } from '@candlelib/conflagrate';
import {
	addCLIConfig,
	getPackageJsonObject,
	processCLIConfig,
	traverseFilesFromRoot
} from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { ext, JSExportDeclaration, JSImportClause, JSNodeClass, JSNodeTypeLU, JSStatementClass } from '@candlelib/js';
import { JSNodeType } from 'build/types/entry-point/wick-full.js';
import { default_wick_hooks, RenderPage } from '../compiler/ast-render/webpage.js';
import Presets from "../compiler/common/presets.js";
import { parse_component, parse_js_exp, parse_js_stmt } from '../compiler/source-code-parse/parse.js';
import wick from './wick-server.js';
import { renderNew } from '../compiler/source-code-render/render.js';
import { Node } from '../types/wick_ast.js';

URI.server();

const
	{ package: pkg, package_dir } = await getPackageJsonObject(new URI(import.meta.url).path),
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
		key: "with-radiate",
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
			const components = new Map();
			const root_directory = URI.resolveRelative(input_path);
			const output_directory = URI.resolveRelative("./www/");
			const presets = new Presets();

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

					try {

						const comp = await wick(file_uri);

						components.set(id, comp);

					} catch (e) {
						console.error(e);

						console.log(id);

						return false;
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

			const hooks = Object.assign({}, default_wick_hooks);

			hooks.init_script_render = function (component_class_declarations, presets) {
				return `
				import w from "/wick-rt.js";
			
				w.hydrate();
			`;
			};

			for (const [key, val] of page_components) {

				const component = components.get(val);

				const resolved_filepath = URI.resolveRelative("./" + key, output_directory + "");

				await fsp.mkdir(resolved_filepath + "", { recursive: true });

				const { page } = await RenderPage(component, presets, hooks);

				await fsp.writeFile(resolved_filepath + "/index.html", page, { encoding: 'utf8' });

			}

			const root = URI.resolveRelative("./build/library/entry-point/wick-runtime.js", package_dir) + "";

			//Include wick runtime library
			const dependencies = new Set([root]);

			const modules = new Map;

			for (const module_path of dependencies) {

				const entry = await fsp.readFile(module_path, { encoding: "utf8" });

				const { ast: module, error } = parse_component(entry);

				const mod_dependencies = [];

				const imported_refs = new Map();

				const export_refs = new Map();

				const module_data = {
					module,
					dependencies: mod_dependencies,
					imported_refs,
					export_refs
				};

				modules.set(module_path, module_data);

				if (error) {
					console.error(error);
				} else {
					let i = 0;

					let mod_name = new URI(module_path).filename.replace(/-/g, "_");

					let remap_list = "ABCDEFGHIGKLMNOP";

					for (const { node, meta: { mutate } } of traverse(<Node>module, "nodes")
						.filter("type", JSNodeType.ImportDeclaration, JSNodeType.ExportDeclaration)
						.makeMutable()
					) {

						if (node.type == JSNodeType.ImportDeclaration) {

							const module_ref = node.nodes.length > 1 ? node.nodes[1].nodes[0] : node.nodes[0].nodes[0];

							const relative_file_path = module_ref.value;

							let uri = null;

							if (relative_file_path[0] == "@") {

								uri = URI.resolveRelative(new URI(relative_file_path), package_dir);

								const { package: pkg, FOUND } = await getPackageJsonObject(uri + "/");

								const main = ([".", "/"].includes(pkg.main[0])) ? pkg.main : "./" + pkg.main;

								uri = URI.resolveRelative(main, uri + "/");

							} else {

								uri = URI.resolveRelative(relative_file_path, module_path);
							}

							dependencies.add(uri + "");

							mod_dependencies.push({ name: uri + "", specs: node.nodes[0] });

							module_ref.value = uri + "";

							if (node.nodes.length > 1) {

								const import_clause: JSImportClause = <any>node.nodes[0];

								for (const import_node of import_clause.nodes) {
									switch (import_node.type) {
										case JSNodeType.IdentifierDefault:
											let local_ref = import_node.value;
											imported_refs.set(local_ref, { uri: uri + "", mod_ref: "__default__" });
											break;
										case JSNodeType.NameSpaceImport:
											break;
										case JSNodeType.NamedImports:
											for (const specifier of import_node.nodes) {
												const mod_ref = specifier.nodes[0].value;
												let local_ref = specifier.nodes[0].value;
												if (specifier.nodes.length > 1)
													local_ref = specifier.nodes[1].value;
												imported_refs.set(local_ref, { uri: uri + "", mod_ref });

											}
											break;
									}
								}
							}

							mutate(null);

						} else {

							if (root == module_path) continue;

							const exp: JSExportDeclaration = <JSExportDeclaration>node;

							const [target] = exp.nodes;

							if (exp.DEFAULT) {
								const rename = mod_name + "_default";
								switch (target.type) {
									case JSNodeType.ClassDeclaration:
									case JSNodeType.FunctionDeclaration:
										//rename class functions to module names 

										if (!target.nodes[0])
											target.nodes[0] = parse_js_exp(rename);
										else {
											const name = target.nodes[0].value;

											const new_node = <JSStatementClass>parse_js_stmt(`var ${rename} = ${name};`);
											//@ts-ignore
											module.nodes.push(new_node);
										}

										mutate(target);

										export_refs.set("__default__", rename);

										break;

									default:
										const stmt = parse_js_stmt(`var ${mod_name + "_default"} = 0;`);

										stmt.nodes[0].nodes[1] = target;

										export_refs.set("__default__", rename);

										mutate(stmt);

										break;
								}
							} else {
								switch (target.type) {
									case JSNodeType.ClassDeclaration:
									case JSNodeType.FunctionDeclaration:
										//rename class functions to module names 
										const name = target.nodes[0].value;
										const rename = mod_name + remap_list[i++];
										//target.nodes[0].value = rename;
										export_refs.set(name, rename);
										const new_node = <JSStatementClass>parse_js_stmt(`var ${rename} = ${name};`);
										//@ts-ignore
										module.nodes.push(new_node);
										mutate(target);
										break;
									case JSNodeType.VariableStatement:
									case JSNodeType.LexicalDeclaration:

										for (const { node } of traverse(target, "nodes").filter("type", JSNodeType.IdentifierBinding)
										) {

											const name = node.value;
											const rename = mod_name + remap_list[i++];
											const new_node = <JSStatementClass>parse_js_stmt(`var ${rename} = ${name};`);
											export_refs.set(name, rename);
											//@ts-ignore
											module.nodes.push(new_node);
										}

										mutate(target);
										break;
									case JSNodeType.ExportClause:

										for (const specifier of target.nodes) {
											const name = specifier.nodes[0].value;
											const extern_name = specifier.nodes[1]?.value ?? name;
											const rename = mod_name + remap_list[i++];
											const node = <JSStatementClass>parse_js_stmt(`var ${rename} = ${name};`);
											module.nodes.push(node);
											export_refs.set(extern_name, rename);;
										}

										mutate(null);
								}
							}
						}
					}
				}
			}

			let pending_modules = new Map([...modules].map(([string, value]) => [string, value.dependencies.map(i => i.name)]));

			let sorted_module = [];
			while (sorted_module.length < modules.size) {

				let last_name = "", smallest = Infinity;

				//Sort modules
				for (const [name, dependencies] of pending_modules) {
					if (dependencies.length == 0) {

						last_name = name;
						break;
					} else {
						if (dependencies.length < smallest) {
							//A link a dependency cycle
							smallest = dependencies.length;
							last_name = name;
						}
					}
				}

				if (last_name) {
					sorted_module.push(last_name);
					pending_modules.delete(last_name);

					for (const [name, dependencies] of pending_modules) {

						const index = dependencies.indexOf(last_name);

						if (index >= 0)
							dependencies.splice(index, 1);
					}
				} else {
					throw new Error("Can't resolve modules");
				}
			}
			//move entry into the last position
			const entry_index = sorted_module.indexOf(root);

			sorted_module.push(...sorted_module.splice(entry_index, 1));

			const output = [];
			//Setup unique module names
			for (const module_path of sorted_module) {
				const { module, imported_refs } = modules.get(module_path);
				const stack = { refs: new Set, prev: null };
				for (const { node, meta: { traverse_state } } of bidirectionalTraverse(<Node>module, "nodes").filter("type",
					JSNodeType.FunctionDeclaration,
					JSNodeType.FunctionExpression,
					JSNodeType.ArrowFunction,
					JSNodeType.IdentifierReference,
					JSNodeType.IdentifierBinding,
					JSNodeType.ExportDeclaration
				)) {
					if (traverse_state == TraverseState.ENTER) {
						if (node.type == JSNodeType.ExportDeclaration) {
							if (!node.DEFAULT) {

								if (node.nodes[0]?.type == JSNodeType.ExportClause) {
									for (const specifier of node.nodes[0].nodes) {
										const name = specifier.nodes[0].value;
										if (imported_refs.has(name)) {
											const { uri, mod_ref } = imported_refs.get(name);
											const { export_refs } = modules.get(uri);
											const new_name = export_refs.get(mod_ref) ?? name;
											specifier.nodes[0].value = new_name;

											if (!specifier.nodes[1])
												specifier.nodes.push(<any>parse_js_exp(name));

										}
									}
								}
							}
						}
					} else if (node.type == JSNodeType.IdentifierReference) {

						const name = node.value;

						if (imported_refs.has(name)) {


							let HAVE_REF = false;

							let tip = stack;

							while (tip) {
								if (tip.refs.has(name)) {
									HAVE_REF = true;
									break;
								}
								tip = tip.prev;
							}

							if (!HAVE_REF) {
								const { uri, mod_ref } = imported_refs.get(name);
								const { export_refs } = modules.get(uri);
								const new_name = export_refs.get(mod_ref) ?? name;

								node.value = new_name;

							}
						}
					}
				}

				output.push(renderNew(module));
			}

			await fsp.writeFile(output_directory + "wick-rt.js", output.join("\n"), { encoding: 'utf8' });

			return;
		}
	);

processCLIConfig();