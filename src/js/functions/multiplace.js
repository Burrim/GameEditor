import placeTile from "./placeTile";

export default function multiplace(data){
    World.input.activePointer.updateWorldPoint(World.cameras.main)

    console.log('do the place')

    let xCord = Math.floor(World.pointer.worldX / World.map.config.tilewidth)
    let yCord = Math.floor(World.pointer.worldY / World.map.config.tileheight)

    data.layers.forEach(layer =>{
        for(let y = 0; y < layer.length; y++){
            for(let x = 0; x < layer[y].length; x++){
                if(layer[y][x] > -1){
                    console.log(layer[y][x])
                    placeTile(xCord + x, yCord + y,layer[y][x])
                }
                
            }
        }
    })
}