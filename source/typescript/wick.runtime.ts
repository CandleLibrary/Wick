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

Object.defineProperty(wick, "toString", {
    value: () =>
        `       __          _    _ _____ _____  _   __     _   
      / _|        | |  | |_   _/  __ \| | / /    | |  
  ___| |___      _| |  | | | | | /  \/| |/ / _ __| |_ 
 / __|  _\ \ /\ / / |/\| | | | | |    |    \| '__| __|
| (__| |  \ V  V /\  /\  /_| |_| \__/\| |\  \ |  | |_ 
 \___|_|   \_/\_(_)\/  \/ \___/ \____/\_| \_/_|   \__|`

});

export default wick;

addModuleToCFW(wick, "wick");

export { Presets };

