import Presets from "./presets.js";
import { rt } from "./runtime/runtime_global.js";
import { addModuleToCFW } from "@candlefw/cfw";

const nop = _ => !0, wick = function () {

    console.warn("Wick.rt is incapable of compiling components. Use the full wick library instead." +
        " \n\t An inert component will be generated.");

    const d = {
        mount: nop,
        get pending() { return d; },
        class: function () {
            this.ele = document.createElement("div");
            this.ele.innerHTML = "Wick.rt is incapable of compiling components. An inert component has been generated.";
        },
        createInstance: nop,
    };

    return d;
};

Object.assign(wick, rt);

Object.defineProperty(wick, "rt", {
    value: rt
});

Object.defineProperty(wick, "setWrapper", {
    value: nop
});

export default wick;

export const global_object = (typeof global !== "undefined") ? global : window;

addModuleToCFW(wick, "wick");

export { Presets };

