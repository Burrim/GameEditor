export default function selectTiles(){
   

    //Process Data from selectionRec so it can also be used in case it is drawn in an other way than top-left to bottom-right
    let selectionBox = {
        x:World.selectingRec.x,
        y:World.selectingRec.y,
        width: World.selectingRec.width,
        height: World.selectingRec.height,
    }
    if(selectionBox.width < 0){
        selectionBox.width = Math.abs(selectionBox.width)
        selectionBox.x -= selectionBox.width
    }
    if(selectionBox.height < 0){
        selectionBox.height = Math.abs(selectionBox.height)
        selectionBox.y -= selectionBox.height
    }

    let selection ={
        layers: [],
        width: selectionBox.width/World.map.config.tilewidth,
        height: selectionBox.height/World.map.config.tileheight,
    }

    for(let i = 0; i < selection.height; i++){

        //Get all Chunks on this line
        let chunks = World.map.getChunksByPixelCord(
            selectionBox.x, selectionBox.y,
            selectionBox.width, selectionBox.height
        )
    
        //--- Collects small arrays from every layer in every chunk on this line ---
        let chunkData = [] //Array for the collections of all layers from every chunk
        chunks.forEach(chunk =>{
            console.log(chunk.id)
            let chunkLayers = [] //Collection of all layers from this chunk
            chunk.layers.forEach((layer,index) =>{
                //calculates start and ending point of tile collection
                let x = selectionBox.x
                let y = selectionBox.y + i*World.map.config.tileheight + 1
                let width = Math.abs(selectionBox.width)
                //If starting Point doesn't align with selecting req x and the width has to be adjusted
                if(x < layer.x){
                    x = layer.x
                    width -= x - selectionBox.x
                }
                
                //Gets every tile in the line
                let layerData = World.map.core.getTilesWithinWorldXY(x,y,width,1,null,null,layer)
                chunkLayers.push(layerData)
            })
            chunkData.push(chunkLayers)
        })
        
        //--- Goes trough the collected arrays and merges all that share the same layer ---
        let j = 0
        while(true){
            //Checks if any arrays are left to process
            let finished = true
            chunkData.forEach(entry =>{
                if(entry[j] != undefined) finished = false
            })
            if(finished) break;

            let arr = []
            chunkData.forEach(entry => {
                //When there isn't a layer left on this chunk a placeholder array with the same length as the first is created
                if(entry[j] == undefined){
                    entry[j] = []
                    for(let b = 0; b < entry[0].length; b++){entry[j].push(-1)} 
                }
                else{
                    //Converts tiles in to indexes
                    for(let z = 0; z < entry[j].length; z++){ entry[j][z] = entry[j][z].index}
                }
                arr = arr.concat(entry[j])
            })
            
            if(selection.layers[j] == undefined){selection.layers[j] = []} //Creates array in the collected parent if not already present for that layer
            selection.layers[j].push(arr)
            
            j++
        }
    }

    console.log(selection)
    return selection


}
