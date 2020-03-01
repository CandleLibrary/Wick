import tools from "./lite/tools.js.js.js.js";

import "./html/element.js.js.js.js";
import "./html/text.js.js.js.js";
import "./html/scope.js.js.js.js";
import "./html/script.js.js.js.js";
import "./html/style.js.js.js.js";
import "./html/container.js.js.js.js";
import "./html/attribute.js.js.js.js";
import "./html/binding.js.js.js.js";

import { types, statements } from "@candlefw/js";



import { getTypeInClosure} from "./js/script_functions.js.js.js.js";

const jsParse = tools.jsParse;

function baseSort(a, b) {
	return (a < b) ? 1 : -1;
}
//function collectBindingOutputs(data, data_set) { return new Map(data.js.binds.flatMap(b => b.outputs).map((i) => [i.name, Object.assign({ id: getID(i.name, data_set), ref: 0 }, i)])); }

function collectBindingInputs(data) { return new Map(data.js.binds.flatMap(b => [].concat(b.inputs, b.on || [])).forEach((i) => tools.getID(data, i.name))); }

function compileContainer(data) {

}
/* Returns the first expression statment node in the resultant ast of the parse tree of string argument. */
function buildExpression(string) {
	const js_ast = jsParse(string);
	return js_ast.vals[0].expression;
}

function compileScope(data, presets) {
	//Collect all inputs
	collectBindingInputs(data);

	const
		inputs = new Map([...data.ids.values()].map(i => [i.name, Object.assign({ id: i.id, ref: 0 })]));

	//get the number of references for each input
	for (const bind of data.js.binds) {

		const ast = bind.ast;

		for (const node of getTypeInClosure(ast,
				types.identifier,
				types.object_literal
			)) {

			if (node.type == types.object_literal) {
				for (const prop of node.traverseChildren()) {
					if (prop.type == types.identifier && inputs.has(prop.name)) {
						prop.replace(jsParse(`({${prop.name}:${prop.name}})`).statements.expression.args[0].props[0])
					}
				}
			}
			
			if (node.type == types.identifier && node.root) {
				if (data.eleMap.has(node.name))
					node.replace(jsParse(`this.el[${data.eleMap.get(node.name).id}]`).statements.expression);
				else if (data.pinned[node.name])
					node.replace(jsParse(`this.el[${data.pinned[node.name].id}]`).statements.expression);
				else if (node.root && presets.custom[node.name]) {
					node.replace(jsParse(`this.wl.${node.name}`).statements.expression);
				}

				if (node.root && inputs.has(node.name)) {
					if ((node.parent.type == types.assignment_expression)) {
						if ((node.parent.left == node) && node.type == types.identifier) {
							node.parent.replace(jsParse(`this.e({${node.render()}:${node.parent.right.render()}})`));
						} else {
							node.replace(buildExpression(`this.v[${inputs.get(node.name).id}]`));
							inputs.get(node.name).ref++;
						}
					} else {
						node.replace(buildExpression(`this.v[${inputs.get(node.name).id}]`));
						inputs.get(node.name).ref++;
					}
				}
			}
		}
	}

	function createEvents(data) {
		const event_asts = { cstr: null, dstr: null }
		let i = 0;
		for (const event of data.js.events) {
			//should group events
			const cstr_ast = jsParse(`
				o.e${i} = e => { 
					o.e({${event.output}:${event.value}}); 
					${event.preventPropagation ? `
						e.preventPropagation();
						return false;
					` : ""}
				}; 
				o.el[${data.eleMap.get(event.ele).id}].addEventListener("${event.event}", o.e${i});
			`)

			const dstr_ast = jsParse(`
				o.el[${data.eleMap.get(event.ele).id}].removeEventListener("${event.event}", o.e${i});
			`)

			if (!event_asts.cstr)
				event_asts.cstr = new statements([[]]);

			if (!event_asts.dstr)
				event_asts.dstr = new statements([[]]);

			event_asts.cstr.vals.push(...cstr_ast.statements.vals);
			event_asts.dstr.vals.push(...dstr_ast.statements.vals);
		}

		return event_asts;
	}

	const event_asts = createEvents(data);

	const bind_groups = new Map,
		d = "|";

	//group bindings by needed inputs, which will later be used to construct class methods, grouping all like binds together. 
	for (const bind of data.js.binds) {

		if (bind.inputs.length > 0 || bind.on) {
			let input_id = bind.inputs.map(i => i.name)
				.sort(baseSort)
				.join(d);

			if (bind.on)
				input_id += bind.on.map(i => i.name)
				.sort(baseSort)
				.join(d);

			if (!bind_groups.has(input_id))
				bind_groups.set(input_id, { IS_SCRIPT: !!bind.on, o: bind.on || bind.inputs, i: bind.inputs, b: [bind] });
			else {
				bind_groups.get(input_id).b.push(bind);
			}
			if (bind.IS_ASYNC)
				bind_groups.get(input_id).IS_ASYNC = true;
		} else {
			// binds tied to input elements will not have input binds. 
			//OR
			// convert bind to hard assignment;
		}
	}

	const CREATE_DESTROY = (!!event_asts.dstr) || data.containers.length > 0;

	const base = jsParse(`
		class extends wl.sc { 
			constructor(e, wl){
				super(e, wl ${[...data.eleMap.values()].map(e=>`, [${e.offset}]`).join("")});
				const o = this;
				o.f = [];
				o.n = [${[...inputs.keys()].map(e=>`"${e}"`).join(",")}];
				o.v = [${[...inputs.keys()].map(e=>`null`).join(",")}];
				o.g = [${[...inputs.keys()].map(e=>data.gates.has(e) ? data.gates.get(e).mode : 0).join(",")}];
				${event_asts.cstr ? event_asts.cstr.render() : ""}
				${data.containers.map(
					c=>`o.c${c.id} = wl.ctr(o, o.el[${c.ele}], "${c.component}")`
				).join(";")}
				${data.scopes.length > 0 ? 
					`${data.scopes.map(s=>`o.addScope(wl.cc("${s.hash}", o.el[${s.ele}]))`).join(";")};`
					: ""}
			}
			${ CREATE_DESTROY ? 
			`destroy(){
				const o = this;
				${event_asts.dstr ? event_asts.dstr.render() : ""}
				${data.containers.map(
					c=>`o.c${c.id}.destroy()`
				).join(";") + ";"}
				super.destroy();
			}`
			: ""}
	}`).statements;

	const fns = base.body[0].body.stmts[2].expression.right;

	let i = 0;
	for (const group of bind_groups.values()) {
		let ast = null;
		i++;
		ast =
			jsParse(`class{${group.IS_ASYNC ? " async " : " "}f${i} () {${group.b.map(b =>  b.ast.render()).join(";")}}}`)
			.statements
			.body[0];

		const
			req = group.i.map(i => inputs.get(i.name).id).reduce((r, i) => r |= 1 << i, 0),
			act = group.o.map(i => inputs.get(i.name).id).reduce((r, i) => r |= 1 << i, 0),
			object = group.o.map(i => inputs.get(i.name).id)[0];

		fns.vals[0].push(jsParse(`({o:${object},S:${group.IS_SCRIPT ? 1 : 0},f:o.f${i},r:${req},a:${act}})`).statements.expression.args[0]);

		base.body.push(ast);
	}

	data.js.ast = base;
}

export default async function stamp(component) {
	let ast = null;

	if (component.constructor.prototype.lite == "lite_scope") {
		ast = component.finalize();
	} else {
		await component.pending;
		ast = component.ast;
	}

	let template = null;
	if (tools.getComponentTemplate(ast)) {
		template = tools.getComponentTemplate(ast);
	} else {

		const data = tools.createStampOutputObject();

		await ast.stamp(tools, data);

		compileScope(data, ast.presets);

		const hash = "W" + (await import("crypto"))
			.createHash('sha256')
			.update(data.html.join("\n"))
			.update(data.js.ast.render())
			.digest("hex")
			.slice(0, 7)
			.toUpperCase();
		template = tools.addComponentTemplate(hash, data.html.join("\n"), data.js.ast.render(), ast);
	}

	template.doc_ref++;

	return template;
}

tools.stamp = stamp;