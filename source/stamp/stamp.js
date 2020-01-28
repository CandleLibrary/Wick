import tools from "../lite/tools.js";

import "./html/element.js";
import "./html/text.js";
import "./html/scope.js";
import "./html/script.js";
import "./html/style.js";
import "./html/container.js";
import "./html/attribute.js";
import "./html/binding.js";

import { types, parse as jsParse } from "@candlefw/js";

import { getTypeInClosure } from "../compiler/js/script_functions.js";

function baseSort(a,b){
	return (a<b) ? 1 : -1;
}

function getID(name, ids) {
	if (ids.has(name))
		return ids.get(name);
	else
		ids.set(name, ids.size);
	return ids.size - 1;
}

//function collectBindingOutputs(data, data_set) { return new Map(data.js.binds.flatMap(b => b.outputs).map((i) => [i.name, Object.assign({ id: getID(i.name, data_set), ref: 0 }, i)])); }

function collectBindingInputs(data, data_set) { return new Map(data.js.binds.flatMap(b => [].concat(b.inputs, b.on || [])).map((i) => [i.name, Object.assign({ id: getID(i.name, data_set), ref: 0 }, i)])); }

function compileContainer(data){

}

function compileScope(data) {
	//Collect all outputs and inputs
	const
		id_set = new Map(),
		inputs = collectBindingInputs(data, id_set);

	//get the number of references for each input

	for (const bind of data.js.binds) {
		
		const ast = bind.ast;

		for (const node of getTypeInClosure(ast, types.identifier, types.member_expression)) {

			//This will replace any references to HTML elements with a this.ele[*] expression.
			if(node.type == types.identifier && data.eleMap.has(node.name))
				node.replace(jsParse(`this.el[${data.eleMap.get(node.name).id}]`).statements.expression);
			
			if (node.root && inputs.has(node.name)) {
				if ((node.parent.type == types.assignment_expression)) {
					if ((node.parent.left == node) && node.type == types.identifier) {
						node.parent.replace(jsParse(`this.e({${node.render()}:${node.parent.right.render()}})`));
					} else {
						node.replace(jsParse(`this.v[${inputs.get(node.name).id}]`));
						inputs.get(node.name).ref++;
					}
				} else{
					node.replace(jsParse(`this.v[${inputs.get(node.name).id}]`));
					inputs.get(node.name).ref++;
				}
			}
		}
	}

	const bind_groups = new Map, d = "|";

	//group bindings by needed inputs, which will later be used to construct class methods, grouping all like binds together. 
	for (const bind of data.js.binds) {

		if (bind.inputs.length > 0 || bind.on) { 
			let input_id = bind.inputs.map(i => i.name) 
				.sort(baseSort)
				.join(d);

			if(bind.on)
				input_id += bind.on.map(i => i.name)
					.sort(baseSort)
					.join(d);
			
			if (!bind_groups.has(input_id))
				bind_groups.set(input_id, {IS_SCRIPT: !!bind.on, o:bind.on || bind.inputs, i:bind.inputs, b:[bind]});
			else
				bind_groups.get(input_id).b.push(bind);
		}else{
			// binds tied to input elements will not have input binds. 
			//OR
			// convert bind to hard assignment;
		}
	}

	const base = jsParse(`
		class extends wl.sc { 
			constructor(e){
				super(e, ${[...data.eleMap.values()].map(e=>`[${e.offset}]`).join(",")});
				const o = this;
				o.f = [];
				o.n = [${[...id_set.keys()].map(e=>`"${e}"`).join(",")}];
				o.v = [${[...id_set.keys()].map(e=>`null`).join(",")}];
			}
	}`).statements;

	const fns = base.body[0].body.stmts[2].expression.right;

	let i = 0;
	for (const group of bind_groups.values()) {
		let ast = null;
		i++;
		ast =
			jsParse(`class{ f${i} () {${group.b.map(b => b.ast.render()).join(";")}}}`)
			.statements
			.body[0];

		const 
			req = group.i.map(i => id_set.get(i.name)).reduce((r, i) => r |= 1 << i,  0),
			act = group.o.map(i => id_set.get(i.name)).reduce((r, i) => r |= 1 << i,  0),
			object = group.o.map(i => id_set.get(i.name))[0];

		fns.vals[0].push(jsParse(`({o:${object},S:${group.IS_SCRIPT ? 1 : 0},f:o.f${i},r:${req},a:${act}})`).statements.expression.args[0]);

		base.body.push(ast);
	}

	data.js.ast = base;
}

export default async function stamp(component) {

	await component.pending;

	const ast = component.ast;

	const data = {
		html: [],
		pinned: [],
		js: {
			binds: [],
			scripts: []
		}
	};

	ast.stamp(tools, data);

	compileScope(data);

	const hash = "ws" + (await import("crypto"))
		.createHash('sha256')
		.update(data.html.join("\n"))
		.update(data.js.ast.render())
		.digest("hex")
		.slice(0,14)
		.toUpperCase();

	return tools.addComponentTemplate(hash, data.html.join("\n"), data.js.ast.render());
}

tools.stamp = stamp;