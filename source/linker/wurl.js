import {
    TurnQueryIntoData,
    TurnDataIntoQuery
} from "../common/url/url"

class WURL {
    constructor(location){
        //parse the url into different sections
        this.path = location.pathname;
        this.host = location.hostname;
        this.query = TurnQueryIntoData(location.search.slice(1));
    }

    setLocation(){
        document.location.replace((this + ""));
    }

    toString(){
        return `${this.host}${this.path}?${TurnDataIntoQuery(this.query)}`;
    }

    set(class_name, key_name, value){
        let cls = (this.query[class_name]) || (this.query[class_name] = {}, this.query[class_name]);

        cls[key_name] = value

        this.setLocation();
    }

    get(class_name, key_name){
        let cls = (this.query[class_name]) || {};

        return cls[key_name];
    }

};

export {
    WURL
}
