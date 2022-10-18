export default class Structure_Container{
    constructor(x,y,data){
        this.layers = []
        this.x = x; this.y = y; this.data = data

        //Adds Layers and copies structures Data on to them
        for(let i = 0; i < data.layers.length; i++){
            let layer = Structures.map.createBlankLayer(`${Structures.elements.length}-${this.layers.length}`,Structures.tilesets,0,0,data.width,data.height )
            Structures.map.putTilesAt(data.layers[i],0,0,true,layer)

            layer.setPosition(Structures.config.entryWidth*this.x ,Structures.config.entryHeight*this.y)

            //Scale the Structure to fit in to the catalogue
            let longestSide
            if(data.width >= data.height) longestSide = data.width * 32
            else longestSide = data.height * 32

            let targetScale = (Structures.config.entryHeight*0.9) / longestSide
            if(targetScale < 1) layer.setScale(targetScale)

            layer.y -= (layer.height * targetScale - Structures.config.entryHeight)/2
            layer.x -= (layer.width * targetScale - Structures.config.entryWidth)/2

            this.layers.push(layer)
        }
       
        this.cover = Structures.add.rectangle(Structures.config.entryWidth*this.x ,Structures.config.entryHeight*this.y,Structures.config.entryWidth, Structures.config.entryHeight,0xffffff)
        this.cover.setInteractive().setOrigin(0).setAlpha(0.2).setDepth(-1)
        this.cover.on("pointerdown",()=>{World.customCache = this.data; console.log('touch')})
         
        this.deleteButton = Structures.add.image(this.cover.getTopRight().x,this.cover.getTopRight().y,'editor-delete').setOrigin(1,0).setDepth(2)
        this.deleteButton.setInteractive()
        this.deleteButton.on("pointerdown",()=>{fs.unlinkSync(path+'/mapData/structures/'+this.data.id+".json"); Structures.scene.restart("Structures")})

    }
}