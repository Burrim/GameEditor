import placeTile from "./placeTile";

export default function multiplace(data,xPos,yPos){
    World.input.activePointer.updateWorldPoint(World.cameras.main)


    let xCord = Math.floor(World.pointer.worldX / World.map.config.tilewidth)
    let yCord = Math.floor(World.pointer.worldY / World.map.config.tileheight)

    if(xPos != undefined) xCord = xPos
    if(yPos != undefined) yCord = yPos

    data.layers.forEach(layer =>{
        for(let y = 0; y < layer.length; y++){
            for(let x = 0; x < layer[y].length; x++){
                if(layer[y][x] > -1){
                    placeTile(xCord + x, yCord + y,layer[y][x])
                }
                
            }
        }
    })
}