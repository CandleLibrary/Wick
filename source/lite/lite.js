import glow from "@candlefw/glow";
import spark from "@candlefw/spark";
import Presets from "../presets.js";

import createContainer from "./component/container.js";
import liteScope from "./component/scope.js";

let pr = new Presets();

const 
	component_map = new Map(),
	wicklite = {

		set presets(data){
			pr = new Presets(data);
		},

		get c(){
			return pr.custom; 
		},

		glow,

		spark,

		sc: liteScope,

		//Get Element Template
		gt(id) {
			return document.getElementById(id);
		},
		
		//Load Component Template
		lc(hash, template, component_class) {
			component_map.set(hash, { constructor: component_class, template });
		},

		//Create Runtime Component
		cc(hash, element = null) {

			if (component_map.has(hash)) {
				const 
					comp_blueprint = component_map.get(hash),
					ele = element || document.importNode(comp_blueprint.template.content.firstElementChild, true);

				return new comp_blueprint.constructor(ele, this);
			}

			return null;
		},

		//Create Container 
		ctr(parent , ele, component_hash, ...fltrs) {
			return createContainer(parent, ele, component_hash, this, ...fltrs);
		}
	};

export default wicklite;