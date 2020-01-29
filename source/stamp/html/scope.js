import scope from "../../compiler/html/scope.js";
import element from "../../compiler/html/element.js";

scope.prototype.stamp = async function(tools, output, indent_level = 0, eleid = [0]) {

	if (output.HAVE_SCOPE) {
		//create new component from this element
		const result = await tools.stamp(this);
		result.doc_ref--;
		//*
		output.scopes.push({
			ele: tools.getElement(output, eleid).id,
			hash: result.hash
		});
		//*/
		for (const tap of this.tap_list) {
			tools.getID(output, tap.name);
		}


		if (this.pinned)
			output.pinned[this.pinned] = tools.getElement(output, eleid);

		const o = tools.createStampOutputObject();
		o.html = output.html;
		//o.pinned = output.pinned;
		output = o;

	} else {

		for (const tap of this.tap_list) {

			output.gates.set(tap.name, {
				name: tap.name,
				mode: tap.modes
			});

			tools.getID(output, tap.name);

			if (tap.redirect) {
				output.js.binds.push({
					ast: tools.buildExpression(`${tap.redirect} = ${tap.name}`),
					inputs: [{ name: tap.name }],
					outputs: [{ name: tap.redirect }]
				});
			}
		}
	}
	//Configure gates
	output.HAVE_SCOPE = true;

	await element.prototype.stamp.call(this, tools, output, indent_level, eleid);
};

scope.prototype.lite = "lite_scope";