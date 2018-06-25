import {
    ModelContainer,
} from "./model_container"

class ArrayModelContainer extends ModelContainer {
    constructor(schema) {
        super(schema);
        this.data = [];
    }

    destructor() {

        for (var i = 0; i < this.data.length; i++) {
            this.data[i].destructor();
        }

        this.data = null;

        super.destructor();
    }

    __insert__(item, add_list) {
        if (this.checkIdentifier(item)) {

            for (var i = 0, l = this.data.length; i < l; i++) {

                var obj = this.data[i];

                if (this.getIdentifier(obj) == this.getIdentifier(item)) {

                    obj.add(item);

                    return true;
                }
            }

            if (item instanceof this.schema.model) {
                this.data.push(item);

                if (add_list) add_list.push(item)

                return true;
            } else if (this.schema.model) {
                var temp = new this.schema.model();

                temp.add(item);

                this.data.push(temp);

                if (add_list) add_list.push(temp)

                return true;
            } else {
                console.error(`Model has not been created yet for dataset ${this.getIdentifier(item)}`, item);
            }
        }

        if (this.checkRawID(item)) {
            //Item is not a model yet
            for (var i = 0, l = this.data.length; i < l; i++) {
                var obj = this.data[i];

                if (this.getIdentifier(obj) == item[this.schema.identifier]) {
                    obj.add(item);
                    return true;
                }
            }

            //create a new model and push into array. 

            var model = new this.schema.model();
            
            model.add(item);
            
            this.__insert__(model);

            if (add_list) add_list.push(model)

            return true;
        }
        return false;
    }

    __get__(item) {
        if (this.checkIdentifier(item)) {
            for (var i = 0, l = this.data.length; i < l; i++) {
                var obj = this.data[i];

                if (this.getIdentifier(obj) == this.getIdentifier(item)) {
                    return obj.get();
                }
            }
        }

        return [];
    }

    __getAll__(item) {
        return this.data.map((d) => d.get()) || [];
    }

    __removeAll__() {
        let items = this.data.map(d => d) || [];

        this.data.length = 0;

        return items;
    }

    __remove__(item) {
        if (this.checkIdentifier(item)) {
            for (var i = 0, l = this.data.length; i < l; i++) {
                var obj = this.data[i];

                if (this.getIdentifier(obj) == this.getIdentifier(item)) {

                    this.data[i].splice(i, 1);

                    return [obj];
                }
            }
        }

        return [];
    }
}


export {
    ArrayModelContainer
}