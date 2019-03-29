import { RootNode, BindingCSSRoot } from "./root";
import { Source } from "../../source";
import { appendChild, createElement } from "../../../short_names";
import { Tap, UpdateTap } from "../../tap/tap";
import { Template } from "../template/template_bindings";
import { ATTRIB } from "../template/basic_bindings";
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

    build(element, source, presets, errors, taps, statics, out_ele) {
        return (statics.slots && statics.slots[this.name]) ?
            statics.slots[this.name].build(
                element,
                statics.slots[this.name].getCachedSource() || source,
                /*statics.slots[this.name].getPresets() || */presets,
                errors,
                taps,
                statics,
                out_ele
            ) :
            source;
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
