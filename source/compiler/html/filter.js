import ElementNode from "./element.js";
import binding from "./binding.js";

export default class fltr extends ElementNode {
    constructor(env, tag, children, attribs, presets) {
        super(env, "f", null, attribs, presets);

        this.type = 0;

        for (const attr of this.attribs.values()) 
            if (attr.value.setForContainer)
                attr.value.setForContainer(presets);
    }

    mount(scope, container) {
        for (const attr of this.attribs.values()){

            if(attr.value instanceof binding){
                attr.value.bind(scope, null, null, this).bindToContainer(attr.name, container);
            }else{
                const val  = parseFloat(attr.value) || 0;
                switch(attr.name){
                    case "limit":
                        container.limit = val;
                    break;
                    case "scrub":
                        container.scrub = val;
                    break;
                    case "shift":
                        container.shift_amount = val;
                    break;
                }
            }
        }
    }
}
