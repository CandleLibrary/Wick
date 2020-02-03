wick({
	scheme: {liked:wick.scheme.bool},

	put: "liked",

    tag: "like-button",

    dom:`<span><button onclick="((liked)(true))">((liked ? "you liked this!" : "like"))<slot name="name"></button></span>`
})



