import getTileProps from './getTileProp'



const placeTile = () =>{
    //Run Checks
    //if(World.activeMap == undefined)return; //Cancels if there is no active Map
    if(!tileset.selected) return //Returns if no tile is selected
    if( document.querySelectorAll( ":hover" )[2].id != 'parent') return //Checks if there is no element above the phaser canvas

    let tileType = getTileProps(currentTileset.data.tiles[tileset.selected].properties, "type")
    let tileSet = false //Flag for when the tile wa succesfully placed
    let selectedTile;
    
    switch(tileType){
        case 'ground':
            //Check if Layer exists
            if(!World.activeMap.layers.ground[0]){ 
                let layer = World.activeMap.core.createBlankLayer(`ground`, World.activeMap.tilesets ,0 ,0 ,World.activeMap.core.width, World.activeMap.core.height ,World.activeMap.core.tileWidth ,World.activeMap.core.tileHeight)
                World.activeMap.layers.ground[0] = layer
            }
        let id = currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid 
        World.maps[key].core.getTileAtWorldXY(World.pointer.worldX, World.pointer.worldY,false, World.cameras.main, World.activeMap.layers.ground[0])
        break;
        case 'above': case 'below':
        let i = 0 
        do {
            console.log(i)
            //Check if Layer exists
            if(!World.activeMap.layers[tileType][i]){ 
                let layer = World.activeMap.core.createBlankLayer(tileType+`${i}`, World.activeMap.tilesets ,0 ,0 ,World.activeMap.core.width, World.activeMap.core.height ,World.activeMap.core.tileWidth ,World.activeMap.core.tileHeight)
                World.activeMap.layers[tileType][i] = layer
                tileSet = true
            }
            //Check if tile is empty
            selectedTile = World.activeMap.core.getTileAtWorldXY(World.pointer.worldX, World.pointer.worldY,false, World.cameras.main, World.activeMap.layers[tileType][i])
            if(!selectedTile){
                let id = currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid
                World.activeMap.core.putTileAtWorldXY(id, World.pointer.worldX, World.pointer.worldY ,false, World.cameras.main, World.activeMap.layers[tileType][i] )
                tileSet = true
                console.log('plop')
            }
            //Checks if ID of selected tile is already present and cancels function if this is the case
            else if(selectedTile.index == currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid)
            tileSet = true

            //Increments and tries on the next layer
            i++
        } while(!tileSet)
        break;
    }
    
}

export default placeTile