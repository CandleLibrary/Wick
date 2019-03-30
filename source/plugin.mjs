const extensionParse = {
	name: "extensionParse",
	
	handlers : new Map(),
	
	load : function(in_ext, out_ext, fun){
		const extension_handler = {}
		extensionParse.handlers.set(in_ext, async (d) =>({ext:out_ext, data: await fun(d)}));
	},

	plugin : async function(in_ext, data){

		const handler = extensionParse.handlers.get(in_ext);
		
		if(handler)
			return await handler(data);

		return {ext:in_ext, data:data}
	}
}



//Houses handlers for all extension
export const Plugin = ((...plugins)=>{

	const plugin_map = new Map(plugins.map(p => [p.name, p.load]))

	async function plugin(name, ...data){

		const plugin = plugin_map.get(name);

		if(plugin)
			await plugin(...data);
	}	

	plugins.forEach(e=>{
		plugin[e.name] = e.plugin;
	})

	Object.freeze(plugin);

	return plugin;
})(extensionParse);
