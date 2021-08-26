
import GlowAnimation from '@candlelib/glow';
import Presets from "../compiler/common/presets.js";
import { PresetOptions, UserPresets } from "../types/presets";
import { WickRTComponent } from "./component.js";

export const global_object = (typeof global !== "undefined") ? global : window;

export interface WickRuntime {

    loadGlow(): Promise<typeof GlowAnimation>,

    glow: typeof GlowAnimation,

    /**
     * Runtime Component Class Constructor
     */
    C: typeof WickRTComponent;

    /**
     * Utilized by radiate system
     */
    router: any;

    /**
     * Register component class
     * @param arg1 
     */
    rC(arg1: typeof WickRTComponent): void;

    /**
     * Retrieve component class
     * @param name 
     */
    gC(name: string): typeof WickRTComponent,
    presets: PresetOptions;
    /**
     * Replace the current presets with a new set.
     * > Warning:  This will cause a lose of all currently
     * > compiled components.
     */
    setPresets: (preset_options?: UserPresets) => Presets,
    /**
     * Template elements mapped to component names
     */
    templates: Map<string, HTMLElement>;

    OVERRIDABLE_onComponentCreate(component_instance: WickRTComponent): void;

    OVERRIDABLE_onComponentMetaChange(component_meta: any): void;

    init: () => Promise<void>;
}

const rt: WickRuntime = (() => {

    let glow = null;

    return <WickRuntime>{

        async loadGlow(glow_url: string = "@candlelib/glow") {
            //Import glow module if it is not present
            glow = (await import(glow_url)).default;

            return glow;
        },

        get glow(): typeof GlowAnimation { return glow; },

        get p() { return rt.presets; },

        get C() { return WickRTComponent; },

        router: null,

        presets: null,
        /**
         * Registers component
         * @param component - A WickTt
         * @returns 
         */
        rC: component => (rt.presets.component_class.set(component.name, component), component),

        gC: component_name => rt.presets.component_class.get(component_name),

        templates: new Map,

        OVERRIDABLE_onComponentCreate(component_instance) { },

        OVERRIDABLE_onComponentMetaChange() { },


        setPresets: (preset_options: UserPresets) => {

            if (rt.presets) {

                if (preset_options)
                    //@ts-ignore
                    rt.presets.integrate_new_options(preset_options);

            } else {

                //create new component
                const presets = new Presets(preset_options);

                //if (!rt.presets)
                rt.presets = <Presets><any>presets;
            }

            return <Presets>rt.presets;
        },

        init: null,

        addAPI(obj) {

            for (const name in obj)
                rt.presets.api[name] = { default: obj[name] };
        }
    };
})();


export { rt };
