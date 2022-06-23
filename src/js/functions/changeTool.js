

const changeTool = (tool) => {
    if(World.activeTool == tool) return
    World.activeTool = tool

    //Clears highlight on all tools and highlights selected one
    document.getElementById('Topbar-brush').parentNode.style.backgroundColor = 'transparent'
    document.getElementById('Topbar-eraser').parentNode.style.backgroundColor = 'transparent'
    document.getElementById('Topbar-object').parentNode.style.backgroundColor = 'transparent'

    document.getElementById('Topbar-'+tool).parentNode.style.backgroundColor = 'red'



    switch(tool){
        case 'brush':
        case 'grandBrush':
            if(tileset.select)
            World.previewTile.setTexture(`${reactData.tilesetList[TilesetList.state.selected]}-Ghost`, tileset.selected)
            else if(ObjectList.state.selected)
            World.previewTile.setTexture(`${reactData.objects[ObjectList.state.selected].editorData.img}-Sprite`)
            else  World.previewTile.setTexture('emptyTile')
        break;
        case 'eraser':
            World.previewTile.setTexture('eraserTile')
            ObjectList.select()
        break;
        case 'object':
        break;
    }
}   

export default changeTool