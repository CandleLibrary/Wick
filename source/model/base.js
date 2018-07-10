import { View } from "../view/view"

import { Scheduler } from "../common/scheduler"

/** @namespace Model */

export class ModelBase {

    constructor() {

        this.____changed_values____ = [];
    };

    destructor() {

        //inform views of the models demise
        var view = this.first_view;

        while (view) {
            view.unsetModel();
            view = view.next;
        }

        //this.first_view = null;

        this.____changed_values____ = null;
    }

    get() {
        return this;
    }

    /**
    	
    */
    scheduleUpdate(changed_value) {

        if (!this.first_view)
            return;

        this.____changed_values____.push(changed_value);

        Scheduler.queueUpdate(this);
    }

    getChanged(prop_name) {


        for (let i = 0, l = this.____changed_values____.length; i < l; i++)
            if (this.____changed_values____[i] == prop_name)
                return this[prop_name];

        return null;
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

            view.setModel(this);
            view.update(this.get());
        } else
            throw new Exception("Passed in view is not an instance of wick.View!");
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
        }
    }

    update(step) {

        this.updateViews(this);

        this.____changed_values____.length = 0;
    }

    /**
    	Calls update() on every view object, passing the current state of the Model.
    */
    updateViews() {

        var view = this.first_view;

        while (view) {

            view.update(this, this.____changed_values____);

            view = view.next;
        }

        this.____changed_values____.length = 0;
    }

    /**
    	Updates views with a list of models that have been removed. 
    	Primarily used in conjunction with container based views, such as SourceTemplates.
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
    	Primarily used in conjunction with container based views, such as SourceTemplates.
    */
    updateViewsAdded(data) {

        var view = this.first_view;

        while (view) {

            view.added(data);

            view = view.next;
        }
    }

    toJson() {
        return JSON.stringify(this, null, '\t');
    }
}

Object.defineProperty(ModelBase.prototype, "first_view", {
    writable: true,
    configurable: false,
    enumerable: false,
})

Object.defineProperty(ModelBase.prototype, "____changed_values____", {
    writable: true,
    configurable: false,
    enumerable: false,
})

Object.seal(ModelBase.prototype);