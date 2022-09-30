export default function selectTiles(){
    let selection ={
        layers: [],
        width: World.selectionRec.width/World.map.config.tilewidth,
        height: World.selectionRec.height/World.map.config.tileheight,
    }
    for(let i = 0; i < height; i++){
        //Method not yet written
        //World.map.getChunksWithinPyxelXY()

        //scoure every chunks layer per layer line trough line
    }
}

//Creates 2d Array according to given width and height
createEmptyLayer = function(width,height){
    let layer = []
    for(let i = 0; i < height; i++){
        let row = []
        for(let j = 0; i < width; j++){
            row.push(null)
        }
        layer.push(row)
    }
}