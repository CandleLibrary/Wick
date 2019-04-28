import { RootNode, BindingCSSRoot } from "./root.mjs";
import { Scope } from "../../runtime/scope.mjs";
import { Tap, UpdateTap } from "../../tap/tap.mjs";
import { Template } from "../template/template_bindings.mjs";
import { ATTRIB } from "../template/basic_bindings.mjs";
import { appendChild, createElement } from "../../../short_names.mjs";
/**
 * Slot Node. 
 */
export class SlotNode extends RootNode {
    constructor() {
        super();
        this.name = "";
    }

    delegateTapBinding() {
        return null;
    }

    build(element, scope, presets, errors, taps, statics, RENDER_ONLY = false) {

        return (statics.slots && statics.slots[this.name]) ?
            (statics.slots[this.name].SLOTED = true,
            statics.slots[this.name].build(
                element,
                statics.slots[this.name].getCachedScope() || scope,
                /*statics.slots[this.name].getPresets() || */presets,
                errors,
                taps,
                statics,
                RENDER_ONLY
            )) :
            scope;
    }

    processAttributeHook(name, lex) {

        if (!name) return null;

        let start = lex.off,
            basic = {
                IGNORE: true,
                name,
                value: lex.slice(start)
            };

        let bind_method = ATTRIB,
            FOR_EVENT = false;

        if (name == "name")
            this.name = basic.value;

        return basic;
    }

}
