import {Cassette} from "./cassette"

class DataEdit extends Cassette{
	constructor(parent, element,d,p){
		//Scan the element and look for inputs that can be mapped to the 
		super(parent, element,d,p);
	}

	load(model){
        this.children.forEach((e)=>{
			 e.load(model);
        })

        let data = JSON.parse(this.ele.value);
        
        if(data){
        	
        	model.add(data);
        }


        if(this.data.model)
            model.addView(this)
    }

    update(data){    	
    }

	event(){
		this.parent.export();
	}

	dstr(){
		this.ele.removeEventListener("click",this.event)	
		super.dstr();
	}
}

export {DataEdit}
