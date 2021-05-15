//@ts-nocheck
import HTML from "@candlefw/html";
export default function () {
    if (typeof (global) !== "undefined") {
        HTML.polyfill();
        //CSS.polyfill();
        global.window = global.window || {};
    }
}
