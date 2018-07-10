import { Input } from "./input"

import { Cassette } from "./cassette"

export class Form extends Cassette {
    constructor(parent, element, d, p) {
        //Scan the element and look for inputs that can be mapped to the 
        super(parent, element, d, p);

        this.router = p.router;

        this.submitted = false;
        this.schema = null;

        element.addEventListener("submit", (e) => {
            console.log(e.target, this, parent)

            if (!this.submitted)
                this.submit();

            this.submitted = true;

            e.preventDefault();

            return false;
        })
    }

    dstr() {

    }

    accepted(result) {
        result.text().then((e) => {
            this.router.loadPage(
                this.router.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")),
                false
            );
        })
    }

    rejected(result) {
        result.text().then((e) => {
            this.router.loadPage(
                this.router.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")),
                false
            );
        })
    }

    load(model) {

        if (model)
            this.schema = model.schema;

        super.load(model);
    }

    update(data) {

    }

    submit() {

        let url = this.ele.action;

        var form_data = (new FormData(this.ele));
        if (this.schema) {
            for (let i = 0, l = this.children.length; i < l; i++) {
                let child = this.children[i];

                if (child instanceof Input) {
                    let name = child.ele.name;
                    let prop = child.prop;
                    let scheme = this.schema[prop];
                    if (scheme && prop) {
                        let val = scheme.string(child.val);
                        form_data.set(name, val)
                        console.log(prop, name, val, child.val);
                    }
                }
            }
        }

        debugger
        fetch(url, {
            method: "post",
            credentials: "same-origin",
            body: form_data,
        }).then((result) => {

            if (result.status != 200)
                this.rejected(result);
            else
                this.accepted(result)

        }).catch((e) => {
            this.rejected(e);
        })



        console.log("Wick Form Submitted", url, form_data)


    }
}