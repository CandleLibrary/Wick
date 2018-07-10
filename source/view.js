export class View{

	constructor(){

		this.next = null;
		this.model = null;
	}

	destructor(){

		if(this.model)
			this.model.removeView(this);
	}	
	/**
		Called a Model when its data has changed.
	*/
	update(data){

	}
	/**
		Called by a ModelContainerBase when an item has been removed.
	*/
	removed(data){

	}

	/**
		Called by a ModelContainerBase when an item has been added.
	*/
	added(data){

	}
	setModel(model){
	}

	reset(){
		
	}
	unsetModel(){

		this.next = null;
		this.model = null;
	}
}