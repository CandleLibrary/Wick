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

        let data = JSON.parse(this.element.value);
        
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

	destructor(){
		this.element.removeEventListener("click",this.event)	
		super.destructor();
	}
}

export {DataEdit}
