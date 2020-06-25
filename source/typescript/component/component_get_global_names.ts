let SET_ONCE_environment_globals = null;

export function getSetOfEnvironmentGlobalNames(): Set<string> {
    //Determine what environment we have pull and out the global object. 
    if (!SET_ONCE_environment_globals) {
        SET_ONCE_environment_globals = new Set();
        let g = (typeof window !== "undefined") ? window : (typeof global !== "undefined") ? global : null;
        if (g) {
            for (const name in g)
                SET_ONCE_environment_globals.add(<string>name);
        }
    }
    return SET_ONCE_environment_globals;
}
