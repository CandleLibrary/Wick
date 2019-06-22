import ElementNode from "./element.mjs";

export default class fltr extends ElementNode {
    constructor(env, tag, children, attribs, presets) {
        super(env, "f", null, attribs, presets);

        this.type = 0;

        for (const attr of this.attribs.values()) 
            if (attr.value.setForContainer)
                attr.value.setForContainer(presets);
    }

    mount(scope, container) {
        for (const attr of this.attribs.values()) 
             attr.value.bind(scope).bindToContainer(attr.name, container);
    }
}
