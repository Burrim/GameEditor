export default function removeTile(X,Y){
    //Run Checks

    if(World.map == undefined) return; //Cancels if there is no active Map

    World.input.activePointer.updateWorldPoint(World.cameras.main)

    //Sets target coordinates. Takes Pointer coordinates if no specifics are given
    let x; let y
    if(X != undefined) x = X
    else x = Math.floor(World.pointer.worldX / World.map.config.tilewidth)
    if(Y != undefined) y = Y
    else y = Math.floor(World.pointer.worldY / World.map.config.tileheight)

    console.log("cords",x,y)

    let chunk = World.map.getChunkByTileCord(x,y) //Gets Chunk below cursor or creates new one if necessary
    if(!chunk) return
    //changes coordinates to be relative to the chunk
    x = x-(chunk.x-1)*chunk.chunkSize
    y = y-(chunk.y-1)*chunk.chunkSize
 
    for(let i = chunk.layers.length; i >= 0; i--){
        let target = World.map.core.getTileAt(x, y,false, chunk.layers[i])
        if(target != null && target.index != -1){
            World.map.history.addEntry(target, target.index, -1,'tileChange')
            World.map.core.putTileAt(-1, x, y,false, chunk.layers[i] )
        }

    }

    chunk.changed = true

}

