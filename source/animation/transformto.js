import {
    Color
} from "./color"
import {
    CBezier
} from "../common"

var ease_out = new CBezier(0.5, 0.2, 0, 1);

class TT_From {
    constructor(element) {
        //extracted animatable componts
        var rect = element.getBoundingClientRect();
        
        this.color = new Color(window.getComputedStyle(element, null).getPropertyValue("background-color"));
        this.height = parseFloat(window.getComputedStyle(element, null).getPropertyValue("height"));
        this.width = parseFloat(window.getComputedStyle(element, null).getPropertyValue("width"));

        /*if(!this.height || !this.width){
            this.height = rect.height;
            this.width = rect.width;
        }*/

        console.log(this.width, this.height)

        this.left = parseFloat(rect.left);
        this.top = parseFloat(rect.top);
        this.element = element;

    }

    destructor() {
        this.element = null;
        this.color = null;
    }

    start() {
        this.element.style.opacity = 0;
    }
}

class TT_To extends TT_From {
    constructor(element, from) {
        super(element);

        this.from = from;

        this.res = ((element.style.top) && (element.style.left));

        this.rt = (element.style.top) ? (element.style.top) : null;
        this.rl = element.style.left ? element.style.left : null;


        //get the relative offset of this object
        var offset_x = 0; - element.getParentWindowLeft();
        var offset_y = 0; - element.getParentWindowTop();

        var offset_x = parseFloat(window.getComputedStyle(element, null).getPropertyValue("left"));
        var offset_y = parseFloat(window.getComputedStyle(element, null).getPropertyValue("top"));
        //And adjust start to respect the elements own parental offsets
        var diffx = this.left - this.from.left;
        this.left = offset_x;
        this.from.left = this.left - diffx;

        var diffy = this.top - this.from.top;
        this.top = offset_y;
        this.from.top = this.top - diffy;

        this.time = 60 * .35;
        this.s = 0;
        this.color_o = window.getComputedStyle(element, null).getPropertyValue("background-color");
        this.height_o = element.style.width;
        this.width_o = element.style.height;
        this.top_o = this.top;
        this.left_o = this.left;
        this.pos = window.getComputedStyle(element, null).getPropertyValue("position");
    }

    destructor() {
        this.end(); //Restore everything back to it's original type;
        this.from = null;
        super.destructor();
    }

    start() {
        this.element.style.opacity = 1;
        this.element.style.top = this.from.top + "px";
        this.element.style.left = this.from.left + "px";
        this.element.style.width = this.from.width + "px";
        this.element.style.height = this.from.height + "px";
    }

    step() {
        this.s++
        var t = this.s / this.time;

        if (t > 1) t = 1;
        var ratio = ease_out.getYatX(t);

        if (ratio > 1) ratio = 1;
        
        this.element.style.top = ((this.top - this.from.top) * ratio + this.from.top) + "px";
        this.element.style.left = ((this.left - this.from.left) * ratio + this.from.left) + "px";
        this.element.style.width = ((this.width - this.from.width) * ratio+ this.from.width) + "px";
        this.element.style.height = ((this.height - this.from.height) * ratio + this.from.height) + "px";
        this.element.style.backgroundColor = (this.color.sub(this.from.color).mult(ratio).add(this.from.color)) + "";

        return (t < 0.9999995);
    }

    end() {
        this.element.style.backgroundColor = null;
        this.element.style.height = this.height_o;
        this.element.style.width = this.width_o;
        this.element.style.top = this.rt;
        this.element.style.left = this.rl;
    }
}


class TTPair {
    constructor(e_to, e_from) {
        this.b = (e_from instanceof TT_From) ? e_from : new TT_From(e_from);
        this.a = new TT_To(e_to, this.b);
    }

    destructor() {
        this.a.destructor();
    }

    start() {
        this.b.start();
        this.a.start();
    }

    step() {
        return this.a.step();
    }
}

var rp = [];
/**
    Transform one element from another back to itself
*/
function TransformTo(element_from, element_to, HIDE_OTHER) {
    
    if(!element_to){
        let a = (from, rp)=>
        {
            return (element_to, HIDE_OTHER) => {
            let pair = new TTPair(element_to, from);
            rp.push(pair);
        }}

        let b = a(new TT_From(element_from), rp);

        return b;
    }

    var pair = new TTPair(element_to, element_from);
    
    rp.push(pair);
    
    pair.start();
}

var RAF = requestAnimationFrame;

var t = function(a) {

    for (var i = 0; i < rp.length; i++) {
        var _rp = rp[i];
        if (!_rp.step()) {
            _rp.destructor();
            rp.splice(i, 1);
            i--;
        };
    }

    RAF(t);
}

RAF(t);

export {
    TransformTo
}
