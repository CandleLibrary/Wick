/**
 * @param      {string}  selector        The raw selector string value
 * @param      {array}  selector_array  The selector array
 * @memberof module:wick~internals.css
 * @alias CSSSelector
 */
class CSSSelector {

    /**
     * Constructs the object.
     *
     
     */
    constructor(selector, selector_array) {

        /**
         * The raw selector string value
         */
        this.v = "";
        
        this.v = selector;

        /**
         * Array of separated selector strings in reverse order.
         */
        this.a = [];

        this.a = selector_array;

        /**
         * The CSSRule to bind to.
         */
        this.r = null;
    }

    toString() {

    }
}
/**
 * Holds a set of CSS propertios.
 * @param      {string}  selector        The raw selector string value
 * @param      {array}  selector_array  The selector array
 * @memberof module:wick~internals.css
 * @alias CSSRule
 */
class CSSRule {

    constructor(selector, selector_array) {
        this.props ={} ;
    }

    addProperty(prop) {
        if (prop)
            this.props[prop.name] = prop.value;
    }

    toString() {

    }
}

export { CSSRule,CSSSelector }

