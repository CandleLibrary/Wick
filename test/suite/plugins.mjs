export default [{
	s:"mocha.chai",
	l:["wick", "vue", "wick.node"],
	g:'wick.plugins',
	d:"Can specify special handlers that insert 3rd party components into the compiled tree based on url location:VUE",
	t: async ()=>{
		
		//Create a vue plugin and test whether it integrates into DOM.
		
		// First arg is the plugin selector,
		// Second arg a list of files or folders to respond to

		wick.plugin("insertComponentLibrary", ["./test/vue/"], (fetchedData, node)=>{
			//return DOM node.
			node.build = function(model, presets){
			
			}
		})
	}
},{
	d: 'Can specify handlers that replace elements of particular tags with 3rd party compononents:VUE',
	t: async ()=>{
		
		//Create a vue plugin and test whether it integrates into DOM.
		
		// First arg is the plugin selector,
		// Second arg a list of files or folders to respond to
		
		wick.plugin("insertComponentLibrary", ["./test/vue/"], (fetchedData, node)=>{
			//return DOM node.
			node.build = function(model, presets){
				
			}
		})
	}
}]