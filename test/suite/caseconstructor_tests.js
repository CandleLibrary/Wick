function CASECONSTRUCTTESTS() {
    let element = document.createElement("div")
    element.innerHTML =
        `<template id="user_lookup">
    <w-case schema="any">
        <w import><div>[date][time]sd[page_count]Z[value]</div><w-red><div>  [time][date][time][date][page_count]</div> Locovl [page_count]</w-red> of [page_count]</w>
        <div>
        <w-input type="text" name="note">[page_number]</w-input>
        </div>
        <div>
        <w-case id="user_list" model="users"> Doogy
            [datat]((
                <w-filter class="limit" value="2" import>[page_number]</w-filter>
                <w-term>[start]</w-term>
                <w-term>[end]</w-term>

                <w-case trs model="any">
                    <w-a href="<w>[location]</w>">
                        <my-input></my-input>
                    </w-a>
                        Date: <w><w_datetime>[value]<w_reverse><w_color r="233">[time][date]</w_color><w_blue>date</w_blue></w_reverse>[time]</w_datetime><w>
                </w-case>
            ))
        </w-case>
        </div>
    </w-case>
</template>

<template id="my-input">
   	<w export>[name]</w>
    <w-input type="text" export>[page]</w-input>
    <w-input type="text" export><w_date>[page]<w_date></w-input>
</template>`

    let ill_element = document.createElement("div")
    ill_element.innerHTML =

        `<template id="user_lookup">
    <w-case schema="any">
 
        <w impt><w-red>page_number<-red> of [page_count]</w>
        
        <div>
        	<w-input type="text" name="note">[page_number]</w-input>
        </div>
        
        <w-case id="user_list" model="users">
            [data](()
                <w-filter class="limit" value="2" import>[page_number]</w-filter>
                <w-term>[start]</w-term>
                <w-term>[end]</w-term>

                <w-e trs model="user">
                    <w-a href="<w>[location]</w>">
                        <my-input></my-input>
                    </w-a>
                        Date: <w_datetime><w>[value]</w><w_reverse><w_color r="233">[time][date]</w_color><w_blue>date</w_blue></w_reverse>[time]</w_datetime>
                </w-cases>
            )
        </w-case>
        
    </w-case>
</template>

<template id="my-input">
    <w export>[name]</w>
    <w-input type="text" export>[page]</w-input>
    <w-input type="text" export><w_date>[page]<w_date></w-input>
</template>`

    describe('wick.CaseConstructor', function() {

        it('Constructs an AST on properly formatted HTML', function() {
            let constructucting_template = element.getElementsByTagName('template')[0];
            let skeleton = wick.CaseConstructor(constructucting_template, {}, element);

            let any = new wick.Model({
                page_count: 34500,
                page_number: 0,
                value: "Toco Mako!!",
                time: "8pm",
                date: "Jun 19 998"
            });

            let Case = skeleton(any);

            document.body.appendChild(Case.element);

            any.page_count = 50
        })

        describe.only("Throws appropiate errors for various ill formatted HTML", function() {

            function test(description,expected_error_message, HTML_text){
                it(description, function(){
                    let element = document.createElement("template");
                    element.innerHTML = HTML_text;
                    element.innerHTML = HTML_text;
                    console.log(element.innerHTML)

                    try{
                        wick.CaseConstructor(constructucting_template, {}, element)
                    }
                    catch(e){
                        if(e.message !== expected_error_message)
                            throw new Error(`Received incorrect error message "${e.message}". Expecting: "${expected_error_message}"`);
                        else return;
                    }

                    throw new Error(`No error thrown. Expecting error: ${expected_error_message}`)
                })
            }

            test("Unmatched tag", "Tag is unmatched", "<w-case><div></w-case>");
        });
    })
}

if (typeof module !== "undefined") module.exports = CASECONSTRUCTTESTS;