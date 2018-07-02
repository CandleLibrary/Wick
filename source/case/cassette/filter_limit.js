import {
    Filter 
} from "./filter"

class FilterLimit extends Filter {
	
    constructor(parent, element, d, p) {

        super(parent, element, d, p);

        parent.filter_list.push((data) => this.filter(data));

        this.element.addEventListener("input", () => {
            this.parent.update();
        })
    }

    update(data) {
        //apply a filter object to the parent
        if(data[this.data.prop]){
            this.offset = parseInt(data[this.data.prop]) || 0;
            return true;
        }

        if(data[this.data.import]){
            this.offset = parseInt(data[this.data.import]) || 0;
            return true;
        }

        return false;
    }

    filter(data) {

        let l = data.length;

        let page_count = Math.ceil(l / parseInt(this.data.value || 20));

        let offset = (this.offset * (this.data.value || 20)) || 0;

        this.export_val = (page_count);

        if(this.data.export)
            this.export()

        let out_data = [];

        console.log(offset, page_count)

        for(let i = offset; i < page_count+offset && i < l; i++)
            out_data.push(data[i]);

        return out_data;
    }
}

export {
    FilterLimit
}