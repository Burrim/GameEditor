var activeWindow = 'main'

openWindow = function(window)
{
    console.log(window)
    document.getElementById(window).style.display = 'flex'
}

closeWindow = function(window)
{
    document.getElementById(window).style.display = 'none'
}

openEditorSegment = function(segment)
{
    //Standartwerte 
    document.getElementById("parent").style.display = "none";
    document.getElementById("mainWindow").style.display = "none"
    document.getElementById("TSEdit").style.display = "none";

    document.getElementById("modeTSEdit").style.outline = "none";
    document.getElementById("modeTSEdit").style.backgroundColor = "transparent";
    document.getElementById("modeMap").style.outline = "none";
    document.getElementById("modeMap").style.backgroundColor = "transparent"

    document.body.style.overflow = 'hidden' //Bereitet Body für grössere Grafiken vor
    switch(segment)
    {
        case 'main':
        document.getElementById("parent").style.display = "flex";
        document.getElementById("mainWindow").style.display = "block"
        document.getElementById("modeMap").style.outline = "1px solid white";
        document.getElementById("modeMap").style.backgroundColor = "rgba(175, 36, 36, 0.822)"
        document.body.style.overflow = 'hidden'
        break;

        case 'TSEditor':
        document.getElementById("TSEdit").style.display = "flex";
        document.getElementById("modeTSEdit").style.outline = "1px solid white";
        document.getElementById("modeTSEdit").style.backgroundColor = "rgba(175, 36, 36, 0.822)"
        document.body.style.overflow = 'visible'
        TM.initEditor()
        break;
    }
    activeWindow = segment
    
}

save = function()
{
    switch(activeWindow)
    {
        case 'main':
        DAM.save()
        break;

        case 'TSEditor':
        TM.saveTileset()
        break;
    }
    
}