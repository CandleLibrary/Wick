//Updates UI
//Updated By Model

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
	/**
		Called a Model when its data has changed.
	*/
	update(data){

	}
	/**
		Called by a ModelContainer when an item has been removed.
	*/
	removed(data){

	}

	/**
		Called by a ModelContainer when an item has been added.
	*/
	added(data){

	}
	setModel(model){
	}

	reset(){
		
	}
	/**
	* Called by model when it is destroyed. Destroys view as a default action
	*/
	unsetModel(){
		this.destructor();
	}
}

export{View}