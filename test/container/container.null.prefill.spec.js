import spark from "@candlefw/spark";
import wick from "@candlefw/wick";

const source = `
 import { limit } from "@model"
 
var data = [
    {header:"test1", entries:[{value:"test1"}]},
    {header:"test2", entries:[{value:"test2"},{value:"test3", href:"test4"}]}
]
export default <div>

    <container data=\${data} element=div limit=\${limit} ele=null>
        <div>
            <div class="header">\${header}</div>
            <container data=\${entries} ele=null>
                <a href=\${href || "#"} >
                    \${value}
                </a>    
            </container>
        </div>
    </container>
</div>
 `;

assert_group(browser, sequence, () => {

    wick.utils.enableTest();

    const model = { limit: 1 };

    const comp = await(await wick(source)).mount(model, document.body);

    await spark.sleep(100);

    assert(await comp.getNumberOfMatches("*") == 3);

    model.limit = 3;

    await spark.sleep(100);

    assert(await comp.getNumberOfMatches("*") == 7);
});