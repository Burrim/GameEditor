export default function createChunkCover(x,y){
    return new ChunkCover(x,y)
}

class ChunkCover{
    constructor(x,y){
        this.highlighter = World.add.rectangle(0,0,World.map.config.tilewidth*World.map.config.chunkSize*x,World.map.config.tileheight*World.map.config.chunkSize*y,"0x777777").setDepth(2).setAlpha(0.6)
        this.borders = []

        this.visible = false

        this.width = World.map.config.tilewidth*World.map.config.chunkSize
        this.height = World.map.config.tileheight*World.map.config.chunkSize

        this.x = x; this.y = y;

        
    }
    init(){
        let maxX = Math.ceil(this.x/2)
        let maxY = Math.ceil(this.y/2)

        for(let cordX = -Math.ceil(this.x/2); cordX < maxX; cordX++){
            for(let cordY= -Math.ceil(this.y/2); cordY < maxY; cordY++){
                this.createBorder(cordX,cordY)
            }
        }
    }
    createBorder(cordX,cordY){
        let x = cordX * World.map.config.tilewidth * World.map.config.chunkSize;
        let y = cordY * World.map.config.tileheight * World.map.config.chunkSize;
        console.log(cordX,cordY)
        let border = {
            rect: World.add.rectangle(x,y,this.width,this.height).setDepth(20).setOrigin(0).setStrokeStyle(5, 0xffffff).setVisible(true),
            number: World.add.text(x + (this.width/2), y + (this.height/2),`${cordX+1} | ${cordY+1}`,{fontSize:96,stroke: '#FFFFFF',strokeThickness: 6}).setDepth(20).setOrigin(0.5).setVisible(true)
        }
        this.borders.push(border)
    }
    setVisible(value){
        //Initializes all objects when opened the first time
        if(this.borders.length == 0){
            this.init()
            return
        }
        this.borders.forEach(element =>{
            element.rect.setVisible(value)
            element.number.setVisible(value)
            this.visible = value
        })
    }
}