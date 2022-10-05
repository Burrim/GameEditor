
import Phaser from "phaser";
import HistoryObject from "../History";
import Chunk from "./Chunk";

export default class Map{
    constructor(data){
        this.core = World.make.tilemap({ tileWidth: data.tileWidth, tileHeight: data.tileHeight, width:data.width,height:data.height})
        this.config = data
        this.chunkData = files.maps[data.id].chunks
        this.id = data.id
        this.history = new HistoryObject()

        this.chunks = []
        this.objects = []
        
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

    }
    loadAllChunks(){
        this.chunkData.forEach(data =>{
            this.loadChunk(data.x,data.y)
        })
    }
    getChunksByPixelCord(x,y,width,height){
        let arr = []
        let tempWidth
        while(height > 0){
            tempWidth = width
            while( tempWidth > 0){
                let chunk = this.getChunkByPixelCord(x,y)
                tempWidth -= (chunk.layers[0].x+100000) + chunk.layers[0].width - (x +100000) //The + 100000 nakes it so the numbers are never negative which would fuck up the formula
                x = chunk.layers[0].x + chunk.layers[0].width
                arr.push(chunk)
            }
            height -= (arr[arr.length-1].layers[0].y+100000) + arr[arr.length-1].layers[0].height - (y+100000)  
        }
        console.log(arr)
        return arr
    }
    getChunksByTileCord(x,y,width,height){ return this.getChunks(Math.floor(x/this.config.chunkSize)+1, Math.floor(y/this.config.chunkSize)+1, Math.floor(width/this.config.chunkSize)+1, Math.floor(height/this.config.chunkSize)+1)}
    getChunks(x,y,width,height){
        //console.log(x,y,width,height)
        let arr = []
        for(let i = 0; i < height; i++){
            for(let j = 0; j < width; j++){
                arr.push(this.getChunk(x+j,y+i))
            }
        }
        return arr

    }
    getChunkByPixelCord(x,y,create){return this.getChunkByTileCord( Math.floor(x/this.config.tilewidth), Math.floor(y/this.config.tileheight)+1, create) }
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
            id:`${x}-${y}`,
            x:x,
            y:y,
            layers:[{
                data:[],
                name: 'layer1'
            }],
            meta:[],
            objects: []
        }

        //Forms the Id format for the chunk
        data.id = [`${x}`,`${y}`]
        data.id.forEach(id =>{
            while (id.length < 3){ id = '0'+id }
        })

        this.chunkData.push(data)
        let chunk = new Chunk(this,x,y)
        chunk.changed = true
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
                layer = this.core.createBlankLayer(this.layers.length,this.tilesets,0,0,32);
                this.layers.push(layer)
            }
            return layer   
    }
    getPropsFromTileset(id){
        //Gets tile properties in object form according to the given id
        let output = {}
        for(let i = 0; i < this.tilesets.length; i++){
            if(this.tilesets[i].firstgid <= id && id < this.tilesets[i].total + this.tilesets[i].firstgid){
                this.tilesets[i].tileData[id - this.tilesets[i].firstgid].properties.forEach(prop=>{
                    output[prop.name] = prop.value
                })
                return output
            }
        }
    }
    open(){
        this.chunks.forEach(chunk =>{
            chunk.open()
        })
    }
    close(){}
    }