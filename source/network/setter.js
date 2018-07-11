import {
    View
} from "../view/view"
/**
 * This Class is responsible for handling requests to the server. It can act as a controller to specifically pull data down from the server and push into data members.
 *
 * {name} Requester
 */
export class Setter extends View {
    constructor(url) {
        super();
        this.url = url;
    }

    destroy() {
        super.destroy();
    }

    set(request_object) {

        var url = "http://" + window.location.host + this.url + ( (request_object) ? ("?" + this.__process_url__(request_object)) : "");

        fetch(url, 
        { 
            credentials: "same-origin", // Sends cookies back to server with request
            method: 'POST'
        }).then((response)=>{
            (response.json().then((j)=>{
                this.__process_response__(j);
            }));
        }).catch((error)=>{
            console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
        })
    }

    parseJson(in_json){
        return in_json;
    }

    __process_url__(data) {
        var str = "";
        for (var a in data) {
            str += `${a}=${data[a]}\&`;
        }

        return str.slice(0, -1);
    }

    __process_response__(json) {
        
        var response = {}
        var request = response.target;

        //result(request);
            if (this.model){

            //should be able to pipe responses as objects created from well formulated data directly into the model.
                this.set(this.parseJson(json));
                console.log(this.model)
            }
            else
                console.warn(`Unable to process response for request made to: ${this.url}. There is no model attached to this request controller!`)
        
    }
}