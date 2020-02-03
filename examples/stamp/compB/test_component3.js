const model = wick.model({users:[{name:"rick"}, {name:"saariaek"}]});

wick({

    tag:"labels",

    model: [model, "users"],

    dom: `<span>
            ((name))
        </span>`,
})

setTimeout(()=>{
	model.users.push({name:"saurez"},{name:"camilia"})
},1000)

