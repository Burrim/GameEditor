const removeTile = (single) =>{
    //Run Checks
    if( document.querySelectorAll( ":hover" )[2].id != 'parent') return //Checks if there is no element above the phaser canvas
 
    let flag = {tileSet:false}  //Flag for when the tile was succesfully placed

    tileloop('above',single,flag)
    tileloop('below',single,flag)
    tileloop('ground',single,flag)
}


const tileloop = (tileType, single,flag) =>{
    if(flag.tileSet) return
    let i = World.activeMap.layers[tileType].length-1
    while(i > -1) {
        //Check if tile is empty. make it empty if this is not the case
        let selectedTile = World.activeMap.core.getTileAtWorldXY(World.pointer.worldX, World.pointer.worldY,false, World.cameras.main, World.activeMap.layers[tileType][i])
        if(selectedTile){
            console.log(tileType)
            //Sets Index to an empty tile and clears properties
            World.activeMap.history.addEntry(selectedTile, selectedTile.index, 0)
            selectedTile.index = -1
            selectedTile.properties = {}
            //World.activeMap.core.removeTileAtWorldXY(World.pointer.worldX, World.pointer.worldY, true, false,World.cameras.main, World.activeMap.layers[tileType][i])
            //When single mode is active stop execution after first tile is removed
            if(single) flag.tileSet = true 
        }
        i--
        if(i<0) break
    } 
}

export default removeTile