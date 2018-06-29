import {
	View
} from "../view"


class ModelBase {
	constructor() {
		this.first_view = null;
	};

	destructor() {
        //inform views of the models demise
        var view = this.first_view;

        while (view) {
            view.unsetModel();
            view = view.next;
        }

        this.first_view = null;
	}

	get (){
		return {}
	}

	/**
		Adds a view to the linked list of views on the model. argument view MUST be an instance of View. 
	*/
	addView(view) {
		if (view instanceof View) {
			if (view.model)
				view.model.removeView(view);

			var child_view = this.first_view;

			while (child_view) {
				if (view == child_view) return;
				child_view = child_view.next;
			}

			view.model = this;
			view.next = this.first_view;
			this.first_view = view;

			view.model = this;

			if (!this._temp_data_)
				this._temp_data_ = this.get();

			view.setModel(this);
			view.update(this.get());
		}else{
			throw new Exception("Passed in view is not an instance of wick.View!");
		}
	}

	/**
		Removes view from set of views if the passed in view is a member of model. 
	*/
	removeView(view) {
		if (view instanceof View && view.model == this) {
			var child_view = this.first_view;
			var prev_child = null;

			while (child_view) {
				if (view == child_view) {

					if (prev_child) {
						prev_child.next = view.next;
					} else {
						this.first_view = view.next;
					}

					view.next = null
					view.model = null;
					view.reset();
					return;
				};

				prev_child = child_view;
				child_view = child_view.next;
			}

			//debugger
		}
		console.warn("View not a member of Model!", view);
	}
	/**
		Calls update() on every view object, passing the current state of the Model.
	*/	
	updateViews(data) {
		var view = this.first_view;

		while (view) {
			
			view.update(data);
			
			view = view.next;
		}
	}

	/**
		Updates views with a list of models that have been removed. 
		Primarily used in conjuction with container based views, such as CaseTemplates.
	*/
	updateViewsRemoved(data) {
		var view = this.first_view;

		while (view) {
			
			view.removed(data);
			
			view = view.next;
		}
	}

	/**
		Updates views with a list of models that have been added. 
		Primarily used in conjuction with container based views, such as CaseTemplates.
	*/
	updateViewsAdded(data) {
		var view = this.first_view;

		while (view) {
			
			view.added(data);
			
			view = view.next;
		}
	}
}
export {
	ModelBase
}