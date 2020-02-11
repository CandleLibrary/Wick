import lite from "./lite.js";
import compiler_environment from "../compiler/compiler_environment.js";
import compiler from "../compiler/wick.js";
import whind from "@candlefw/whind";

const jsParse = str => compiler(whind(str), compiler_environment);

const tools = (function() {

	jsParse,

	lite.buildExpression = function(string) {
		const js_ast = jsParse(string);
		return js_ast.vals[0];
	};

	lite.createStampOutputObject = () => ({
		eleMap: new Map(),
		gates: new Map(),
		ids: new Map(),
		pinned: [],
		scopes: [],
		containers: [],
		html: [],
		js: {
			events: [],
			binds: [],
			scripts: []
		}
	});

	lite.getID = function(output, name) {
		const ids = output.ids;
		if (ids.has(name))
			return ids.get(name);
		else
			ids.set(name, { name, id: ids.size });
		return ids.size - 1;
	};

	lite.indent = (str, ind = 0) => ("    ").repeat(ind) + "" + str;

	lite.getElement = function(obj, ele) {
		const ele_id = "$" + ele.join("_");

		if (!obj.eleMap) {
			obj.eleMap = new Map();
			obj.ele_id = 0;
		}

		const mapped_elements = obj.eleMap;

		if (!mapped_elements.has(ele_id)) {

			mapped_elements.set(ele_id, { id_name: ele_id, id: mapped_elements.size, name: ele_id, offset: ele.slice() });
		}

		return mapped_elements.get(ele_id);
	};

	lite.compiled_templates = new Map();

	lite.getComponentTemplate = function(original_component) {
		if (lite.compiled_templates.has(original_component))
			return lite.compiled_templates.get(original_component);
		return null;
	};

	lite.addComponentTemplate = function(component_hash, html_string, js_string, original_component) {
		lite.compiled_templates.set(original_component, {
			html: html_string,
			js: js_string,
			name: component_hash,
			hash: component_hash,
			doc_ref: 0
		});

		return lite.compiled_templates.get(original_component);
	};

	/* Creates a single file formatted as HTML capable of running as a single page. */
	lite.createSelfContainedPage = function(root, options = {}) {

		// Root component is the main component that hosts all other components.

		//clear componnet map and and create a new stamped component repository. 
		const map = lite.compiled_templates;

		const file = [];

		const h = options.head ||
			`<head>
		<script src="/cfw/wicklite"></script>
		</head>
		`;

		file.push("<!DOCTYPE html>");
		file.push("<html>");
		file.push(h);

		file.push("<body>");
		if (options.set_root_in_body) {
			file.push(root.html);
			if (options.body)
				file.push(options.body);
			file.push([...map.values()].filter(v => v !== root).map(v => v.doc_ref > 0 ? (`<template id="${v.name}">${v.html}</template>`) : "").join(""));
			file.push("<script>");
			file.push([...map.values()].map(v => `wl.lc("${v.name}", wl.gt("${v.name}"),${v.js})`).join(";\n"));
			file.push(`wl.cc("${root.name}", document.getElementById("${options.set_root_in_body}")).load();`);
			file.push("</script>");
		} else {
			if (options.body)
				file.push(options.body);
			file.push([...map.values()].map(v => v.doc_ref > 0 ? (`<template id="${v.name}">${v.html}</template>`) : "").join(""));
			file.push("<script>");
			file.push([...map.values()].map(v => `wl.lc("${v.name}", wl.gt("${v.name}"),${v.js})`).join(";\n"));
			file.push(`const comp = wl.cc("${root.name}"); document.body.appendChild(comp.m); comp.load();`);
			file.push("</script>");
		}
		file.push("</body>");
		file.push("</html>");

		return file.join("\n");
	};

	return lite;
}());

export default tools;