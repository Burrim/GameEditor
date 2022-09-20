import getTileProps from './getTileProp'



const placeTile = (X,Y,id,config) =>{
    //Run Checks
    if(World.map == undefined)return; //Cancels if there is no active Map
    if(!tileset.selected) return //Returns if no tile is selected

    World.input.activePointer.updateWorldPoint(World.cameras.main)

    //Sets target coordinates. Takes Pointer coordinates if no specifics are given
    let x; let y
    if(X) x = X
    else x = Math.floor(World.pointer.worldX / World.map.config.tilewidth)
    if(Y) y = Y
    else y = Math.floor(World.pointer.worldY / World.map.config.tileheight)

    let chunk = World.map.getChunkByTileCord(x,y,true) //Gets Chunk below cursor or creates new one if necessary
    //changes coordinates to be relative to the chunk
    x = x-(chunk.x-1)*chunk.chunkSize
    y = y-(chunk.y-1)*chunk.chunkSize

    //let tileType = getTileProps(currentTileset.data.tiles[tileset.selected].properties, "type")

    let tileSet = false //Flag for when the tile wa succesfully placed
    let selectedTile;
    let placedTile; //For Debug reasons
    
    let i = 0 
    do {
        //Check if Layer exists. If not creates new and places Tile
        if(!chunk.layers[i]){
            if(debug.tileCreation) console.log(`Layer ${i} in Chunk not yet generated`)
            chunk.createLayer() 
            World.map.core.putTileAt(id, x, y,false, chunk.layers[i] )
            if(debug.tileCreation)console.log(`tile with id ${id} placed on layer ${i}`)
            break
        }
        //Check if tile is empty and places tile if this is the case
        selectedTile = World.map.core.getTileAt(x, y,false, chunk.layers[i] )
        if(!selectedTile){
            //Places Tile and sets properties according to tileset Data (Props aren't updatet automatically)
            placedTile = World.map.core.putTileAt(id, x, y ,false, chunk.layers[i] )
            if(debug.tileCreation)console.log(`tile with id ${id} placed on layer ${i}`)
            //World.activeMap.history.addEntry(placedTile, 0, id)
            currentTileset.data.tiles[tileset.selected].properties.forEach(prop => {
                placedTile.properties[prop.name] = prop.value
            });
            break
        }
        //Checks if ID of selected tile is already present and cancels function if this is the case. Otherwise the next layer upwards is checked
        else if(selectedTile.index == currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid){
            if(debug.tileCreation) console.log(`tile with id ${id} is already present on these coordinates`)
            break
        }
       

        //Increments and tries on the next layer
        if(debug.tileCreation && !tileset)console.log(`layer ${i} is already full`)
        i++
    } while(true) //Loops function until a tile is placed
    
}

export default placeTile