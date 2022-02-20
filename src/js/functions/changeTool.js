

const changeTool = (tool) => {
    if(World.activeTool == tool) return
    World.activeTool = tool
    switch(tool){
        case 'brush':
            if(tileset.select)
            World.previewTile.setTexture(`${reactData.tilesetList[TilesetList.state.selected]}-Ghost`, tileset.selected)
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