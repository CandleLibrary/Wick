export function replaceEscapedHTML(string) {
    let out_string = string.toString();

    /*  https://en.wikipedia.org/wiki/Character_encodings_in_HTML
        &amp;   → & (ampersand, U+0026)
        &lt;    → < (less-than sign, U+003C)
        &gt;    → > (greater-than sign, U+003E)
        &quot;  → " (quotation mark, U+0022)
        &apos;  → ' (apostrophe, U+0027)
    */
    
    out_string = out_string.split(/(\&\#*[a-zA-Z0-1]+;)/g).map(replaceEncoding).join("");
    
    return out_string;
}

const EncodingMap = new Map([
    ["&amp;", "&"],
    ["&lt;", "<"],
    ["&gt;", ">"],
    ["&quot;", '"'],
    ["&apos;", "'"],
    ["&nbsp;", "    "]
]);

function replaceEncoding(str) {
    let rep = EncodingMap.get(str);
    if (str[0] == "&" && str.slice(-1) == ";") {
        if (rep)
            return rep;
        else {
            if (str[2] == "x")
                return String.fromCharCode(parseInt(str.slice(2, -1), 16));
            else
                return String.fromCharCode(parseInt(str.slice(2, -1)));
        }
    }
    return str;
}
