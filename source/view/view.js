/**
 * Base class for an object that binds to and observes a Model.
 *@alias module:wick.core.view
 */
export class View{

	constructor(){
		/**
		 * property
		 */
		this.nx = null;
		this.pv = null;
		this ._model_ = null;
	}

	/**
     * Unbinds the View from its Model and sets all properties to undefined. Should be called by any class extending View
	 * ``` js
	 * class ExtendingView extends wick.core.view.View{
	 * 		_destroy_(){
	 * 			//... do some stuff ...
	 * 			super._destroy_();
	 * 		}
	 * }
	 * ```
     * @protected
     */
	_destroy_(){

		if(this ._model_)
			this ._model_.removeView(this);
	
		this ._model_ = undefined;
		this.nx = undefined;
	}	
	/**
		Called by a Model when its data has changed.
	*/
	_update_(data){

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

		this.nx = null;
		this ._model_ = null;
	}
}