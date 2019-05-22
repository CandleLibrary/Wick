import Binding from "./binding.mjs";
import { IO, AttribIO, InputIO } from "../component/io/io.mjs";

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

        if (this.value instanceof Binding)
            this.isBINDING = true;
    }

    link(element) {
        const tag = element.tag;

        if (this.isBINDING) {

            if (this.name == "value" && tag == "input")
                this.io_constr = InputIO;
        }

    }

    bind(element, scope) {
        if (!this.isBINDING)
            element.setAttribute(this.name, this.value);
        else {
            const
                bind = this.value.bind(scope),
                io = new this.io_constr(scope, [], bind, this.name, element, this.value.default);
        }
    }
}
