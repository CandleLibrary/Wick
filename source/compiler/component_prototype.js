import StampScope from "../stamp/stamp.js";
import {IOBase, EventIO, InputIO} from "./component/io/io.js";
import ScriptIO from "./component/io/script_io.js";
import {Tap} from "./component/tap/tap.js";

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

        // Graph is built from Tap info at top - IO data connecting to one of {tap, ele, io} - Ele id holders.

        //Creating the graph
        
        const root_ios = [];

        function createIONode(io){
            return {
                TAP_PARENT: (io.parent instanceof Tap), 
                par: (io.parent instanceof Tap) ? taps.get(io.parent) : io.parent, 
                IS_INPUT: (io instanceof EventIO || io instanceof InputIO), 
                ele : (io.ele instanceof IOBase) ? createIONode(io.ele) : io.ele,
                io
            }
        }


        function recurseIO(io){
            if(io.io instanceof ScriptIO){
                for(const arg_name in io.io.arg_ios){
                    const aio = createIONode(io.io.arg_ios[arg_name]);
                    aio.ele = io;
                    recurseIO(aio);
                }
            }else if(io.par instanceof IOBase){
                io.par = createIONode(io.par);
                recurseIO(io.par);
            }else{
                root_ios.push(io);
            }
        }

        const taps = new Map([...scope.taps.entries()].map((v) => [v[1], {ios:v[1].ios, v:v[0], mode: v[1].modes}]));
        const ios = scope.ios.map(createIONode);
        ios.forEach(recurseIO)
        /*
        for(const tap of taps.values()){
            for(let i = 0; i < tap.ios.length; i++){
                for(let j = 0; j < root_ios.length; j++){
                    if(tap.ios[i] == ios[j].io){
                        tap.ios[i] = ios[j]
                        break;
                    }
                }
            }
        }
        */
        // Activation conditions. {tap, or_prop}

        function buildIO(io, obj = {cds:new Set, str:""}){
            if(io.io instanceof ScriptIO){
                
                obj.str = io.io.script.ast.render() +";"+ obj.str;

                for(const arg_name in io.io.arg_ios){
                    obj.cds.add(arg_name)
                    //const arg = io.io.arg_ios[arg_name];
                    //str = buildIO(createIONode(arg), str)
                }

                if(io.par)
                    obj.cds.add(io.par.v)
            }else if(io.io instanceof EventIO){

                obj.cds.add(io.io.up_tap.prop);

                obj.str += `emit("${io.io.up_tap.prop}", ${io.io.up_tap.prop})`;

                if(!io.TAP_PARENT)
                     buildIO(io.par, obj);

                 obj.event = io.io.event_name;
                 obj.ele = io.ele;
                 obj.str = `${obj.str}`;
            }else{
                if(!io.TAP_PARENT){
                    obj.str += io.io + "";
                    return buildIO(io.par, obj);
                }
                if(!((io.ele instanceof Element) || (io.ele instanceof Text))){
                    obj.cds.add(io.par.v)
                }
                else{
                    obj.ele = io.ele;
                    obj.cds.add(io.par.v)
                    obj.str += `${io.ele.nodeName}.${io.io.prop} = ${io.par.v};`
                }
            }

            return obj;
        }

        const actions = [];

        for(const io of ios){
            actions.push(buildIO(io));
        }

        //combine actions if we can
        for(let i = 0; i < actions.length; i++){
            let act1 = actions[i];
            for(let j = 0; j < actions.length; j++){
                if(j == i)
                    continue
                let act2 = actions[j];

                if(act1.cds.valueOf() == act2.cds.valueOf() && (act1.type & act2.type)){
                    //compress
                }
            }
        }

        actions.sort((a,b)=>{(a.type<b.type)?-1:1})

        for(let i = 0; i < actions.length; i++){
            const action = actions[i];
            switch(action.type){
                case 1: // Input
                case 2: // Event
                case 4: // Element prop
                case 12: // Scripts & Expressions
                case 4: // Scripts
            }
        }

        //Build component based on actions.

        /*
            function Component(element, wick_lite){
                //Get References to the necessary elements
                const 
                    ela = wick_lite.ge(element, 0,0,0,0,);
                    eleb
                    elec
                    eled
                    ...
                
            }
        */


        //group IOs with same ele into a super IO



        debugger
        //Optimizing the graph. 
        
        //Map all taps that can be grouped into a cluster
        //These are taps that share a subset of the same ios. 
        /*
        for(let i = 0; i < taps.length; i++){
            const tap_a
            for(let j = 0; j < taps.length; j++){

            }
        }*/

        //Building the component. 


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
