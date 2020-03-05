import HTML from "@candlefw/html";
//import CSS from "@candlefw/css";

export default function(){
    if (typeof(global) !== "undefined") {
    	HTML.polyfill();
    	//CSS.polyfill();

        global.window = global.window || {}
    }
}
