import { Lexer } from "../../../string_parsing/lexer"

import { props, virtual_props, types } from "./props_and_types"

export function GetProperty(lexer, rule) {

    let name = lexer.tx.replace(/\-/g, "_");
    
    lexer.n().a(":");

    let p = lexer.pk;

    while ((p.tx !== "}" && p.tx !== ";")) { p.n() }

    const value = p.slice(lexer.pos);

    try {
        const IS_VIRTUAL = { is: false }
        const parser = getPropertyParser(name, IS_VIRTUAL);
        if (parser && !IS_VIRTUAL.is) {
            if (!rule.props) rule.props = {};
            parser.parse(value, rule.props);
        } //else
            //console.warn(`Unable to get parser for css property ${name}`)
    } catch (e) {
        console.log(e);
    }

    lexer.sync();

    if (lexer.tx == ";") lexer.n();
}

function getPropertyParser(value, IS_VIRTUAL = { is: false }) {

    let prop = props[value];

    if (prop) {

        if (typeof(prop) == "string")
            prop = props[value] = CreatePropertyParser(prop, value);

        return prop;
    }

    prop = virtual_props[value];

    if (prop) {

        IS_VIRTUAL.is = true;

        if (typeof(prop) == "string")
            prop = virtual_props[value] = CreatePropertyParser(prop, "");

        return prop;
    }

    return null;
}

class NR { //Notation Rule

    constructor() {

        this.r = [NaN, NaN];
        this.terms = [];
        this.prop = null;
        this.virtual = false;
    }

    sp(value, rule) { //Set Property
        if (this.prop)
            if (value)
                if (Array.isArray(value) && value.length === 1 && Array.isArray(value[0]))
                    rule[this.prop] = value[0];
                else
                    rule[this.prop] = value;
    }

    isRepeating() {
        return !(isNaN(this.r[0]) && isNaN(this.r[1]));
    }

    parse(lx, rule, out_val) {
        if (typeof(lx) == "string")
            lx = new Lexer(lx);

        let r = out_val || { v: null },
            start = isNaN(this.r[0]) ? 1 : this.r[0],
            end = isNaN(this.r[1]) ? 1 : this.r[1];

        return this.___(lx, rule, out_val, r, start, end)
    }

    ___(lx, rule, out_val, r, start, end) {
        let bool = true;
        for (let j = 0; j < end && !lx.END; j++) {

            for (let i = 0, l = this.terms.length; i < l; i++) {
                bool = this.terms[i].parse(lx, rule, r);
                if (!bool) break;
            }

            if (!bool) {

                this.sp(r.v, rule);

                if (j < start)
                    return false;
                else
                    return true;
            }
        }

        this.sp(r.v, rule);

        return true;
    }
}

class AND extends NR {
    ___(lx, rule, out_val, r, start, end) {
        let bool = false;
        outer:
            for (let j = 0; j < end && !lx.END; j++) {
                for (let i = 0, l = this.terms.length; i < l; i++)
                    if (!this.terms[i].parse(lx, rule, r)) return false;
            }

        this.sp(r.v, rule)

        return true;
    }
}

class OR extends NR {
    ___(lx, rule, out_val, r, start, end) {
        let bool = false;

        for (let j = 0; j < end && !lx.END; j++) {
            bool = false;

            for (let i = 0, l = this.terms.length; i < l; i++)
                if (this.terms[i].parse(lx, rule, r)) bool = true;

            if (!bool && j < start) {
                this.sp(r.v, rule);
                return false;
            }
        }

        this.sp(r.v, rule);

        return true;
    }
}

class ONE_OF extends NR {
    ___(lx, rule, out_val, r, start, end) {
        let bool = false;

        for (let j = 0; j < end && !lx.END; j++) {
            bool = false;

            for (let i = 0, l = this.terms.length; i < l; i++) {
                bool = this.terms[i].parse(lx, rule, r);
                if (bool) break;
            }

            if (!bool)
                if (j < start) {
                    this.sp(r.v, rule);
                    return false;
                }
        }

        this.sp(r.v, rule);

        return true;
    }
}

class ValueTerm {

    constructor(value) {
        this.value = null;
        const IS_VIRTUAL = { is: false }
        if (!(this.value = types[value]))
            this.value = getPropertyParser(value, IS_VIRTUAL);

        this.prop = "";

        if (!this.value)
            return new LiteralTerm(value);

        if (this.value instanceof NR && IS_VIRTUAL.is) {
            this.virtual = true;
        }
    }

    parse(l, rule, r) {
        if (typeof(l) == "string")
            l = new Lexer(l);

        let rn = { v: null };

        let v = this.value.parse(l, rule, rn)

        if (rn.v) {
            if (r)
                if (r.v) {
                    if (Array.isArray(r.v)) {
                        if (Array.isArray(rn.v) && !this.virtual)
                            r.v = r.v.concat(rn.v);
                        else
                            r.v.push(rn.v);
                    } else {
                        if (Array.isArray(rn.v) && !this.virtual)
                            r.v = ([r.v]).concat(rn.v);
                        else
                            r.v = [r.v, rn.v];
                    }
                } else
                    r.v = (this.virtual) ? [rn.v] : rn.v;

            if (this.prop)
                rule[this.prop] = rn.v;

            return true;

        } else if (v) {
            if (r)
                if (r.v) {
                    if (Array.isArray(r.v))
                        r.v.push(v);
                    else
                        r.v = [r.v, v];
                } else
                    r.v = v;

            if (this.prop)
                rule[this.prop] = v;

            return true;
        } else
            return false;
    }
}

class LiteralTerm {

    constructor(value) {
        this.value = value;
        this.prop = null;
    }

    parse(l, rule, r) {

        if (typeof(l) == "string")
            l = new Lexer(l);

        let v = l.tx;
        if (v == this.value) {
            l.n();

            if (r)
                if (r.v) {
                    if (Array.isArray(r.v))
                        r.v.push(v);
                    else {
                        let t = r.v;
                        r.v = [t, v];
                    }
                } else
                    r.v = v;

            if (this.prop)
                rule[this.prop] = v;

            return true;
        }
        return false;
    }
}

class SymbolTerm extends LiteralTerm {
    parse(l, rule, r) {
        if (typeof(l) == "string")
            l = new Lexer(l);

        if (l.tx == this.value) {
            l.n();
            return true;
        }

        return false;
    }
};

function CreatePropertyParser(notation, name) {
    const l = new Lexer(notation);
    const important = { is: false };

    let n = ParseGrammer(l);

    if (n instanceof NR && n.terms.length == 1)
        n = n.terms[0];

    n.prop = name;
    n.IMP = important.is;

    return n;
}

function ParseGrammer(l, super_term = false, group = false, need_group = false, and_group = false, important) {
    let term, nt;

    while (!l.END) {
        switch (l.tx) {
            case "]":
                if (term) return term;
                else throw new Error("Expected to have term before \"]\"");
            case "[":
                if (term) return term;
                term = ParseGrammer(l.n());
                l.a("]");
                break;
            case "&":
                if (l.pk.tx == "&") {
                    if (and_group)
                        return term;

                    nt = new AND();

                    nt.terms.push(term);

                    l.sync().n();

                    while (!l.END) {
                        nt.terms.push(ParseGrammer(l, super_term, group, need_group, true, important));
                        if (l.tx !== "&" || l.pk.tx !== "&") break;
                        l.a("&").a("&");
                    }

                    return nt;
                }
            case "|":
                {
                    if (l.pk.tx == "|") {

                        if (need_group)
                            return term;

                        nt = new OR();

                        nt.terms.push(term);

                        l.sync().n();

                        while (!l.END) {
                            nt.terms.push(ParseGrammer(l, super_term, group, true, and_group, important));
                            if (l.tx !== "|" || l.pk.tx !== "|") break;
                            l.a("|").a("|");
                        }

                        return nt;

                    } else {
                        if (group) {
                            return term;
                        }

                        nt = new ONE_OF();

                        nt.terms.push(term);

                        l.n();

                        while (!l.END) {
                            nt.terms.push(ParseGrammer(l, super_term, true, need_group, and_group, important));
                            if (l.tx != "|") break;
                            l.a("|");
                        }

                        return nt;
                    }
                }
                break;
            case "{":
                term = Jux(term);
                term.r[0] = parseInt(l.n().tx);
                if (l.n().tx == ",") {
                    l.n();
                    if (l.n().tx == "}")
                        term.r[1] = Infinity;
                    else {
                        term.r[1] = parseInt(l.tx);
                        l.n();
                    }
                } else
                    term.r[1] = term.r[0];
                l.a("}");
                if (super_term) return term;
                break
            case "*":
                term = Jux(term);
                term.r[0] = 0;
                term.r[1] = Infinity;
                l.n();
                if (super_term) return term;
                break
            case "+":
                term = Jux(term);
                term.r[0] = 1;
                term.r[1] = Infinity;
                l.n();
                if (super_term) return term;
                break
            case "?":
                term = Jux(term);
                term.r[0] = 0;
                term.r[1] = 1;
                l.n();
                if (super_term) return term;
                break
            case "#":
                term = Jux(term);
                term.terms.push(new SymbolTerm(","));
                term.r[0] = 1;
                term.r[1] = Infinity;
                l.n();
                if (l.tx == "{") {
                    term.r[0] = parseInt(l.n().tx);
                    term.r[1] = parseInt(l.n().a(",").tx);
                    l.n().a("}");
                }
                if (super_term) return term;
                break
            case "<":
                let v;

                if (term) {
                    if (term instanceof NR && term.isRepeating()) term = Jux(new NR, term);
                    let v = ParseGrammer(l, true);
                    term = Jux(term, v);
                } else {
                    let v = new ValueTerm(l.n().tx);
                    l.n().a(">");
                    term = v;
                }
                break;
            case "!":
                /* https://www.w3.org/TR/CSS21/cascade.html#important-rules */

                l.n().a("important");
                important.is = true;
                break;
            default:
                if (term) {
                    if (term instanceof NR && term.isRepeating()) term = Jux(new NR, term);
                    let v = ParseGrammer(l, true);
                    term = Jux(term, v);
                } else {
                    let v = (l.ty == l.types.symbol) ? new SymbolTerm(l.tx) : new LiteralTerm(l.tx);
                    l.n();
                    term = v;
                }
        };
    }
    return term;
}

function Jux(term, new_term) {
    if (term) {
        if (!(term instanceof NR)) {
            let nr = new NR();
            nr.terms.push(term);
            term = nr;
        }
        if (new_term) term.terms.push(new_term);
        return term;
    }
    return new_term;
}