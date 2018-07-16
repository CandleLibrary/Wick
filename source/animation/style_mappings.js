export var StyleMappings = {
	mapping:[
		"top",	
		"left",
		"right",
		"bottom",
		"height",
		"width",
		"margin",
		"padding",
		"background-color",
		"color"
	],

	//Position Attributes
	top:{index:0,types:["em", "px", "%"]},
	left:{index:1,types:["em", "px", "%"]},
	right:{index:2,types:["em", "px", "%"]},
	bottom:{index:3,types:["em", "px", "%"]},

	//Dimension attributes
	height:{index:4,types:["em", "px", "%"]},
	width:{index:5,types:["em", "px", "%"]},
	
	//Box Attributes
	margin:{index:6,types:["em", "px", "%"]},
	padding:{index:7,types:["em", "px", "%"]},
	
	//Color Attributes
	"background-color":{index:8,types:["rgb","#","rgba"]},
	"color":{index:9,types:["rgb","#","rgba"]}
}