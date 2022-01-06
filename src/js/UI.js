var selectedTool = 'brush';

touchEv = function(event)
{
    if(event.clientX > window.innerWidth-602)
    {
        World.selected = false;
        Tileset.selected = true;
    }
    else
    {
        World.selected = true;
        Tileset.selected = false;
    }
    World.setGhosts()
}

selectTool = function(tool)
{
    let elements = document.getElementsByClassName('toolbarObjectDiv')
    for (let i = 0; i < elements.length; i++)
    {
        elements[i].style.border = "0 solid #ffffff"
    }
    switch(tool)
    {
        case 'brush':
        document.getElementById('brush').style.border = '1px solid #ffffff'
        selectedTool = 'brush'
        break;

         case 'eraser':
        document.getElementById('eraser').style.border = '1px solid #ffffff'
        selectedTool = 'eraser'
        break;
    }
    World.setGhosts()
}




document.getElementById('brush').style.border = '1px solid #ffffff'

var eraserConfig =
{
    temp:[]
}



