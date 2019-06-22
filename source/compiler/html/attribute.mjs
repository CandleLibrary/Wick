import Binding from "./binding.mjs";
import { AttribIO, InputIO, EventIO } from "../component/io/io.mjs";
//import EventIO from "../component/io/event_io.mjs"

export default class Attribute {

    constructor(sym) {

        const
            HAS_VALUE = sym.length > 1,
            name = sym[0],
            val = (HAS_VALUE) ? sym[2] : null;

        this.name = name;
        this.value = val;
        this.io_constr = AttribIO;
        this.isBINDING = false;
        this.RENDER = true;

        if (this.value instanceof Binding)
            this.isBINDING = true;
    }

    link(element) {
        const tag = element.tag;

        if (this.isBINDING) {

            if (this.name.slice(0, 2) == "on"){
                this.io_constr = EventIO;
            }

            else

            if (this.name == "value" && (tag == "input" || tag == "textarea"))
                this.io_constr = InputIO;
        }

    }

    bind(element, scope, pinned) {
        if (this.RENDER)
            if (!this.isBINDING)

            {
                element.setAttribute(this.name, this.value);
            }

            else 

            {
                const bind = this.value.bind(scope, pinned);
                new this.io_constr(scope, [], bind, this.name, element, this.value.default);
            }
    }
}
