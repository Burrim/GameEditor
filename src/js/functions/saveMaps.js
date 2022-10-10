
export default function saveMaps(){
    //document.getElementById('saveCover').style.display = 'block'
    //Itterates trough maps and saves those which were changed since the last save
    Object.values(World.maps).forEach(map =>{
        //Itterates over every chunk in a given map and writes it to files
        map.chunks.forEach(chunk =>{
            if(!chunk.changed) return //Skips chunks that have not been changed
           let data = saveChunk(chunk,map)
           fs.writeFileSync(`${window.path}/mapData/maps/${map.id}/chunks/${data.id}.json`, JSON.stringify(data, null, 3))
        })

        //Itterates over every Paralaxmap
        Object.values(map.paralaxMaps).forEach(paralaxMap =>{
            paralaxMap.chunks.forEach(chunk =>{
                if(!chunk.changed) return //Skips chunks that have not been changed
                let data = saveChunk(chunk,paralaxMap)
                fs.writeFileSync(`${window.path}/mapData/maps/${map.id}/paralax/${paralaxMap.config.id}/chunks/${data.id}.json`, JSON.stringify(data, null, 3))
            })
        })
    })
    ctrl = false
    alert('Project Saved')
}

// --- Save Chunk ----------------------------------------------------------------------------

function saveChunk(chunk,map){
    if(!chunk.changed) return //Skips chunks that have not been changed
    //Prepares Object to write in to json
    let chunkData = {
        id:`${chunk.x}-${chunk.y}`,
        x: chunk.x,
        y: chunk.y,
        meta:[],
        layers:[],
        objects:[]
    }

    //Itterates over every object, collects all necessary data and pushes it to the chunk Data
    chunk.objects.forEach(obj =>{
        let x = Math.floor(obj.x/map.config.tilewidth/map.config.chunkSize)+1
        let y = Math.floor(obj.y/map.config.tileheight/map.config.chunkSize)+1
        let objData = {
            name:obj.name,
            data: obj.data, //Merges custom data inside the object with the parent data from the objectlist
            editorData:obj.editorData,
            position: {x:obj.x,y:obj.y}
    }
    chunkData.objects.push(objData)
})

    for(let i = 0; i < map.config.chunkSize*map.config.chunkSize; i++){ chunkData.meta.push({})} //Fills meta with empty objects
    //Itterates trough every Layer and collects data to write to add to the chunk
    chunk.layers.forEach((layer,index) =>{
        let layerData = {
            name:`layer${index}`,
            config: {}, //can be used for special layer
            data: []
        }

        //Itterates trough every tile in the layer and extracts the index
        let height = map.config.chunkSize //Value is separated so it can be overwritten in the future trough a custom config or similiar
        for(let i = 0; i < height; i++){
            let arr = []
            map.core.getTilesWithin(0,i,map.config.chunkSize,1,null,layer).forEach((tile,index) =>{
                arr.push(tile.index)
                //Copies every prop to the meta array
                if(tile.index != -1)
                Object.entries(map.getPropsFromTileset(tile.index)).forEach(prop =>{
                    chunkData.meta[index + i*height][prop[0]] = prop[1]
                })

            })
            layerData.data.push(arr)
        }
        chunkData.layers.push(layerData)
    })
    //After the whole chunk is prepared
    return chunkData
    chunk.changed = false
}


   