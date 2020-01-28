import lite from "./lite.js";

const tools = (function() {

	lite.indent = (str, ind = 0) => (("    ").repeat(ind) + str) + "";

	lite.getElement = function(obj, ele) {
		const ele_id = "$" + ele.join("_");

		if (!obj.eleMap){
			obj.eleMap = new Map();
			obj.ele_id = 0;
		}

		const mapped_elements = obj.eleMap;

		if (!mapped_elements.has(ele_id)) {

			mapped_elements.set(ele_id, { id_name : ele_id, id:mapped_elements.size, name: ele_id, offset: ele.slice() });
		}

		return mapped_elements.get(ele_id);
	};

	lite.compiled_templates = new Map();

	lite.addComponentTemplate = function(component_hash, html_string, js_string) {
		lite.compiled_templates.set(component_hash, {
			html:html_string,
			js:js_string,
			name:component_hash,
			hash:component_hash
		});

		return lite.compiled_templates.get(component_hash);
	};

	/* Creates a single file formatted as HTML capable of running as a single page. */
	lite.createSelfContainedPage = function(root, headers, scripts) {

		// Root component is the main component that hosts all other components.

		//clear componnet map and and create a new stamped component repository. 
		const map = lite.compiled_templates;

		const file = [];

		file.push("<!DOCTYPE html>");
		file.push("<html>");
		file.push("<head>");
		file.push("<script src=\"/cfw/wicklite\"></script>");
		file.push("</head>");
		file.push("<body>");
		file.push([...map.values()].map(v => (`<template id="${v.name}">${v.html}</template>`)).join(""));
		file.push("<script>");
		file.push([...map.values()].map(v => `wl.lc("${v.name}", wl.gt("${v.name}"),${v.js})`).join(";\n"));
		file.push(`document.body.appendChild(wl.cc("${root.name}").m)`);
		file.push("</script>");
		file.push("</body>");
		file.push("</html>");

		return file.join("\n");
	};

	return lite;
}());

export default tools;