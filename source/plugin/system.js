
// Houses handlers for all plugins 
// Makes the `plugin` funciton of the handler available, which can be accessed by calling Plugin.*plugin.name* 
// e.g Plugin({name:"newPlugin"}) ...> Plugin.newPlugin(...)
const p = new Map();

class PluginRunner {
	constructor(){
		this.plugins = new Map();
	}

	run(...data){
		if(id == null)
		for (const plugin of this.plugins.values())
			plugin.run(...data);
		else
			if(this.plugins.has(id))
				return this.plugins.get(id).run(...data);
	}

	set(id, fn){
		this.plugins.set(id, {run:(...d)=>fn(...d)})
	}
}

function register(name){
	const r = new PluginRunner(name);

	p.set(name, new Proxy(r, {
		get (target, prop){
			
			if(prop == "run")
				return target.boundRun;

			if(target.plugins.has(prop))
				return target.plugins.get(prop);
		}
	}))

	return p.get(name);
}

const plugins = function(plugin, plugin_id, fn){
	if(p.has(plugin))
		p.get(plugin).plugins.set(plugin_id, fn);
};

const kludge_plugin = plugins.register("kludge_plugin");

export default new Proxy({plugins}, {
	get (target, prop){
		if(prop == "register")
			return register;
		else if(p.has(prop))
			return prop;
		else return "kludge_plugin";
	}
});