## Getting started 

Run:

```javascript
	wick.startRouting(presets)
```

To get going. This will automatically parse the HTML of the page and compile components from template elements.

Presets is 

{
	models {}
	schemas {}
	sources {}
	custom_components {}

}

Public Interface

const core = {
    Common,
    Animation,
    view: { View },
    css: {
        parser: CSSParser
    },
    schema: {
        instances: Schemas,
        SchemaConstructor,
        DateSchemaConstructor,
        TimeSchemaConstructor,
        StringSchemaConstructor,
        NumberSchemaConstructor,
        BoolSchemaConstructor
    },
    model: {
        Model,
        AnyModel,
        ModelContainerBase,
        MultiIndexedContainer,
        ArrayModelContainer,
        BTreeModelContainer
    },
    network: {
        router: {
            WURL,
            URL,
            Router
        },
        Getter,
        Setter,
    },
    source: {
        CustomSource,
        SourceBase,
        SourceConstructor,
        Cassette,
        Form,
        Filter
    }
}