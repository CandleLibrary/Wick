Wick uses direct manipalation of the DOM or the a ShadowDOM to update the state of the app. Hooks directly attach to elements and update their content when change events are issued from the Model. 

Pipes provide a way to decorate the ouput with more markup before pushing to the DOM. Care must be taken to ensure that DOM manipulation is limited to as few updates as possible. We must be able to cache the output of pipes, and only render new elements when it is called. Initialization of a pipe will have the pipe create a Element node, and send down the chain. 

The output a Tap produces is in the form 

Class Result : 
{
    v //value
    o_el // outermost element to append
    i_el // innermost element to 
    d // model data that was passed from source  
}

Root pipe. This pipe is the first element creating pipe in the pipeline. It is the only pipe that should set the o_el property.
All other element producing pipes should append their own element to i_el if it exists, and then assign their element to i_el. 

This object should not be attached to any variable, and instead be passed through function arguments.

Result.d should not be assigned to any variable. 

There a two types of pipes, one that wraps data in dynamic tags to customize their appearance, and ones that modify the value themselves. 

If the Pipe has no data binding to affect its own element it creates, then it will be removed from the pipeline, pushing its children to the it's parent, and automatically reducing the overhead of subsequent updates.
        
{ v :a }(a) - IO Tap     (b) - Pipe Tap
        |   ___________/
        |  /
        | / 
{v:a'+b}(+b) <- Changes v or wraps it with element. 
        | \
        |  \______________________________________________
        | - Pipe                                          \
        |                                                  \
{v:a'+b}(<n>) <- Just wraps - Can be ignored hereafter      (+b)
        |                                                    |
        |                                                    |
        |                                                    |
   <n>(a'+b)</n> - string i/o, Outputs data                 ( )

<n> does not need to be recreated unlease the DOM is externally changed. 
    Shadow DOM. P
    Perhaps no support for that. 
    Parse DOM for differences. Rerender and rebuild. 
        
pl = [] - nodes that digest 
ch = [] - nodes that digest the data

IOs always create textNodes and replace their entry with the text node when appropiate. 
1. Bound to a pipe that creates new elements. 