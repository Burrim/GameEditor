import removeTile from "./removeTile";

export default function deleteArea(cordX,cordY,width,height){
    if(width < 0){
        width = Math.abs(width)
        cordX -= width
    }
    if(height < 0){
        height = Math.abs(height)
        cordY -= height
    }

    for(let y = 0; y < height; y += World.map.config.tileheight){
        for(let x = 0; x < width; x += World.map.config.tilewidth){
            removeTile(Math.floor((cordX+x)/World.map.config.tilewidth), Math.floor((cordY+y)/World.map.config.tileheight))
        }
    }
}