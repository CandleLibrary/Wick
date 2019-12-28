

/* Turns a wick compnent into a self contained html component  */
const wick_lite = function() {

    let active_component = null;

    return {
        ge(ele, loc) {
            for (let i = 0; i < loc.length; i++) {
                ele = ele.childNodes[loc[i]];
            }
            return ele;
        }

    };
};

export default class scope{
    
    static appendChild(par_ele, ele){
        par_ele.appendChild(ele);
    }

    constructor(){

    }
}