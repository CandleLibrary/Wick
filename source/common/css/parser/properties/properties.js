import { Lexer } from "../../../string_parsing/lexer"

import { props, types } from "./props_and_types"

export function GetProperty(lexer, rules) {
    let rule = { name: "" };

    let name = lexer.tx.replace(/\-/g, "_");

    lexer.n().a(":");

    let p = lexer.pk;

    while ((p.tx !== "}" && p.tx !== ";")) { p.n() }

    let value = p.slice(lexer.pos);

    let parser = parseRule(name);

    if (parser)
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (!rule.props) rule.props = {};
            parser.parse(value, rule.props);
        }
    else
        console.warn(`Unable to get parser for css property ${name}`)

    lexer.sync();

    if (lexer.tx == ";") lexer.n();

    return rule;
}

function parseRule(value) {

    let prop = props[value];

    if (prop) {

        if (typeof(prop) == "string")
            prop = props[value] = CreateNotationParser(prop, value);

        return prop;
    }

    return null;
}

class NR { //Notation Rule

    constructor() {

        this.r = [NaN, NaN];
        this.terms = [];
        this.prop = null;
    }

    isRepeating() {

        return !(isNaN(this.r[0]) && isNaN(this.r[1]));
    }

    parse(lx, rule, out_val) {

        if (typeof(lx) == "string")
            lx = new Lexer(lx);

        let r = out_val || { v: null },
            bool = true;

        let start = this.r[0] || 1;

        let end = this.r[1] || 1;

        for (let j = 0; j < end && !lx.END; j++) {

            for (let i = 0, l = this.terms.length; i < l; i++) {
                bool = this.terms[i].parse(lx, rule, r);
                if (!bool) break;
            }

            if (!bool) {
                if (j < start) {
                    if (this.prop && r.v)
                        rule[this.prop] = r.v;
                    return false;
                }
            }
        }

        if (this.prop && r.v)
            rule[this.prop] = r.v;
        return true;
    }
}

class NEED extends NR {
    parse(lx, rule, out_val) {
        if (typeof(lx) == "string")
            lx = new Lexer(lx);

        let r = out_val || { v: null },
            bool = false;

        let start = this.r[0] || 1;

        let end = this.r[1] || 1;

        for (let j = 0; j < end && !lx.END; j++) {
            bool = false;

            for (let i = 0, l = this.terms.length; i < l; i++)
                if (this.terms[i].parse(lx, rule, r)) bool = true;

            if (!bool && j < start) {
                if (this.prop && r.v)
                    rule[this.prop] = r.v;
                return false;
            }
        }

        if (this.prop)
            rule[this.prop] = r.v;

        return true;
    }
}

class OR extends NR {
    parse(lx, rule, out_val) {
        if (typeof(lx) == "string")
            lx = new Lexer(lx);

        let r = out_val || { v: null },
            bool = false;

        let start = this.r[0] || 1;

        let end = this.r[1] || 1;

        for (let j = 0; j < end && !lx.END; j++) {
            bool = false;

            for (let i = 0, l = this.terms.length; i < l; i++) {
                bool = this.terms[i].parse(lx, rule, r);
                if (bool) break;
            }

            if (!bool) {
                if (j < start) {
                    if (this.prop && r.v)
                        rule[this.prop] = r.v;
                    return false;
                }
            }
        }

        if (this.prop)
            rule[this.prop] = r.v;

        return true;
    }
}

class ValueTerm {

    constructor(value) {
        this.value = null;

        if (!(this.value = types[value]))
            this.value = parseRule(value);

        this.prop = "";

        if (!this.value)
            return new LiteralTerm(value);
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
                        if (Array.isArray(rn.v))
                            r.v = r.v.concat(rn.v);
                        else
                            r.v.push(rn.v);
                    } else {
                        if (Array.isArray(rn.v))
                            r.v = ([r.v]).concat(rn.v);
                        else
                            r.v = [r.v, rn.v];
                    }
                } else
                    r.v = rn.v;

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

function CreateNotationParser(notation, name) {
    let l = new Lexer(notation);

    let n = ParseNotation(l);

    if (n instanceof NR && n.terms.length == 1)
        n = n.terms[0];

    n.prop = name;

    return n;
}

function ParseNotation(l, super_term = false, group = false, need_group = false) {
    let term, nt;

    while (!l.END) {
        switch (l.tx) {
            case "]":
                if (term) return term;
                else throw new Error("Expected to have term before \"]\"");
            case "[":
                if (term) return term;
                term = ParseNotation(l.n());
                l.a("]");
                break;
            case "|":
                {
                    if (l.pk.tx == "|") {

                        if (need_group)
                            return term;

                        nt = new NEED();

                        nt.terms.push(term);

                        l.sync().n();

                        while (!l.END) {
                            nt.terms.push(ParseNotation(l, super_term, group, true));
                            if (l.tx !== "|" || l.pk.tx !== "|") break;
                            l.a("|").a("|");
                        }

                        return nt;

                    } else {
                        if (group) {
                            return term;
                        }

                        nt = new OR();

                        nt.terms.push(term);

                        l.n();

                        while (!l.END) {
                            nt.terms.push(ParseNotation(l, super_term, true, need_group));
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
                term.r[1] = parseInt(l.n().a(",").tx);
                l.n().a("}");
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
                term.r[0] = 0;
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
                    let v = ParseNotation(l, true);
                    term = Jux(term, v);
                } else {
                    let v = new ValueTerm(l.n().tx);
                    l.n().a(">");
                    term = v;
                }
                break;
            default:
                if (term) {
                    if (term instanceof NR && term.isRepeating()) term = Jux(new NR, term);
                    let v = ParseNotation(l, true);
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