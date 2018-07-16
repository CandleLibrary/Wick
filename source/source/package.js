import { SourceManager } from "./manager"

export class SourcePackage {

    constructor() {
        this.skeletons = [];
        this.styles = [];
        this.scripts = [];
        this.style_core = [];

        Object.freeze(this);
    }

    frz() {
        Object.freeze(this.skeletons)
        Object.freeze(this.styles)
        Object.freeze(this.scripts)
    }

    addStyle() {

    }

    /**

    */
    mount(element, model, USE_SHADOW_DOM, manager) {

        let Manager = manager || new SourceManager(),
            sources = [],
            i = 0,
            l = 0;

        if (!Manager.sources)
            Manager.sources = [];

        if (USE_SHADOW_DOM) {

            let shadow_root = element.attachShadow({ mode: "open" });

            element = shadow_root;

            l

            for (i = 0, l = this.styles.length; i < l; i++) {
                let style = this.styles[i].cloneNode(true);
                element.appendChild(style);
            }
        }

        for (i = 0, l = this.skeletons.length; i < l; i++) {
            let source = this.skeletons[i].flesh(model);
            Manager.sources.push(source);
            element.appendChild(source.ele);
        }
    }
}