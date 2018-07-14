//import { Color } from "./types/type"

const types = {
    color: Color
}

const rules = {
    color: "<color>",
    "background_color": "<color>|transparent"
}

export function GetProperty(lexer) {

    let name = lexer.tx;

    lexer.n().a(":");

    let p = lexer.pk;

    while (p.n() && (p.tx !== "}" || p.tx !== ";")) {}

    let value = p.slice(lexer.pos);

    lexer.sync();

    if (lexer.tx == ";")
        lexer.n();

    return {
        name,
        value
    }

    return null;
}