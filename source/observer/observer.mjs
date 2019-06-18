/**
 * Base class for an object that binds to and observes a Model.
 *@alias module:wick.core.observer
 */
export default class View{

	constructor(){
		/**
		 * property
		 */
		this.nx = null;
		this.pv = null;
		this.model = null;
	}

	/**
     * Unbinds the View from its Model and sets all properties to undefined. Should be called by any class extending View
	 * ``` js
	 * class ExtendingView extends wick.core.observer.View{
	 * 		destroy(){
	 * 			//... do some stuff ...
	 * 			super.destroy();
	 * 		}
	 * }
	 * ```
     * @protected
     */
	destroy(){
		this.unsetModel();
		this.model = undefined;
		this.nx = undefined;
	}	
	/**
		Called by a Model when its data has changed.
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
		if(this.model && this.model.removeView)
			this.model.removeView(this);
		this.nx = null;
		this.model = null;
	}
}
