import Scope from "../../compiler/component/runtime/scope.js";

const component_map = new Map();

function createComponent(name, data) {
	if(typeof name == "object")
		name = object.hash;
	
	if (component_map.has(name)) {

		const component_constructor = component_map.get(name);

		const ele = document.importNode(component_constructor.template.content.firstChild, true);

		const obj = component_constructor.fn(ele, createComponent.lite);
		obj.ast = {};
		obj.css = [];
		obj.scopes = [];
		obj.taps = [];
		obj.loadAcknowledged = Scope.prototype.loadAcknowledged;
		obj.load = Scope.prototype.load;
		obj.appendToDOM = Scope.prototype.appendToDOM;
		obj.removeFromDOM = Scope.prototype.removeFromDOM;
		obj.transitionOut = Scope.prototype.transitionOut;
		obj.transitionIn = Scope.prototype.transitionIn;
		obj.load(data);
		obj.update(data);
		obj.ele = ele;
		return obj;
	}

	return null;
}

createComponent.map = component_map;

export default createComponent;