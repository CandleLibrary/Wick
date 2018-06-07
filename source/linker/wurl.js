import {
    TurnQueryIntoData,
    TurnDataIntoQuery,
    QueryStringToQueryMap,
    QueryMapToQueryString
} from "../common/url/url"

class WURL {
    constructor(location){
        //parse the url into different sections
        this.path = location.pathname;
        this.host = location.hostname;
        this.query = QueryStringToQueryMap(location.search.slice(1));
    }

    setPath(path){
        this.path = path;
        this.setLocation();
    }

    setLocation(){
        history.replaceState({},"replaced state",`${this}`);
        window.onpopstate();
    }

    toString(){
        return `${this.path}?${QueryMapToQueryString(this.query)}`;
    }

    getClass(class_name){
        let out = {}, class_;

        if(class_ = this.query.get(class_name)){
            for(let [key, val] of class_.entries()){
                out[key] = val;
            }
        }

        return out;
    }

    set(class_name, key_name, value){

        if(!class_name) class_name = null;

        if(!this.query.has(class_name)) this.query.set(class_name, new Map());

        let class_ = this.query.get(class_name);

        class_.set(key_name, value);

        this.setLocation();
    }

    get(class_name, key_name){
        if(!class_name) class_name = null;

        let class_ = this.query.get(class_name);

        return (class_) ? class_.get(key_name) : null;
    }

};

export {
    WURL
}
