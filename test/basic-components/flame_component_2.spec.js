/**
 * If binding are found within a textarea, then by default these will be rendered in the <textarea>
 * as-is. This behavior should instead reflect an intuitive understanding: the data a binding attaches to
 * should update the value attribute of the <textarea>. 
 */
import wick from "../../build/library/entry-point/wick-server.js";

wick.utils.enableTest();

const comp = (await wick(`

var canvas = ("@#canvas");
 var ctx = canvas.getContext("2d");
 
 import { sc } from "@model:var";
 import { sys } from "@api";
 
 function update() {

    const
        scale = sys.ui.transform.scale,
        py = sys.ui.transform.py / scale,
        max_height = window.innerHeight;

    let notch_distance = 0;

    if (scale < 0.4)
        notch_distance = 32 * scale;
    else if (scale < 0.8)
        notch_distance = 16 * scale;
    else
        notch_distance = 8 * scale;

    const adjust = (py % (256)) * scale;

    let offset = -256 * scale;

    canvas.height = max_height;
    ctx.fillStyle = "#DDDDDD";

    //Small markers
    while (offset + adjust < max_height) {
        ctx.fillRect(0, offset + adjust, 10, 1);
        offset += notch_distance;
    }
    offset = -256 * scale;

    if (scale < 0.4) {
        notch_distance = 256 * scale;
    } else if (scale < 0.8) {
        notch_distance = 128 * scale;
    } else {
        notch_distance = 64 * scale;
    }
    //large markers
    while (offset + adjust < max_height) {
        ctx.fillRect(0, offset + adjust, 20, 1);
        offset += notch_distance;
    }
 }
 
 watch(update, sc);
 
 export default <div> <canvas id="canvas" width="20"></canvas></div>;

 `));

assert(i, comp.class_string == "");