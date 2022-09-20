//New Map Loader used for Chunk Based Maps
import Phaser from "phaser";

// ***** Object Exporter *************************************************************************************************************************************************************

export default function loadChunkMap(key){
    console.log(files.maps[key].core)
    let map = new Map(files.maps[key].core)

    map.loadChunk(1,1)
    map.loadChunk(1,2)
    map.loadChunk(2,1)
    map.loadChunk(2,2)

    World.maps[key] = map
    World.map = map
}

// ***** Map Class *************************************************************************************************************************************************************

class Map{
    constructor(data){
        this.core = World.make.tilemap({ tileWidth: data.tileWidth, tileHeight: data.tileHeight, width:data.width,height:data.height})
        this.config = data
        this.chunkData = files.maps[data.id].chunks

        this.chunks = []
        
        //Loads Tilesets
        this.tilesets = []
        this.tilesetTilecount = 0
        data.tilesets.forEach(key => {
            let tilesetData = files.tilesets[key].data
            let tileset = new Phaser.Tilemaps.Tileset(key,this.tilesetTilecount,tilesetData.tileWidth,tilesetData.tileHeight,tilesetData.tileMargin,tilesetData.tileSpacing,null,tilesetData.tiles);
            this.tilesetTilecount += tileset.tileData.length //Increases Starting Index for the next Tileset
            tileset.setImage(World.textures.get(tilesetData.image))
            this.tilesets.push(tileset)
        });
        this.layers = []
    }
    loadChunk(x,y){
        let chunk = new Chunk(this,x,y)
        this.chunks.push(chunk)
        //Searches Chunk with the corresponding coordinates
    }
    getChunkByTileCord(x,y,create){ return this.getChunk( Math.floor(x/this.config.chunkSize)+1, Math.floor(y/this.config.chunkSize)+1, create)}
    getChunk(x,y,create){
        let target
        this.chunks.forEach(chunk =>{
            if(chunk.x == x && chunk.y == y) target = chunk
        })
        if( target != undefined) return target
        else if(create) return this.createEmptyChunk(x,y)
    }
    createEmptyChunk(x,y){
        //Creates empty Chunk Data Object
        let data = {
            x:x,
            y:y,
            layers:[{
                data:[],
                name: 'layer1'
            }],
            meta:[]
        }

        //Forms the Id format for the chunk
        data.id = [`${x}`,`${y}`]
        data.id.forEach(id =>{
            while (id.length < 3){ id = '0'+id }
        })

        this.chunkData.push(data)
        let chunk = new Chunk(this,x,y)
        this.chunks.push(chunk)
        return chunk
    }
    getEmptyLayer(){
        let layer
        for(let i = 0; i < this.layers.length; i++){
            if(!this.layers[i].active){
                layer = this.layers[i]
                layer.setVisible(true).setActive(true)
                layer.background.setVisible(true)
            }}
            
            if(layer == undefined){
                layer = this.core.createBlankLayer(this.layers.length,this.tilesets);
                layer.background =
                this.layers.push(layer)
            }
            return layer   
    }
    open(){
        this.chunks.forEach(chunk =>{
            chunk.open()
        })
    }
    close(){}
    }

// ***** Chunk Class *************************************************************************************************************************************************************

class Chunk{
    constructor(parent,x,y){
        this.parent = parent
        this.chunkSize = this.parent.config.chunkSize
        this.totChunkSize = this.parent.config.chunkSize*this.parent.config.tilewidth
        this.background =  World.add.rectangle((x-1)*this.totChunkSize, (y-1)*this.totChunkSize, this.totChunkSize, this.totChunkSize ,"0x777777").setDepth(-1).setOrigin(0)
        this.layers = []

        //Seaches trough Chunkdata in parent Map and assigns it to this object
        for(let i = 0; i < parent.chunkData.length; i++){
            if(parent.chunkData[i].x == x && parent.chunkData[i].y == y ){
                this.data = parent.chunkData[i]
                break;
        }}

        this.data.layers.forEach(layerData =>{
            let layer = this.parent.getEmptyLayer()
            parent.core.putTilesAt(layerData.data,0,0,true,layer)
            layer.x = (x-1)*parent.config.chunkSize*parent.config.tilewidth
            layer.y = (y-1)*parent.config.chunkSize*parent.config.tileheight
            this.layers.push(layer)
        })        

        this.x = x
        this.y = y
    }
    open(){
        this.background.setVisible(true)
        this.layers.forEach(layer =>{
            layer.setVisible(true)
        })
    }
    createLayer(){
        let layer = this.parent.getEmptyLayer()
        layer.x = (this.x-1)*this.parent.config.chunkSize*this.parent.config.tilewidth
        layer.y = (this.y-1)*this.parent.config.chunkSize*this.parent.config.tileheight
        this.layers.push(layer)
    }

}