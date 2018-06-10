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

        /**
        	A case that will handle the acceptance of the form submission 
        */
        this.accept_case = null;

        /**
        	A case that will handle the rejection of the form submission 
        */
        this.reject_case = null;

        element.addEventListener("submit", (e) => {
            this.submit();
            e.preventDefault();
            return false;
        })
    }

    destructor() {

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

        	if(result.status != 200){
        		result.text().then((e)=>{
        			GLOBAL.linker.loadPage(
                        GLOBAL.linker.loadNewPage(url, (new DOMParser()).parseFromString(e, "text/html")), 
                        false
                    );
        		})
        		return;
        	}

            if (this.data.accept_url) {
                if (this.data.accept_url == "back"){
                    window.history.back();
                }
                else {
                	history.pushState({}, "ignored title", `${this.data.accept_url}`);
                    window.onpopstate();
                }
            }
        }).catch(() => {
        	console.error("TODO: Form submission failed!")
        })
    }
}

export {
    Form
}