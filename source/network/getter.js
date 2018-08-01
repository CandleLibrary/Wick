import { Model } from "../model/model"
/**
 * This Class is responsible for handling requests to the server. It can act as a controller to specifically pull data down from the server and push into data members.
 *
 * {name} Getter
 */
class Getter {
    constructor(url, process_data) {
        this.url = url;
        this.FETCH_IN_PROGRESS = false;
        this.rurl = process_data;
        this._m = null;
    }

    _destroy_() {
        this._m = null;
    }

    get(request_object, store_object, secure = true) {
        //if(this.FETCH_IN_PROGRESS)
        //    return null;
        this.FETCH_IN_PROGRESS = true;

        var url = ((secure) ? "https://" : "http://") + window.location.host + this.url + ((request_object) ? ("?" + this.__process_url__(request_object)) : "");

        return ((store) => fetch(url, {
            credentials: "same-origin", // Sends cookies back to server with request
            method: 'GET'
        }).then((response) => {
            this.FETCH_IN_PROGRESS = false;
            (response.json().then((j) => {
                this.__process_response__(j, store);
            }));
        }).catch((error) => {
            this.FETCH_IN_PROGRESS = false;
            this.__rejected_reponse__(store);
            console.warn(`Unable to process response for request made to: ${this.url}. Response: ${error}. Error Received: ${error}`);
        }))(store_object)
    }

    parseJson(in_json) {
        return in_json;
    }

    setModel(model) {
        if (model instanceof Model) {
            this._m = model;
        }
    }

    set(data) {
        if (this._m)
            this._m.add(data);
    }

    __process_url__(data) {
        var str = "";
        for (var a in data) {
            str += `${a}=${data[a]}\&`;
        }

        return str.slice(0, -1);
    }

    __rejected_reponse__(store) {
        if (store)
            console.error("Unprocessed stored data in getter.");
    }

    __process_response__(json, store) {

        if (this.rurl && json) {
            var watch_points = this.rurl.split("<");

            for (var i = 0; i < watch_points.length && json; i++) {
                json = json[parseInt(watch_points[i]) ? parseInt(watch_points[i]) : watch_points[i]];
            }

            console.log("json", json)
        }

        var response = {}
        var request = response.target;

        //result(request);
        if (this._m) {
            //should be able to pipe responses as objects created from well formulated data directly into the model.
            this.set(this.parseJson(json, store));
        } else
            console.warn(`Unable to process response for request made to: ${this.url}. There is no model attached to this request controller!`)

    }
}

export {
    Getter
}
/**
 * Fetches text data from a network resource. URL must point to a resource located in the same domain as the page.
 *
 * @param      {string}   url     The URL of the network resource
 * @return     {Promise}  { Promise for the returned data }
 */
export function fetchLocalText(URL, m = "same-origin") {
    return new Promise((res, rej) => {
        fetch(URL, {
            mode: m,// CORs not allowed
            credentials: m, 
            method: "Get"
        }).then(r => {
            if (r.status !== 200)
                rej("");
            else
                r.text().then(str => res(str))
        }).catch(e => rej(e))
    });
}