import {
    setLinks
} from "../../linker/setlinks"
import {
    Lex
} from "../../common"
import {
    Rivet
} from "../rivet"

/**
    Deals with specific properties on a model. 
*/

class Cassette extends Rivet {
    constructor(parent, element, presets, data) {

        super(parent, element, presets, data);

        this.prop = this.data.prop;

        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.lvl = 0;
        this.is = 1;
        this.data_cache = null;
        this.children = [];

        if (this.element.tagName == "A")
            this.processLink(this.element);
    }

    destructor() {

        if (this.element.tagName == "A")
            this.destroyLink(this.element);

        this.data_cache = null;

        super.destructor();
    }

    /**
        This will attach a function to the link element to intercept and process data from the cassette.
    */
    processLink(element, link) {

        if (element.origin !== location.origin) return;

        if (!element.onclick) element.onclick = ((href, a, __function__) => (e) => {
            e.preventDefault();
            if (__function__(href, a)) e.preventDefault();
        })(element.href, element, (href, a) => {

            let hashtag = href.includes("#");

            let real_href = "";

            let lex = Lex(href);

            while (lex.token) {

                if (lex.token.text == "{") {
                    lex.next();
                    let prop = lex.token.text;
                    lex.next();
                    real_href += this[prop] || this.data_cache[prop];

                    if (lex.token.text != "}")
                        console.warn(`incorrect value found in url ${href}`)
                } else {
                    real_href += lex.token.text;
                }

                lex.next();
            }

            if (hashtag)
                this.export();
            this.bubbleLink(real_href);

            return true;
        });

        element.onmouseover = (() => {

            let href = element.href;

            let real_href = "";

            let lex = Lex(href);

            while (lex.token) {
                if (lex.token.text == "{") {
                    lex.next();
                    let prop = lex.token.text;
                    lex.next();

                    real_href += this[prop] || this.data_cache[prop];

                    if (lex.token.text != "}")
                        console.warn(`incorrect value found in url ${href}`)
                } else {
                    real_href += lex.token.text;
                }

                lex.next();
            }
        })
    }

    destroyLink(element) {

        element.onclick = null
        element.onmouseover = null;
    }


    update(data) {

        super.__updateExports__(data);

        if (data) {

            if (this.prop) {
                this.element.innerHTML = data[this.prop];
                this[this.prop] = data[this.prop];
            } else {
                this.data_cache = data;
            }
        }
    }

    import (data) {

    }

    load(model) {

        this.children.forEach((e) => {
            e.load(model);
        })

        if (this.data.model)
            model.addView(this)
    }

    updateDimensions() {

        var d = this.element.getBoundingClientRect();

        this.width = d.width;
        this.height = d.height;
        this.top = d.top;
        this.left = d.left;

        super.updateDimensions();
    }
}

class CloseCassette extends Cassette {
    constructor(parent, element, d, p) {
        super(parent, element, d, p);

        this.element.addEventListener("click", () => {
            parent.hide(); //Or URL back;
        })
    }
}

export {
    Cassette,
    CloseCassette,
    ImportDataFromDataSet
}