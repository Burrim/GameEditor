export default class Structure{
    constructor(x,y,data){
        this.layers = []
        this.x = x; this.y = y; this.data = data

        //Adds Layers and copies structures Data on to them
        for(let i = 0; i < data.layers.length; i++){
            let layer = Structures.map.createBlankLayer(this.layers.length,World.map.tilesets)
            Structures.map.putTilesAt(data.layers[i],0,0,true,layer)
            layer.setPosition(Structures.config.entryWidth*this.x ,Structures.config.entryHeight*this.y)
            this.layers.push(layer)
        }
        console.log(Structures.config.entryWidth, this.x)
        console.log("cover props",Structures.config.entryWidth*this.x ,Structures.config.entryHeight*this.y,Structures.config.entryWidth, Structures.config.entryHeight)
        this.cover = Structures.add.rectangle(Structures.config.entryWidth*this.x ,Structures.config.entryHeight*this.y,Structures.config.entryWidth, Structures.config.entryHeight,0xffffff)
        this.cover.setInteractive().setOrigin(0).setAlpha(0)

        this.cover.on("touchdown",()=>{World.customCache = this.data})

        console.log('fuck2')
    }
}