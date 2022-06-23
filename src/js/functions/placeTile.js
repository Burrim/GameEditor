import getTileProps from './getTileProp'



const placeTile = (X,Y) =>{
    //Run Checks
    //if(World.activeMap == undefined)return; //Cancels if there is no active Map
    if(!tileset.selected) return //Returns if no tile is selected
    if( document.querySelectorAll( ":hover" )[3].id != 'parent') return //Checks if there is no element above the phaser canvas

    //Sets target coordonate
    let x = World.pointer.worldX
    let y = World.pointer.worldY
    if(X) x = X 
    if(Y) y = Y

    let tileType = getTileProps(currentTileset.data.tiles[tileset.selected].properties, "type")
    let tileSet = false //Flag for when the tile wa succesfully placed
    let selectedTile;
    let placedTile; //For Debug reasons
    
    switch(tileType){
        case 'ground':
            //Check if Layer exists
            if(!World.activeMap.layers.ground[0]){ 
                let layer = World.activeMap.core.createBlankLayer(`ground`, World.activeMap.tilesets ,0 ,0 ,World.activeMap.core.width, World.activeMap.core.height ,World.activeMap.core.tileWidth ,World.activeMap.core.tileHeight)
                World.activeMap.layers.ground[0] = layer
            }
        let id = currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid
        console.log(currentTileset.data.tiles[tileset.selected].id, currentTileset.data.firstgid) 
        placedTile = World.activeMap.core.putTileAtWorldXY(id, x, y ,false, World.cameras.main, World.activeMap.layers.ground[0] )
        World.activeMap.history.addEntry(placedTile, 0, id)
        break;
        case 'above': case 'below':
        let i = 0 
        do {
            //Check if Layer exists
            if(!World.activeMap.layers[tileType][i]){ 
                let layer = World.activeMap.core.createBlankLayer(tileType+`${i}`, World.activeMap.tilesets ,0 ,0 ,World.activeMap.core.width, World.activeMap.core.height ,World.activeMap.core.tileWidth ,World.activeMap.core.tileHeight)
                World.activeMap.layers[tileType][i] = layer
                tileSet = true
            }
            //Check if tile is empty and places tile if this is the case
            selectedTile = World.activeMap.core.getTileAtWorldXY(x, y,false, World.cameras.main, World.activeMap.layers[tileType][i])
            if(!selectedTile){
                let id = currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid
                //Places Tile and sets properties according to tileset Data (Props aren't updatet automatically)
                placedTile = World.activeMap.core.putTileAtWorldXY(id, x, y ,false, World.cameras.main, World.activeMap.layers[tileType][i] )
                World.activeMap.history.addEntry(placedTile, 0, id)
                currentTileset.data.tiles[tileset.selected].properties.forEach(prop => {
                    placedTile.properties[prop.name] = prop.value
                });
                

                tileSet = true
            }
            //Checks if ID of selected tile is already present and cancels function if this is the case. Otherwise the next layer upwards is checked
            else if(selectedTile.index == currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid)
            tileSet = true

            //Increments and tries on the next layer
            i++
        } while(!tileSet)
        console.log(selectedTile)
        console.log(placedTile)
        break;
    }
    
}

export default placeTile