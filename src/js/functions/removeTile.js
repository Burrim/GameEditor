export default function removeTile(X,Y){
    //Run Checks

    if(World.map == undefined) return; //Cancels if there is no active Map

    World.input.activePointer.updateWorldPoint(World.cameras.main)

    //Sets target coordinates. Takes Pointer coordinates if no specifics are given
    let x; let y
    if(X) x = X
    else x = Math.floor(World.pointer.worldX / World.map.config.tilewidth)
    if(Y) y = Y
    else y = Math.floor(World.pointer.worldY / World.map.config.tileheight)

    let chunk = World.map.getChunkByTileCord(x,y) //Gets Chunk below cursor or creates new one if necessary
    if(!chunk) return
    //changes coordinates to be relative to the chunk
    x = x-(chunk.x-1)*chunk.chunkSize
    y = y-(chunk.y-1)*chunk.chunkSize
 
    for(let i = chunk.layers.length; i >= 0; i--){
        World.map.core.putTileAt(0, x, y,false, chunk.layers[i] )
    }

}

