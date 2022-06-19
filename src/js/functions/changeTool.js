

const changeTool = (tool) => {
    if(World.activeTool == tool) return
    World.activeTool = tool
    switch(tool){
        case 'brush':
        case 'grandBrush':
            document.getElementById('Tools').src = files.editorGraphics.brush
            if(tileset.select)
            World.previewTile.setTexture(`${reactData.tilesetList[TilesetList.state.selected]}-Ghost`, tileset.selected)
            else if(ObjectList.state.selected)
            World.previewTile.setTexture(`${reactData.objects[ObjectList.state.selected].editorData.img}-Sprite`)
            else  World.previewTile.setTexture('emptyTile')
        break;
        case 'eraser':
            document.getElementById('Tools').src = files.editorGraphics.eraser
            World.previewTile.setTexture('eraserTile')
            ObjectList.select()
        break;
        case 'object':
            document.getElementById('Tools').src = files.editorGraphics.settings
        break;
    }
}   

export default changeTool