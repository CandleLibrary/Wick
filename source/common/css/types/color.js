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

                out = CSS_Color.colors[string];

                if (!out) return null;
        }

        if (!c)
            c = new CSS_Color();

        c.set(out);

        return c;
    }
}

Color.colors = {
    "transparent": { r: 255, g: 255, b: 255, a: 0.0001 },
    "clear": { r: 255, g: 255, b: 255, a: 0.0001 },
    "red": { r: 255, g: 0, b: 0, a: 1 },
    "green": { r: 0, g: 255, b: 0, a: 1 },
    "blue": { r: 0, g: 0, b: 255, a: 1 },
    "Black": { r: 0, g: 0, b: 0, a: 1 },
    "White": { r: 255, g: 255, b: 255, a: 1 },
    "white": { r: 255, g: 255, b: 255, a: 1 },
    "Red": { r: 255, g: 0, b: 0, a: 1 },
    "Lime": { r: 0, g: 255, b: 0, a: 1 },
    "Blue": { r: 0, g: 0, b: 255, a: 1 },
    "Yellow": { r: 255, g: 255, b: 0, a: 1 },
    "Cyan": { r: 0, g: 255, b: 255, a: 1 },
    "Aqua": { r: 0, g: 255, b: 255, a: 1 },
    "Magenta": { r: 255, g: 0, b: 255, a: 1 },
    "Fuchsia": { r: 255, g: 0, b: 255, a: 1 },
    "Silver": { r: 192, g: 192, b: 192, a: 1 },
    "Gray": { r: 128, g: 128, b: 128, a: 1 },
    "Maroon": { r: 128, g: 0, b: 0, a: 1 },
    "Olive": { r: 128, g: 128, b: 0, a: 1 },
    "Green": { r: 0, g: 128, b: 0, a: 1 },
    "Purple": { r: 128, g: 0, b: 128, a: 1 },
    "Teal": { r: 0, g: 128, b: 128, a: 1 },
    "Navy": { r: 0, g: 0, b: 128, a: 1 },
    "maroon": { r: 128, g: 0, b: 0, a: 1 },
    "dark red": { r: 139, g: 0, b: 0, a: 1 },
    "brown": { r: 165, g: 42, b: 42, a: 1 },
    "firebrick": { r: 178, g: 34, b: 34, a: 1 },
    "crimson": { r: 220, g: 20, b: 60, a: 1 },
    "red": { r: 255, g: 0, b: 0, a: 1 },
    "tomato": { r: 255, g: 99, b: 71, a: 1 },
    "coral": { r: 255, g: 127, b: 80, a: 1 },
    "indian red": { r: 205, g: 92, b: 92, a: 1 },
    "light coral": { r: 240, g: 128, b: 128, a: 1 },
    "dark salmon": { r: 233, g: 150, b: 122, a: 1 },
    "salmon": { r: 250, g: 128, b: 114, a: 1 },
    "light salmon": { r: 255, g: 160, b: 122, a: 1 },
    "orange red": { r: 255, g: 69, b: 0, a: 1 },
    "dark orange": { r: 255, g: 140, b: 0, a: 1 },
    "orange": { r: 255, g: 165, b: 0, a: 1 },
    "gold": { r: 255, g: 215, b: 0, a: 1 },
    "dark golden rod": { r: 184, g: 134, b: 11, a: 1 },
    "golden rod": { r: 218, g: 165, b: 32, a: 1 },
    "pale golden rod": { r: 238, g: 232, b: 170, a: 1 },
    "dark khaki": { r: 189, g: 183, b: 107, a: 1 },
    "khaki": { r: 240, g: 230, b: 140, a: 1 },
    "olive": { r: 128, g: 128, b: 0, a: 1 },
    "yellow": { r: 255, g: 255, b: 0, a: 1 },
    "yellow green": { r: 154, g: 205, b: 50, a: 1 },
    "dark olive green": { r: 85, g: 107, b: 47, a: 1 },
    "olive drab": { r: 107, g: 142, b: 35, a: 1 },
    "lawn green": { r: 124, g: 252, b: 0, a: 1 },
    "chart reuse": { r: 127, g: 255, b: 0, a: 1 },
    "green yellow": { r: 173, g: 255, b: 47, a: 1 },
    "dark green": { r: 0, g: 100, b: 0, a: 1 },
    "green": { r: 0, g: 128, b: 0, a: 1 },
    "forest green": { r: 34, g: 139, b: 34, a: 1 },
    "lime": { r: 0, g: 255, b: 0, a: 1 },
    "lime green": { r: 50, g: 205, b: 50, a: 1 },
    "light green": { r: 144, g: 238, b: 144, a: 1 },
    "pale green": { r: 152, g: 251, b: 152, a: 1 },
    "dark sea green": { r: 143, g: 188, b: 143, a: 1 },
    "medium spring green": { r: 0, g: 250, b: 154, a: 1 },
    "spring green": { r: 0, g: 255, b: 127, a: 1 },
    "sea green": { r: 46, g: 139, b: 87, a: 1 },
    "medium aqua marine": { r: 102, g: 205, b: 170, a: 1 },
    "medium sea green": { r: 60, g: 179, b: 113, a: 1 },
    "light sea green": { r: 32, g: 178, b: 170, a: 1 },
    "dark slate gray": { r: 47, g: 79, b: 79, a: 1 },
    "teal": { r: 0, g: 128, b: 128, a: 1 },
    "dark cyan": { r: 0, g: 139, b: 139, a: 1 },
    "aqua": { r: 0, g: 255, b: 255, a: 1 },
    "cyan": { r: 0, g: 255, b: 255, a: 1 },
    "light cyan": { r: 224, g: 255, b: 255, a: 1 },
    "dark turquoise": { r: 0, g: 206, b: 209, a: 1 },
    "turquoise": { r: 64, g: 224, b: 208, a: 1 },
    "medium turquoise": { r: 72, g: 209, b: 204, a: 1 },
    "pale turquoise": { r: 175, g: 238, b: 238, a: 1 },
    "aqua marine": { r: 127, g: 255, b: 212, a: 1 },
    "powder blue": { r: 176, g: 224, b: 230, a: 1 },
    "cadet blue": { r: 95, g: 158, b: 160, a: 1 },
    "steel blue": { r: 70, g: 130, b: 180, a: 1 },
    "corn flower blue": { r: 100, g: 149, b: 237, a: 1 },
    "deep sky blue": { r: 0, g: 191, b: 255, a: 1 },
    "dodger blue": { r: 30, g: 144, b: 255, a: 1 },
    "light blue": { r: 173, g: 216, b: 230, a: 1 },
    "sky blue": { r: 135, g: 206, b: 235, a: 1 },
    "light sky blue": { r: 135, g: 206, b: 250, a: 1 },
    "midnight blue": { r: 25, g: 25, b: 112, a: 1 },
    "navy": { r: 0, g: 0, b: 128, a: 1 },
    "dark blue": { r: 0, g: 0, b: 139, a: 1 },
    "medium blue": { r: 0, g: 0, b: 205, a: 1 },
    "blue": { r: 0, g: 0, b: 255, a: 1 },
    "royal blue": { r: 65, g: 105, b: 225, a: 1 },
    "blue violet": { r: 138, g: 43, b: 226, a: 1 },
    "indigo": { r: 75, g: 0, b: 130, a: 1 },
    "dark slate blue": { r: 72, g: 61, b: 139, a: 1 },
    "slate blue": { r: 106, g: 90, b: 205, a: 1 },
    "medium slate blue": { r: 123, g: 104, b: 238, a: 1 },
    "medium purple": { r: 147, g: 112, b: 219, a: 1 },
    "dark magenta": { r: 139, g: 0, b: 139, a: 1 },
    "dark violet": { r: 148, g: 0, b: 211, a: 1 },
    "dark orchid": { r: 153, g: 50, b: 204, a: 1 },
    "medium orchid": { r: 186, g: 85, b: 211, a: 1 },
    "purple": { r: 128, g: 0, b: 128, a: 1 },
    "thistle": { r: 216, g: 191, b: 216, a: 1 },
    "plum": { r: 221, g: 160, b: 221, a: 1 },
    "violet": { r: 238, g: 130, b: 238, a: 1 },
    "magenta": { r: 255, g: 0, b: 255, a: 1 },
    "fuchsia": { r: 255, g: 0, b: 255, a: 1 },
    "orchid": { r: 218, g: 112, b: 214, a: 1 },
    "medium violet red": { r: 199, g: 21, b: 133, a: 1 },
    "pale violet red": { r: 219, g: 112, b: 147, a: 1 },
    "deep pink": { r: 255, g: 20, b: 147, a: 1 },
    "hot pink": { r: 255, g: 105, b: 180, a: 1 },
    "light pink": { r: 255, g: 182, b: 193, a: 1 },
    "pink": { r: 255, g: 192, b: 203, a: 1 },
    "antique white": { r: 250, g: 235, b: 215, a: 1 },
    "beige": { r: 245, g: 245, b: 220, a: 1 },
    "bisque": { r: 255, g: 228, b: 196, a: 1 },
    "blanched almond": { r: 255, g: 235, b: 205, a: 1 },
    "wheat": { r: 245, g: 222, b: 179, a: 1 },
    "corn silk": { r: 255, g: 248, b: 220, a: 1 },
    "lemon chiffon": { r: 255, g: 250, b: 205, a: 1 },
    "light golden rod yellow": { r: 250, g: 250, b: 210, a: 1 },
    "light yellow": { r: 255, g: 255, b: 224, a: 1 },
    "saddle brown": { r: 139, g: 69, b: 19, a: 1 },
    "sienna": { r: 160, g: 82, b: 45, a: 1 },
    "chocolate": { r: 210, g: 105, b: 30, a: 1 },
    "peru": { r: 205, g: 133, b: 63, a: 1 },
    "sandy brown": { r: 244, g: 164, b: 96, a: 1 },
    "burly wood": { r: 222, g: 184, b: 135, a: 1 },
    "tan": { r: 210, g: 180, b: 140, a: 1 },
    "rosy brown": { r: 188, g: 143, b: 143, a: 1 },
    "moccasin": { r: 255, g: 228, b: 181, a: 1 },
    "navajo white": { r: 255, g: 222, b: 173, a: 1 },
    "peach puff": { r: 255, g: 218, b: 185, a: 1 },
    "misty rose": { r: 255, g: 228, b: 225, a: 1 },
    "lavender blush": { r: 255, g: 240, b: 245, a: 1 },
    "linen": { r: 250, g: 240, b: 230, a: 1 },
    "old lace": { r: 253, g: 245, b: 230, a: 1 },
    "papaya whip": { r: 255, g: 239, b: 213, a: 1 },
    "sea shell": { r: 255, g: 245, b: 238, a: 1 },
    "mint cream": { r: 245, g: 255, b: 250, a: 1 },
    "slate gray": { r: 112, g: 128, b: 144, a: 1 },
    "light slate gray": { r: 119, g: 136, b: 153, a: 1 },
    "light steel blue": { r: 176, g: 196, b: 222, a: 1 },
    "lavender": { r: 230, g: 230, b: 250, a: 1 },
    "floral white": { r: 255, g: 250, b: 240, a: 1 },
    "alice blue": { r: 240, g: 248, b: 255, a: 1 },
    "ghost white": { r: 248, g: 248, b: 255, a: 1 },
    "honeydew": { r: 240, g: 255, b: 240, a: 1 },
    "ivory": { r: 255, g: 255, b: 240, a: 1 },
    "azure": { r: 240, g: 255, b: 255, a: 1 },
    "snow": { r: 255, g: 250, b: 250, a: 1 },
    "black": { r: 0, g: 0, b: 0, a: 1 },
    "dim gray": { r: 105, g: 105, b: 105, a: 1 },
    "dim grey": { r: 105, g: 105, b: 105, a: 1 },
    "gray": { r: 128, g: 128, b: 128, a: 1 },
    "grey": { r: 128, g: 128, b: 128, a: 1 },
    "dark gray": { r: 169, g: 169, b: 169, a: 1 },
    "dark grey": { r: 169, g: 169, b: 169, a: 1 },
    "silver": { r: 192, g: 192, b: 192, a: 1 },
    "light gray": { r: 211, g: 211, b: 211, a: 1 },
    "light grey": { r: 211, g: 211, b: 211, a: 1 },
    "gainsboro": { r: 220, g: 220, b: 220, a: 1 },
    "white smoke": { r: 245, g: 245, b: 245, a: 1 },
    "white": { r: 255, g: 255, b: 255, a: 1 }
}