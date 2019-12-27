import StampScope from "../stamp/stamp.js";
import {IOBase} from "./component/io/io.js";

export default class d {
    // Compiles the component to a HTML file. 
    // Returns a string representing the file data.
    compileToHTML(bound_data_object) {

    }

    // Compiles the component to a JS file
    // Returns a string representing the file data.
    compileToJS(bound_data_object) {

    }

    //Registers the component as a Web Component.
    //Herafter the Web Component API will be used to mount this component. 
    register(bound_data_object) {

        if (!this.name)
            throw new Error("This component has not been defined with a name. Unable to register it as a Web Component.");

        if (customElements.get(this.name))
            console.trace(`Web Component for name ${this.name} has already been defined. It is now being redefined.`);

        customElements.define(
            this.name,
            d.web_component_constructor(this, bound_data_object), {}
        );
    }

    //Mounts component data to new HTMLElement object.
    async mount(HTMLElement_, data_object, USE_SHADOW) {

        if (this.READY !== true) {
            if (!this.__pending)
                this.__pending = [];

            return new Promise(res =>this.__pending.push([false, HTMLElement_, data_object, USE_SHADOW, res]));
        }

        return this.nonAsyncMount(HTMLElement_, data_object, USE_SHADOW);
    }

    //Creates a standalone component string
    async stamp(data_object) {

        if (this.READY !== true) {
            if (!this.__pending)
                this.__pending = [];

            return new Promise(res =>this.__pending.push([true, data_object, null, res]));
        }

        return this.nonAsyncStamp(data_object);
    }

    nonAsyncStamp(data_object = null){


        const scope = this.ast.mount(null);

        //pull out tap and io data and build a dependency graph

        //element data is already available in the form of a working DOM. 

        const taps = [...scope.taps.entries()].map((v) => ({ios:v[1].ios, v:v[0], mode: v[1].modes}));
        const ios = [];

        const eles = {
            getElement(ele) {
                return ele.tag;
            }
        }

        console.log(scope.ios[0].toString(eles))
        taps[0].ios[0].getTapDependencies();
        function map_ios(io, par){
            const i = {};
            i.self = io;
            i.par = par;
            if(io.ele instanceof IOBase){
                i.io = map_ios(io.ele, io);
            }else{
                i.ele = io.ele;
            }
            return i;
        }

        //Convert

        //Pull out io information from each tap. 

        for(const tap of taps){
            for(const io of tap.ios)
                ios.push(map_ios(io, tap));
        }

        //Each tap will sit at the top of a stamped component as a gate
        //For data transfer. Additionally, if a tap supports redirect and export,
        //then the tap will be used as part of the stamp components emit function to push data
        //into an export object to be consumed by the component's parent / children.

        //For each io set, compile all taps the io needs

        function getTaps(io){

        }

        for(const io of ios)
            console.log(getTaps(io));

        debugger



        return scope;
    }

    nonAsyncMount(HTMLElement_, data_object = null, USE_SHADOW){
        let element = HTMLElement_;

        if(USE_SHADOW == undefined)
            USE_SHADOW = this.ast.presets.options.USE_SHADOW;

        if ((HTMLElement_ instanceof HTMLElement) && USE_SHADOW) {
            //throw new Error("HTMLElement_ argument is not an instance of HTMLElement. Cannot mount component");

            element = HTMLElement_.attachShadow({ mode: 'open' });
        }

        const scope = this.ast.mount(element);

        scope.load(data_object);

        return scope;
    }

    connect(h, b) { return this.mount(h, b) }
}

d.web_component_constructor = function(wick_component, bound_data) {
    return class extends HTMLElement {
        constructor() {
            super();
            wick_component.mount(this, bound_data);
        }
    };
};
