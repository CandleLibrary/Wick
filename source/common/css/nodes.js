/**
 * Used to _bind_ a rule to a CSS selector.
 * @param      {string}  selector        The raw selector string value
 * @param      {array}  selector_array  An array of selector group identifiers.
 * @memberof module:wick~internals.css
 * @alias CSSSelector
 */
class CSSSelector {

    constructor(selector /* string */ , selector_array /* array */ ) {

        /**
         * The raw selector string value
         * @package
         */
        this.v = "";

        this.v = selector;

        /**
         * Array of separated selector strings in reverse order.
         * @package
         */
        this.a = [];

        this.a = selector_array;

        /**
         * The CSSRule to _bind_ to.
         * @package
         */
        this.r = null;
    }

    /**
     * Returns a string representation of the object.
     * @return     {string}  String representation of the object.
     */
    toString() {
        let str = `${this.v} {`

        if (this.r) {
            let rule = this.r;
            for (let n in this.r) {
                str += this.r.toString() + ";";
            }
        }
        return str + "}";
    }

}

/**
 * Holds a set of rendered CSS properties.
 * @memberof module:wick~internals.css
 * @alias CSSRule
 */
class CSSRule {
    constructor() {
        /**
         * Collection of properties held by this rule.
         * @public
         */
        this.props = {};
        this.LOADED = false;
    }

    addProperty(prop) {
        if (prop)
            this.props[prop.name] = prop.value;
    }

    toString() {
        let str = [];

        for (let a in this.props) {
            if (Array.isArray(this.props[a]))
                str.push(a.replace(/\_/g, "-"), ":", this.props[a].join(" "), ";");
            else
                str.push(a.replace(/\_/g, "-"), ":", this.props[a].toString(), ";");
        }

        return str.join("") //JSON.stringify(this.props).replace(/\"/g, "").replace(/\_/g, "-");
    }

    merge(rule) {
        if (rule.props) {
            for (let n in rule.props) 
                this.props[n] = rule.props[n];
            this.LOADED = true;
        }
    }

    get _wick_type_() { return 0; }

    set _wick_type_(v) {}
}

export { CSSRule, CSSSelector }