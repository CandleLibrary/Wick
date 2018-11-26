import { VoidNode } from "./void";
import { Template } from "../template/template_bindings";
import { SCRIPT, DYNAMIC_BINDING_ID } from "../template/basic_bindings";

export class ScriptNode extends VoidNode {
    constructor() {
        super();
        this._script_text_ = "";
        this._binding_ = null;
    }

    processTextNodeHook(lex) {
        if (this._binding_)
            this._binding_.val = lex.slice();
    }

    processAttributeHook(name, lex) {

        switch (name) {
            case "on":
                let binding = Template(lex, false);
                if (binding.type == DYNAMIC_BINDING_ID) {
                    binding.method = SCRIPT;
                    this._binding_ = this.processTapBinding(binding);
                }
                return null;
        }

        return { name, value: lex.slice() };
    }
    build(element, source, presets, errors, taps) {
        if (this._binding_)
            this._binding_._bind_(source, errors, taps, element);
    }
}