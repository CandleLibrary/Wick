function ImportDataFromDataSet(data_object, data_set_object) {
    for (let prop in data_set_object) {
        data_object[prop] = data_set_object[prop];
    }
}

class Cassette {
    constructor(parent, element, controller) {
        this.parent = parent;
        this.controller = controller;
        this.element = element
        this.prop = element.dataset.prop;
        this.import_prop = element.dataset.iprop;
        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.data = {};

        /* import data into basic JavaScript object */
        ImportDataFromDataSet(this.data, element.dataset);

    }

    update(data) {
        if (data)
            if (this.prop) {
                this.element.innerHTML = data[this.prop];
            }
    }

    setModel(model) {
        if (this.controller)
            this.controller.setModel(model);
    }

    destructor() {
        this.parent = null;

        if (this.controller)
            this.controller.destructor();

        this.controller = null;
    }

    updateDimensions() {
        var d = this.element.getBoundingClientRect();

        this.width = d.width;
        this.height = d.height;
        this.top = d.top;
        this.left = d.left;

        this.update();
    }

    hide() {
        if (this.parent) this.parent.hide();
    }
}

class CloseCassette extends Cassette {
    constructor(parent, element, controller) {
        super(parent, element, controller);

        this.element.addEventListener("click", () => {
            parent.hide(); //Or URL back;
        })
    }
}

export {
    Cassette,
    CloseCassette,
    ImportDataFromDataSet
}