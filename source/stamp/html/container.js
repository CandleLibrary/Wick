import container from "../../compiler/html/container.js";
import Attribute from "../../compiler/html/attribute.js";

container.prototype.stamp = async function(tools, output, indent_level = 0, eleid = [0]) {

	const str = [`<${this.element}`],
		child_eleid = eleid.concat([0]);

	//Only create a container if it is able to generate components. 
	if (!this.component_constructor)
		return;
	else {
		var component = await tools.stamp(this.component_constructor);
	}

	const id = output.containers.length + 1;

	output.containers.push({
		ele : tools.getElement(output, eleid).id,
		id,
		component : component.hash
	});

	for (const attr of this.attribs.values())
		attr.stamp(tools, output, str, eleid, this);


	output.html.push(tools.indent(str.join(" ") + ">", indent_level));

	for (const bind of this.binds) {
		bind.stamp(tools, output, indent_level + 1, eleid, id);
	}

	if(this.pinned)
        output.pinned[this.pinned] = tools.getElement(output, eleid);
	/*
	for (const fltr of this.filters)
            fltr.mount(scope, container);
    */
	/*

	if (this.binds.length > 0) {
            for (const bind of this.binds)
                bind.mount(null, scope, presets, slots, pinned, container);
        }else{ 
            //If there is no binding, then there is no potential to have a data array host generate components.
            //Instead, load any existing children as component entries for the container element. 
            for (const node of this.nodes)
                container.scopes.push(node.mount(null, null, presets, slots));
            container.filterUpdate();
            container.render();
        }
*/
	output.html.push(tools.indent(`</${this.element}>`, indent_level));

	eleid[eleid.length - 1]++;
};