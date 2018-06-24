import {
    View
} from "./view"

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

class Rivet extends View {

	constructor(parent, element){
		super();
		this.parent = parent;
		this.element = element;
		this.children = [];
		this.data = {};
		ImportDataFromDataSet(this.data, element.dataset);
	}

	destructor(){

		this.children.forEach((c)=>c.destructor());
		this.children.length = 0;
		this.data = null;


		if(this.element.parentElement)
			this.element.parentElement.removeChild(this.element);

		this.element = null;

		super.destructor()
	}

	bubbleLink(link_url, child, trs_ele = {}){
        if(this.parent){

        	if(this.data.transition)
        		trs_ele[this.data.transition] = this.element;

        	for(var i = 0, l= this.children.length; i < l; i++){
        		let ch = this.children[i];

        		if(ch !== child){
        			ch.gatherTransitionElements(trs_ele);
        		}
        	}

            this.parent.bubbleLink(link_url, this, trs_ele)
        }
        else{
            history.pushState({}, "ignored title", link_url);
            window.onpopstate();
        }
    }

    gatherTransitionElements(trs_ele){
       
        if(this.data.transition && !trs_ele[this.data.transition]){
            trs_ele[this.data.transition] = this.element;
        }

        this.children.forEach((e)=>{
            if(e.is == 1)
                e.gatherTransitionElements(trs_ele);
        })
    }
}

export {Rivet}