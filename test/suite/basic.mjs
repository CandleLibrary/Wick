export default [{
    s: "mocha.chai.jsdom",
    l: ["wick", "wick.node", "url", "pause"],
    g: 'wick.basic',
    d: "Creates component using HTML syntax.",
    t: async () => {
        const component = await wick(`<scope element=div>test</scope>`);

        if(!component)
            throw new Error("A component was not created.");

        console.log(component)
    }
}]
