import {
    ModelContainer,
} from "./model_container"

class BinaryTreeModelContainer extends ModelContainer {

    /*
        {start} : UTF time stamp 
    */

    constructor(schema, min, max) {
        super(schema);

        this.min = min;
        this.max = max || min;

        this.left = null;
        this.right = null;

        this.id = min;
    }

    getPrev() {
        return this.min - 1;
    }

    getNext() {
        return this.max + 1;
    }

    __insert__(item, numerical_id) {

        if (this.checkIdentifier(item)) {
            if (!numerical_id)
                numerical_id = this.getIdentifier(item);


            if (numerical_id < this.min) {
                if (this.left)
                    return this.left.insert(item, numerical_id);
                else
                if (item instanceof this.constructor)
                    return this.left = item;
                else {
                    this.left = new this.constructor(this.schema, this.getPrev(), null);
                    return this.left.insert(item, numerical_id);
                }
            }

            if (numerical_id > this.max) {
                if (this.right)
                    return this.right.insert(item, numerical_id);
                else
                if (item instanceof this.constructor)
                    return this.right = item;
                else {
                    this.right = new this.constructor(this.schema, this.getNext(), null);
                    return this.right.insert(item, numerical_id);
                }
            }

            return this.__insertItem__(item, numerical_id);
        }

        return false;
    }

    __get__(item, numerical_id) {
        if (this.checkIdentifier(item)) {
            if (!numerical_id)
                numerical_id = this.getIdentifier(item);


            if (numerical_id < this.min) {
                if (this.left)
                    return this.left.__get__(item, numerical_id);
            }

            if (numerical_id > this.max) {
                if (this.right)
                    return this.right.__get__(item, numerical_id);
            }

            return this.__getItem__(item, numerical_id);
        }
    }

    __getAll__(start = -Infinity, end = Infinity) {
        var items = [];

        var a_condition = (this.min >= start) | 0;
        var b_condition = (this.max <= end) | 0;

        var c_condition = (this.min <= end) | 0;
        var d_condition = (this.max >= start) | 0;

        if (a_condition && this.left) {
            var t = this.left.__getAll__(start, end)
            items = items.concat(t);
        }

        if (c_condition && d_condition) {
            var t = this.__getAllItems__(start, end);
            items = items.concat(t);
        }

        if (b_condition && this.right) {
            var t = this.right.__getAll__(start, end)
            items = items.concat(t);
        }

        return items;
    }

    get(item) {
        if (item instanceof Array) {

            if (typeof(item[0]) == "number") {
                var items = [];

                for (var i = 0; i < item.length; i += 2) {
                    var a_val = item[i];
                    var b_val = item[i + 1];

                    if (typeof(a_val) == "number" && typeof(b_val) == "number") {
                        items = items.concat(this.__getAll__(a_val, b_val));
                    }
                }

                return items.length > 0 ? items : [];
            }
        }

        return super.get(item);
    }


    __insertItem__(item, numerical_id) {
        return false;
    }

    __removeItem__(item, numerical_id) {
        return false;
    }

    __getItem__(item) {
        return false;
    }

    __getAllItems__(start, end) {
        return null;
    }
}

export {
    BinaryTreeModelContainer
}