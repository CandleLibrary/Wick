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

        if (!(l instanceof Lexer)) 
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
    let _$ = (r, g, b, a) => ({ r, g, b, a });
    let c = _$(0, 255, 255, 1);
    
    CSS_Color.colors = {
        "alice blue": _$(240, 248, 255, 1),
        "antique white": _$(250, 235, 215, 1),
        "aqua marine": _$(127, 255, 212, 1),
        "aqua": c,
        "azure": _$(240, 255, 255, 1),
        "beige": _$(245, 245, 220, 1),
        "bisque": _$(255, 228, 196, 1),
        "black": _$(0, 0, 0, 1),
        "blanched almond": _$(255, 235, 205, 1),
        "blue violet": _$(138, 43, 226, 1),
        "blue": _$(0, 0, 255, 1),
        "brown": _$(165, 42, 42, 1),
        "burly wood": _$(222, 184, 135, 1),
        "cadet blue": _$(95, 158, 160, 1),
        "chart reuse": _$(127, 255, 0, 1),
        "chocolate": _$(210, 105, 30, 1),
        "clear": _$(255, 255, 255, 0),
        "coral": _$(255, 127, 80, 1),
        "corn flower blue": _$(100, 149, 237, 1),
        "corn silk": _$(255, 248, 220, 1),
        "crimson": _$(220, 20, 60, 1),
        "cyan": c,
        "dark blue": _$(0, 0, 139, 1),
        "dark cyan": _$(0, 139, 139, 1),
        "dark golden rod": _$(184, 134, 11, 1),
        "dark gray": _$(169, 169, 169, 1),
        "dark green": _$(0, 100, 0, 1),
        "dark khaki": _$(189, 183, 107, 1),
        "dark magenta": _$(139, 0, 139, 1),
        "dark olive green": _$(85, 107, 47, 1),
        "dark orange": _$(255, 140, 0, 1),
        "dark orchid": _$(153, 50, 204, 1),
        "dark red": _$(139, 0, 0, 1),
        "dark salmon": _$(233, 150, 122, 1),
        "dark sea green": _$(143, 188, 143, 1),
        "dark slate blue": _$(72, 61, 139, 1),
        "dark slate gray": _$(47, 79, 79, 1),
        "dark turquoise": _$(0, 206, 209, 1),
        "dark violet": _$(148, 0, 211, 1),
        "deep pink": _$(255, 20, 147, 1),
        "deep sky blue": _$(0, 191, 255, 1),
        "dim gray": _$(105, 105, 105, 1),
        "dodger blue": _$(30, 144, 255, 1),
        "firebrick": _$(178, 34, 34, 1),
        "floral white": _$(255, 250, 240, 1),
        "forest green": _$(34, 139, 34, 1),
        "fuchsia": _$(255, 0, 255, 1),
        "gainsboro": _$(220, 220, 220, 1),
        "ghost white": _$(248, 248, 255, 1),
        "gold": _$(255, 215, 0, 1),
        "golden rod": _$(218, 165, 32, 1),
        "gray": _$(128, 128, 128, 1),
        "green yellow": _$(173, 255, 47, 1),
        "green": _$(0, 128, 0, 1),
        "honeydew": _$(240, 255, 240, 1),
        "hot pink": _$(255, 105, 180, 1),
        "indian red": _$(205, 92, 92, 1),
        "indigo": _$(75, 0, 130, 1),
        "ivory": _$(255, 255, 240, 1),
        "khaki": _$(240, 230, 140, 1),
        "lavender blush": _$(255, 240, 245, 1),
        "lavender": _$(230, 230, 250, 1),
        "lawn green": _$(124, 252, 0, 1),
        "lemon chiffon": _$(255, 250, 205, 1),
        "light blue": _$(173, 216, 230, 1),
        "light coral": _$(240, 128, 128, 1),
        "light cyan": _$(224, 255, 255, 1),
        "light golden rod yellow": _$(250, 250, 210, 1),
        "light gray": _$(211, 211, 211, 1),
        "light green": _$(144, 238, 144, 1),
        "light pink": _$(255, 182, 193, 1),
        "light salmon": _$(255, 160, 122, 1),
        "light sea green": _$(32, 178, 170, 1),
        "light sky blue": _$(135, 206, 250, 1),
        "light slate gray": _$(119, 136, 153, 1),
        "light steel blue": _$(176, 196, 222, 1),
        "light yellow": _$(255, 255, 224, 1),
        "lime green": _$(50, 205, 50, 1),
        "lime": _$(0, 255, 0, 1),
        "lime": _$(0, 255, 0, 1),
        "linen": _$(250, 240, 230, 1),
        "magenta": _$(255, 0, 255, 1),
        "maroon": _$(128, 0, 0, 1),
        "medium aqua marine": _$(102, 205, 170, 1),
        "medium blue": _$(0, 0, 205, 1),
        "medium orchid": _$(186, 85, 211, 1),
        "medium purple": _$(147, 112, 219, 1),
        "medium sea green": _$(60, 179, 113, 1),
        "medium slate blue": _$(123, 104, 238, 1),
        "medium spring green": _$(0, 250, 154, 1),
        "medium turquoise": _$(72, 209, 204, 1),
        "medium violet red": _$(199, 21, 133, 1),
        "midnight blue": _$(25, 25, 112, 1),
        "mint cream": _$(245, 255, 250, 1),
        "misty rose": _$(255, 228, 225, 1),
        "moccasin": _$(255, 228, 181, 1),
        "navajo white": _$(255, 222, 173, 1),
        "navy": _$(0, 0, 128, 1),
        "old lace": _$(253, 245, 230, 1),
        "olive drab": _$(107, 142, 35, 1),
        "olive": _$(128, 128, 0, 1),
        "orange red": _$(255, 69, 0, 1),
        "orange": _$(255, 165, 0, 1),
        "orchid": _$(218, 112, 214, 1),
        "pale golden rod": _$(238, 232, 170, 1),
        "pale green": _$(152, 251, 152, 1),
        "pale turquoise": _$(175, 238, 238, 1),
        "pale violet red": _$(219, 112, 147, 1),
        "papaya whip": _$(255, 239, 213, 1),
        "peach puff": _$(255, 218, 185, 1),
        "peru": _$(205, 133, 63, 1),
        "pink": _$(255, 192, 203, 1),
        "plum": _$(221, 160, 221, 1),
        "powder blue": _$(176, 224, 230, 1),
        "purple": _$(128, 0, 128, 1),
        "red": _$(255, 0, 0, 1),
        "rosy brown": _$(188, 143, 143, 1),
        "royal blue": _$(65, 105, 225, 1),
        "saddle brown": _$(139, 69, 19, 1),
        "salmon": _$(250, 128, 114, 1),
        "sandy brown": _$(244, 164, 96, 1),
        "sea green": _$(46, 139, 87, 1),
        "sea shell": _$(255, 245, 238, 1),
        "sienna": _$(160, 82, 45, 1),
        "silver": _$(192, 192, 192, 1),
        "sky blue": _$(135, 206, 235, 1),
        "slate blue": _$(106, 90, 205, 1),
        "slate gray": _$(112, 128, 144, 1),
        "snow": _$(255, 250, 250, 1),
        "spring green": _$(0, 255, 127, 1),
        "steel blue": _$(70, 130, 180, 1),
        "tan": _$(210, 180, 140, 1),
        "teal": _$(0, 128, 128, 1),
        "thistle": _$(216, 191, 216, 1),
        "tomato": _$(255, 99, 71, 1),
        "transparent": _$(0, 0, 0, 0),
        "turquoise": _$(64, 224, 208, 1),
        "violet": _$(238, 130, 238, 1),
        "wheat": _$(245, 222, 179, 1),
        "white smoke": _$(245, 245, 245, 1),
        "white": _$(255, 255, 255, 1),
        "yellow green": _$(154, 205, 50, 1),
        "yellow": _$(255, 255, 0, 1)
    }
}