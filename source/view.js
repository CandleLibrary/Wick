/** View
*/
class View{
	constructor(){
		this.next = null;
		this.model = null;
	}

	destructor(){
		if(this.model){
			this.model.removeView(this);
		}
	}

	update(data){

	}

	reset(){

	}

	setModel(model){
	}
	/**
	* Called by model when it is destroyed. Destroys view by default
	*/
	unsetModel(){
		this.destructor();
	}
}

export{View}
