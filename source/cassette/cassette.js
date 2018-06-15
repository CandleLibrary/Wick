import {setLinks} from "../linker/setlinks"
import {Lex} from "../common"

function ImportDataFromDataSet(data_object, data_set_object, element) {
    if(element){
        for (let prop in data_set_object) {
            data_object[prop] = data_set_object[prop];
            element.removeAttribute(`data-${prop}`);
        }
    }else{
        for (let prop in data_set_object) {
            data_object[prop] = data_set_object[prop];
        }
    }
}

class Cassette {
    constructor(parent, element, controller) {
        this.parent = parent;
        this.controller = controller;
        this.element = element
        this.prop = element.dataset.prop;
        this.import_prop = element.dataset.iprop;
        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.data = {};
        
        if(this.element.tagName == "A")
            this.processLink(this.element);

        /* import data into basic JavaScript object */
        ImportDataFromDataSet(this.data, element.dataset);

    }
    /**
        This will attach a function to the link element to intercept and process data from the cassette.
    */
    processLink(element){

        if (element.origin !== location.origin) return;

        if (!element.onclick) element.onclick = ((href, a, __function__) => (e) => {
            e.preventDefault();
            if (__function__(href, a)) e.preventDefault();
        })(element.href, element, (href, a)=>{
            let real_href = "";
            let lex = Lex(href);
            while(lex.token){
                if(lex.token.text == "{"){
                    lex.next();
                    let prop = lex.token.text;
                    lex.next();

                    real_href += this[prop];

                    if(lex.token.text != "}")
                        console.warn(`incorrect value found in url ${href}`)
                }else{
                    real_href += lex.token.text;
                }

                lex.next();
            }

            history.pushState({}, "ignored title", real_href);
            window.onpopstate();
            return true;
        });

        element.onmouseover = (()=>{
            let href = element.href;
            let real_href = "";
            let lex = Lex(href);
            while(lex.token){
                console.log(lex.token.text)
                if(lex.token.text == "{"){
                    lex.next();
                    let prop = lex.token.text;
                    lex.next();

                    real_href += this[prop];

                    if(lex.token.text != "}")
                        console.warn(`incorrect value found in url ${href}`)
                }else{
                    real_href += lex.token.text;
                }

                lex.next();
            }
            console.log(href, real_href)
        })
    }

    update(data) {
        if (data)
            if (this.prop) {
                this.element.innerHTML = data[this.prop];
            }
    }

    setModel(model) {
        if (this.controller)
            this.controller.setModel(model);
    }

    destructor() {
        this.parent = null;

        if (this.controller)
            this.controller.destructor();

        this.controller = null;
    }

    updateDimensions() {
        var d = this.element.getBoundingClientRect();

        this.width = d.width;
        this.height = d.height;
        this.top = d.top;
        this.left = d.left;
    }

    hide() {
        if (this.parent) this.parent.hide();
    }
}

class CloseCassette extends Cassette {
    constructor(parent, element, controller) {
        super(parent, element, controller);

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
