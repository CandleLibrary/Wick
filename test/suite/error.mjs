export default [{
    s: "mocha.chai.jsdom",
    l: ["wick", "vue", "wick.node", "url"],
    g: 'wick.error',
    d: "Generates errors",
    t: async () => {
        const
            comp = await wick(`<scope><script on=((mounted))> test.dm = 2 </script> </scope>`),
            ele = document.createElement("div"),
            mgr = comp.mount(ele);
    }
}]
