
const changeTool = (tool) => {
    console.log(tool)
    if(World.activeTool == tool) return


    //Executes changes depending on the previous tool
    switch(World.activeTool){
        case 'particleBrush':
            document.body.style.cursor = 'auto'
        break;
        case 'brush':
            World.previewTile.setVisible(false)
        break;
        case 'paste':
            World.previewTile
            .setVisible(false)
            .setScale(1)
        break;
        case 'selection':
            World.selectingRec.setVisible(false)
        break;
        case 'measure':
            World.measurement.setVisible(false)
        break;
    }
    World.activeTool = tool

    //Clears highlight on all tools and highlights selected one
    topbartools.resetSelection()

    if(document.getElementById('Topbar-'+tool))
    document.getElementById('Topbar-'+tool).parentNode.style.backgroundColor = 'red'



    switch(tool){
        case 'brush':
        case 'grandBrush':
            if(tileset.select){
                World.previewTile.setTexture(`${reactData.tilesetList[TilesetList.state.selected]}-Ghost`, tileset.selected)
                World.previewTile.setVisible(true)
            }
            else if(ObjectList.state.selected)
            World.previewTile.setTexture(`${Object.values(files.objects.all)[ObjectList.state.selected].editorData.img}-Sprite`)
            else  World.previewTile.setTexture('emptyTile')
        break;
        case 'eraser':
            World.previewTile.setVisible(true)
            World.previewTile.setTexture('eraserTile')
            ObjectList.select()
        break;
        case 'object':
            World.previewTile.setVisible(false)
        break;
        case 'particleBrush':
            document.body.style.cursor = 'crosshair'
        break;
        case 'paste':
            World.previewTile.setVisible(true)
            World.previewTile.setTexture('eraserTile')
            World.previewTile.setScale(World.customCache.width,World.customCache.height)
        break;
        case 'selection':{
            if(!World.selectingRec) World.selectingRec = World.add.rectangle(0,0,0,0,0xAA0000,0.5).setOrigin(0).setDepth(10)
            World.selectingRec.setVisible(true)
        }
        case 'measure':
            if(World.measurement == undefined){
                World.measurement = World.add.rectangle(0,0,0,0,0xffffff,0.5).setOrigin(0.5);
                World.measurement.setDepth(20);
            } 
            World.measurement.setVisible(true)
        break;
    }
}   

export default changeTool