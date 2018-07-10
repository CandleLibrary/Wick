import {
    Controller
} from "../controller"

/**
	WARNING - DEBUG USE ONLY

	This constructor when used with the case data-template_model and data-schema attributes will use the contents of a template object to 
	insert data into a Model. Contents of the  template must either be JSON format string data, or a textarea, with a string value that is in JSON format.
	This allows for modification of data in the string  
*/

class DataTemplate extends Controller {
    constructor(element, model, parent_element) {
        super();

        console.warn("Model data should not be set by DataTemplates in production. Use HTTP API methods for production environments.")

        if (element.tagName != "TEMPLATE") {
            console.warn(`Element with id ${element.id} cannot be used as a Model Template as it's tag type is <${element.tagName}> and not <TEMPLATE>`);
            return {};
        }


        this.text_element = null;

        this.setModel(model);

        let content = document.importNode(element.content, true);

        if (content.firstElementChild && content.firstElementChild.tagName == "TEXTAREA") {
            this.text_element = content.firstElementChild;

            parent_element.appendChild(this.text_element);

            this.text_element.addEventListener("change", () => {
                try {
                    let json_data = JSON.parse(this.text_element.value);

                    if (json_data)
                        this.set(json_data);
                } catch (e) {}
            })

            try {
                let json_data = JSON.parse(this.text_element.value);

                if (json_data)
                    this.set(json_data);

            } catch (e) {}
            
        } else {
            try {
                let data = content.textContent;
                let json_data = JSON.parse(data);
                this.set(json_data);
            } catch (e) {}
            return {};
        }
    }

    destructor() {
        if (this.text_element) {

        }
        this.text_element = null;
        super.destructor();
    }
}

export {
    DataTemplate
}