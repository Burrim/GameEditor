import multiplace from "./multiplace"

export function bucketSelect(x,y){
    let chunk = World.map.getChunkByTileCord(x,y)
    let tile = World.map.core.getTileAt(x-(chunk.x-1)*World.map.config.chunkSize,y-(chunk.y-1)*World.map.config.chunkSize,true,chunk.layers[chunk.layers.length-1])

    World.bucket = new Bucket(tile.index,currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid)
    World.bucket.checkTile(x,y)
    World.bucket.process()
    multiplace(World.bucket.data,World.bucket.minX,World.bucket.minY)
}

export function bucketFill(){
    
}

class Bucket{
    constructor(baseIndex, fillIndex){
        this.baseIndex = baseIndex
        this.fillIndex = fillIndex
        this.savedTiles = []
        this.maxTiles = 5000
        this.checking = 0
    }
    checkTile(x,y){
        this.checking++
        //Checks if the tile was already included in the list.
        let abort = false
        for(let i = 0; i < this.savedTiles.length; i++){
            if(this.savedTiles[i].x == x && this.savedTiles[i].y == y){
                abort = true
                break;
        }}
        if(abort){
            this.checking--
            return
        }

        let chunk = World.map.getChunkByTileCord(x,y)

        //Checks tiles for their index until a non-empty tile gets choosen
        let layerIndex = chunk.layers.length-1; let tile
        while(layerIndex >= 0){
            tile = World.map.core.getTileAt(x-(chunk.x-1)*World.map.config.chunkSize,y-(chunk.y-1)*World.map.config.chunkSize,true,chunk.layers[layerIndex])
            if(tile.index != -1)break;
            else layerIndex--
        }


        //Saves tile and continues the chain if the tile fits the requirements
        if(tile.index == this.baseIndex || tile.index == -1){
            this.savedTiles.push({x:x,y:y})
            if(this.savedTiles.length >= this.maxTiles){
                return
            }
            this.checkTile(x+1,y)
            this.checkTile(x,y+1)
            this.checkTile(x-1,y)
            this.checkTile(x,y-1)
        }
        this.checking--
    }
    process(){
        //Searches for the edge values for construction of a 2d Array
        this.minX = this.savedTiles[0].x
        this.maxX = this.savedTiles[0].x
        this.minY = this.savedTiles[0].y
        this.maxY = this.savedTiles[0].y
        this.savedTiles.forEach(data =>{
            if(data.x < this.minX) this.minX = data.x
            else if(data.x > this.maxX) this.maxX = data.x
            if(data.y < this.minY) this.minY = data.y
            else if(data.y > this.maxY) this.maxY = data.y
        })

        //Prepares data container
        this.data = {
            layers: [[]],
            width: this.maxX - this.minX+1,
            height: this.maxY - this.minY+1 
        }

        //Prepares empty 2d array
        for(let y = 0; y < this.data.height; y++){
            this.data.layers[0].push([])
            for(let x = 0; x < this.data.width; x++){
                this.data.layers[0][y].push(-1)
            }
        }
        this.savedTiles.forEach(tile =>{
            this.data.layers[0][tile.y-this.minY][tile.x-this.minX] = this.fillIndex
        })



    }
    
}