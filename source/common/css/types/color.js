import { Lexer } from "../../string_parsing/lexer"
import { Color } from "../../design/color"

/*
    BODY {color: black; background: white }
    H1 { color: maroon }
    H2 { color: olive }
    EM { color: #f00 }              // #rgb //
    EM { color: #ff0000 }           // #rrggbb //
    EM { color: rgb(255,0,0) }      // integer range 0 - 255 //
    EM { color: rgb(100%, 0%, 0%) } // float range 0.0% - 100.0% //
*/



export class CSS_Color extends Color {

    static parse(l, rule, r) {
        let c = CSS_Color.fs(l);
        if (c) {
            l.sync().n();

            return c;
        }
        return null;
    }
    /**
        Creates a new Color from a string or a Lexer.
    */
    static fs(l, c) {

        if (l instanceof Lexer) {
            let c = l.peek();
            c.sync(l);
            l = c;
        } else
            l = new Lexer(l);

        let out = { r: 0, g: 0, b: 0, a: 1 };

        switch (l.token.tx) {

            case "rgb":
                l.n() // (
                out.r = parseInt(l.n().tx)
                l.n() // ,
                out.g = parseInt(l.n().tx)
                l.n() // ,
                out.b = parseInt(l.n().tx)
                break;

            case "rgba":
                l.n() // (
                out.r = parseInt(l.n().tx)
                l.n() // ,
                out.g = parseInt(l.n().tx)
                l.n() // ,
                out.b = parseInt(l.n().tx)
                l.n() // ,
                out.a = parseFloat(l.n().tx)
                break;

            case "#":
                var value = l.n().tx;
                break;

            default:
                let string = l.tx;

                if (l.type == l.types.str)
                    string = string.slice(1, -1);

                out = CSS_Color.colors[string.toLowerCase()];

                if (!out) return null;
        }

        if (!c)
            c = new CSS_Color();

        c.set(out);

        return c;
    }
} {
    let $ = (r, g, b, a) => { r, g, b, a };
    let c = $(0, 255, 255, 1);
    
    Color.colors = {
        "alice blue": $(240, 248, 255, 1),
        "antique white": $(250, 235, 215, 1),
        "aqua marine": $(127, 255, 212, 1),
        "aqua": c,
        "azure": $(240, 255, 255, 1),
        "beige": $(245, 245, 220, 1),
        "bisque": $(255, 228, 196, 1),
        "black": $(0, 0, 0, 1),
        "blanched almond": $(255, 235, 205, 1),
        "blue violet": $(138, 43, 226, 1),
        "blue": $(0, 0, 255, 1),
        "brown": $(165, 42, 42, 1),
        "burly wood": $(222, 184, 135, 1),
        "cadet blue": $(95, 158, 160, 1),
        "chart reuse": $(127, 255, 0, 1),
        "chocolate": $(210, 105, 30, 1),
        "clear": $(255, 255, 255, 0),
        "coral": $(255, 127, 80, 1),
        "corn flower blue": $(100, 149, 237, 1),
        "corn silk": $(255, 248, 220, 1),
        "crimson": $(220, 20, 60, 1),
        "cyan": c,
        "dark blue": $(0, 0, 139, 1),
        "dark cyan": $(0, 139, 139, 1),
        "dark golden rod": $(184, 134, 11, 1),
        "dark gray": $(169, 169, 169, 1),
        "dark green": $(0, 100, 0, 1),
        "dark khaki": $(189, 183, 107, 1),
        "dark magenta": $(139, 0, 139, 1),
        "dark olive green": $(85, 107, 47, 1),
        "dark orange": $(255, 140, 0, 1),
        "dark orchid": $(153, 50, 204, 1),
        "dark red": $(139, 0, 0, 1),
        "dark salmon": $(233, 150, 122, 1),
        "dark sea green": $(143, 188, 143, 1),
        "dark slate blue": $(72, 61, 139, 1),
        "dark slate gray": $(47, 79, 79, 1),
        "dark turquoise": $(0, 206, 209, 1),
        "dark violet": $(148, 0, 211, 1),
        "deep pink": $(255, 20, 147, 1),
        "deep sky blue": $(0, 191, 255, 1),
        "dim gray": $(105, 105, 105, 1),
        "dodger blue": $(30, 144, 255, 1),
        "firebrick": $(178, 34, 34, 1),
        "floral white": $(255, 250, 240, 1),
        "forest green": $(34, 139, 34, 1),
        "fuchsia": $(255, 0, 255, 1),
        "gainsboro": $(220, 220, 220, 1),
        "ghost white": $(248, 248, 255, 1),
        "gold": $(255, 215, 0, 1),
        "golden rod": $(218, 165, 32, 1),
        "gray": $(128, 128, 128, 1),
        "green yellow": $(173, 255, 47, 1),
        "green": $(0, 128, 0, 1),
        "honeydew": $(240, 255, 240, 1),
        "hot pink": $(255, 105, 180, 1),
        "indian red": $(205, 92, 92, 1),
        "indigo": $(75, 0, 130, 1),
        "ivory": $(255, 255, 240, 1),
        "khaki": $(240, 230, 140, 1),
        "lavender blush": $(255, 240, 245, 1),
        "lavender": $(230, 230, 250, 1),
        "lawn green": $(124, 252, 0, 1),
        "lemon chiffon": $(255, 250, 205, 1),
        "light blue": $(173, 216, 230, 1),
        "light coral": $(240, 128, 128, 1),
        "light cyan": $(224, 255, 255, 1),
        "light golden rod yellow": $(250, 250, 210, 1),
        "light gray": $(211, 211, 211, 1),
        "light green": $(144, 238, 144, 1),
        "light pink": $(255, 182, 193, 1),
        "light salmon": $(255, 160, 122, 1),
        "light sea green": $(32, 178, 170, 1),
        "light sky blue": $(135, 206, 250, 1),
        "light slate gray": $(119, 136, 153, 1),
        "light steel blue": $(176, 196, 222, 1),
        "light yellow": $(255, 255, 224, 1),
        "lime green": $(50, 205, 50, 1),
        "lime": $(0, 255, 0, 1),
        "lime": $(0, 255, 0, 1),
        "linen": $(250, 240, 230, 1),
        "magenta": $(255, 0, 255, 1),
        "maroon": $(128, 0, 0, 1),
        "medium aqua marine": $(102, 205, 170, 1),
        "medium blue": $(0, 0, 205, 1),
        "medium orchid": $(186, 85, 211, 1),
        "medium purple": $(147, 112, 219, 1),
        "medium sea green": $(60, 179, 113, 1),
        "medium slate blue": $(123, 104, 238, 1),
        "medium spring green": $(0, 250, 154, 1),
        "medium turquoise": $(72, 209, 204, 1),
        "medium violet red": $(199, 21, 133, 1),
        "midnight blue": $(25, 25, 112, 1),
        "mint cream": $(245, 255, 250, 1),
        "misty rose": $(255, 228, 225, 1),
        "moccasin": $(255, 228, 181, 1),
        "navajo white": $(255, 222, 173, 1),
        "navy": $(0, 0, 128, 1),
        "old lace": $(253, 245, 230, 1),
        "olive drab": $(107, 142, 35, 1),
        "olive": $(128, 128, 0, 1),
        "orange red": $(255, 69, 0, 1),
        "orange": $(255, 165, 0, 1),
        "orchid": $(218, 112, 214, 1),
        "pale golden rod": $(238, 232, 170, 1),
        "pale green": $(152, 251, 152, 1),
        "pale turquoise": $(175, 238, 238, 1),
        "pale violet red": $(219, 112, 147, 1),
        "papaya whip": $(255, 239, 213, 1),
        "peach puff": $(255, 218, 185, 1),
        "peru": $(205, 133, 63, 1),
        "pink": $(255, 192, 203, 1),
        "plum": $(221, 160, 221, 1),
        "powder blue": $(176, 224, 230, 1),
        "purple": $(128, 0, 128, 1),
        "red": $(255, 0, 0, 1),
        "rosy brown": $(188, 143, 143, 1),
        "royal blue": $(65, 105, 225, 1),
        "saddle brown": $(139, 69, 19, 1),
        "salmon": $(250, 128, 114, 1),
        "sandy brown": $(244, 164, 96, 1),
        "sea green": $(46, 139, 87, 1),
        "sea shell": $(255, 245, 238, 1),
        "sienna": $(160, 82, 45, 1),
        "silver": $(192, 192, 192, 1),
        "sky blue": $(135, 206, 235, 1),
        "slate blue": $(106, 90, 205, 1),
        "slate gray": $(112, 128, 144, 1),
        "snow": $(255, 250, 250, 1),
        "spring green": $(0, 255, 127, 1),
        "steel blue": $(70, 130, 180, 1),
        "tan": $(210, 180, 140, 1),
        "teal": $(0, 128, 128, 1),
        "thistle": $(216, 191, 216, 1),
        "tomato": $(255, 99, 71, 1),
        "transparent": $(0, 0, 0, 0),
        "turquoise": $(64, 224, 208, 1),
        "violet": $(238, 130, 238, 1),
        "wheat": $(245, 222, 179, 1),
        "white smoke": $(245, 245, 245, 1),
        "white": $(255, 255, 255, 1),
        "yellow green": $(154, 205, 50, 1),
        "yellow": $(255, 255, 0, 1)
    }
}