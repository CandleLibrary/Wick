import {Model} from "./model/model"

class Controller{
	
	constructor(){
		this.model = null;
	}

	destructor(){
		this.model = null;
	}

	setModel(model){
		if(model instanceof Model){
			this.model = model;
		}
	}

	set(data){
		if(this.model)
			this.model.add(data);
		
	}
}

export{Controller}