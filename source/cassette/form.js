import {
	GLOBAL 
}from "../global"

import {
    Cassette
} from "./cassette"

class Form extends Cassette {
    constructor(parent, element) {
        //Scan the element and look for inputs that can be mapped to the 
        super(parent, element);

        this.submitted = false;

        element.addEventListener("submit", (e) => {
            if(!this.submitted) 
                this.submit();
            this.submitted = true;
            e.preventDefault();
            return false;
        })
    }

    destructor() {

    }

    accepted(result){
        result.text().then((e)=>{
            GLOBAL.linker.loadPage(
                GLOBAL.linker.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")), 
                false
            );
        })
    }

    rejected(result){
        result.text().then((e)=>{
            GLOBAL.linker.loadPage(
                GLOBAL.linker.loadNewPage(result.url, (new DOMParser()).parseFromString(e, "text/html")), 
                false
            );
        })
    }

    update(data) {

    }

    submit() {

        let url = this.element.action;

        var form_data = (new FormData(this.element));

        console.log("Wick Form Submitted", url, form_data)

        fetch(url, {
            method: "post",
            credentials: "same-origin", 
            body: form_data,
        }).then((result) => {

        	if(result.status != 200)
        		this.rejected(result);
        	else
                this.accepted(result)

        }).catch((e) => {
            this.rejected(e);
        })
    }
}

export {
    Form
}