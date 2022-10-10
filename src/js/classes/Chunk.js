
import placeObject from "../functions/placeObject"


export default class Chunk{
    constructor(parent,x,y){
        this.changed = false //Tracks if the Chunk got any changes that need to be saved
        this.parent = parent
        this.chunkSize = this.parent.config.chunkSize
        this.totChunkSize = this.parent.config.chunkSize*this.parent.config.tilewidth
        this.background =  World.add.rectangle((x-1)*this.totChunkSize, (y-1)*this.totChunkSize, this.totChunkSize, this.totChunkSize ,"0x777777").setDepth(-1).setOrigin(0)
        this.layers = []
        this.objects = []

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
        this.id = `${x}-${y}`

        this.loadObjects()
    }
    open(){
        this.background.setVisible(true)
        this.layers.forEach(layer =>{
            layer.setVisible(true)
        })
    }
    close(){
        this.background.setVisible(false)
        this.layers.forEach(layer =>{
            layer.setVisible(false)
        })
    }
    createLayer(){
        let layer = this.parent.getEmptyLayer()
        layer.x = (this.x-1)*this.parent.config.chunkSize*this.parent.config.tilewidth
        layer.y = (this.y-1)*this.parent.config.chunkSize*this.parent.config.tileheight
        this.layers.push(layer)
    }
    loadObjects(){
        this.data.objects.forEach(obj =>{
            placeObject(obj.position,obj,this.parent,this)
        })
    }
    removeObject(id){
        this.objects.forEach((obj,index) =>{
            if(obj.id == id){
                return this.objects.splice(index,1)
            }
        })
    }
}