import {setLinks} from "../linker/setlinks"
import {Lex} from "../common"
import {Rivet} from "../rivet"

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

class Cassette extends Rivet{
    constructor(parent, element, controller) {
        
        super(parent, element);

        this.controller = controller;
        this.prop = this.data.prop;
        this.import_prop = this.data.iprop;
        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.lvl = 0;
        this.is = 1;
        this.data_cache = null;
        this.children = [];
        
        if(this.element.tagName == "A")
            this.processLink(this.element);

        /* import data into basic JavaScript object */
        ImportDataFromDataSet(this.data, element.dataset);
    }    

    destructor() {
        this.parent = null;

        this.children.forEach((sc)=>{
            sc.destructor();
        })

        if (this.controller)
            this.controller.destructor();

        if(this.element.tagName == "A")
            this.destroyLink(this.element);

        this.children = null;

        this.element = null;

        this.data = null;

        this.data_cache = null;

        this.controller = null;
    }

    /**
        This will attach a function to the link element to intercept and process data from the cassette.
    */
    processLink(element, link){

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
                    real_href += this[prop] || this.data_cache[prop];

                    if(lex.token.text != "}")
                        console.warn(`incorrect value found in url ${href}`)
                }else{
                    real_href += lex.token.text;
                }

                lex.next();
            }

            this.bubbleLink(real_href);
            return true;
        });

        element.onmouseover = (()=>{
            let href = element.href;
            let real_href = "";
            let lex = Lex(href);
            while(lex.token){
                if(lex.token.text == "{"){
                    lex.next();
                    let prop = lex.token.text;
                    lex.next();

                    real_href += this[prop] || this.data_cache[prop];

                    if(lex.token.text != "}")
                        console.warn(`incorrect value found in url ${href}`)
                }else{
                    real_href += lex.token.text;
                }

                lex.next();
            }
        })
    }

    destroyLink(element){
        element.onclick = null
        element.onmouseover = null;
    }

    update(data) {
        if (data){
            if (this.prop) {
                this.element.innerHTML = data[this.prop];
                this[this.prop] = data[this.prop];
            }else{
                this.data_cache = data;
            }
        }
    }

    setModel(model) {
        if (this.controller)
            this.controller.setModel(model);

        this.children.forEach((e)=>{
            if(e.is == 1)
                e.setModel(model);
        })
    }

    updateDimensions() {
        var d = this.element.getBoundingClientRect();

        this.width = d.width;
        this.height = d.height;
        this.top = d.top;
        this.left = d.left;

        this.children.forEach((e)=>{
            e.updateDimensions();
        })
    }

    hide() {
        if (this.parent) this.parent.hide();
    }

    setActivating(){
        if(this.parent)
            this.parent.setActivating();
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
