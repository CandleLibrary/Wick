wick({
	scheme: {time:wick.scheme.string, liked:wick.scheme.bool},

	put: "liked",

	import: "property",

    tag: "like-button",

    $$mounted : (value, event, component)=>{  setInterval(()=>component.model.time = Math.random(), 1000) },

    dom:`<import url="../compB/test_component3.js">
		<span>
			<button onclick="((liked)(true))" showif="((!liked))">
				<slot name="name"></slot>((time))
			</button>
			((property))
			<span showif=((liked))>
				youve liked this ((time))
			</span>

		</span>`
})



