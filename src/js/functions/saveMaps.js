
const saveMaps = () => {
    document.getElementById('saveCover').style.display = 'block'
    //Itterates trough maps and saves those which were changed since the last save
    Object.keys(World.maps).forEach(key => {
        if(!World.maps[key].wip) return
        
        let map = files.maps[key]
        map.layers = []

        //Creates Meta Layer. Additional layer that stores every tile attribute of the other layers
        let meta = new LayerTemplate({
            map: World.maps[key],
            id: map.layers.length,
            name: `meta`,
            tileData : []
        })
        //Fills meta layer with empty tiles
        for(let i = 0; i< meta.width * meta.height; i++){
            meta.data.push(0)
        }
        map.layers.push(meta)

        //Cycles trough the types of layers
        Object.keys(World.maps[key].layers).forEach(layerKey => {

            console.log(layerKey, World.maps[key].layers[layerKey].length)

            //Cycles trough The layers of the same type
            for(let i = 0; i < World.maps[key].layers[layerKey].length; i++){ 

                //Creates Layerobject
                let layer = new LayerTemplate({
                    map: World.maps[key],
                    id: map.layers.length,
                    name: `${layerKey}${i}`,
                })

                //Cycles trough every Tile of a selected layer
                World.maps[key].core.getTilesWithin(
                0,0,  World.maps[key].layers[layerKey][i].width,  World.maps[key].layers[layerKey][i].height, null, World.maps[key].layers[layerKey][i]).forEach( (tile, index) =>{
                    
                    //Creates empty object for meta layer if it does not already exist
                    if(!meta.tileData[index]) meta.tileData[index] = {}

                    //Pushes Tile Properties to meta layer
                    if(tile.index == -1) layer.data.push(0) //Edge case to prevent crash
                    else layer.data.push(tile.index)
                    
                    Object.keys(tile.properties).forEach(propKey => {
                        if(propKey == 'type') return
                        meta.tileData[index][propKey] = tile.properties[propKey]
                    }) 
                })
                //Adds layer to map
                map.layers.push(layer)
            }
            
        })
        //Prepares Map Objects
        map.objects = []
        World.maps[key].objects.forEach(obj => {
            //Creates new Object for data storage
            let entry = {
                name: obj.data.name,
                position: {x:obj.x,y:obj.y},
                customData: obj.data.customData,
                editorData: obj.data.editorData,
                data: {}
            }
            //Inserts Custom Data indirectly so it gets not linked per reference with the datasource
            Object.keys(entry.customData).forEach(key => {
                entry.data[key] = entry.customData[key]
            })

            //Gets the original Data and fills all values that are not already taken by custom ones.
            //Important so that you can change default values of objects even after already a lot of pieces are placed on the map
            let sourceData = obj.getSource()
            Object.keys(sourceData).forEach(key => {
                if(!entry.data[key])
                entry.data[key] = sourceData[key] 
            })
            map.objects.push(entry)
        })

        //Saves Map
        fs.writeFileSync(`${window.path}/src/mapData/maps/${key}.json`, JSON.stringify(map, null, 5))
        document.getElementById('saveCover').style.display = 'none'
        //World.maps[key].wip = false For debug reasons deactivated
        console.log(map)
    });
    ctrl = false
    alert('Project Saved')
    
}

class LayerTemplate {
    constructor(config){
        this.data = []
        this.tileData = config.tileData
        this.id = config.id;
        this.name = config.name;
        this.opacity = 1;
        this.visible = true;
        this.x = 0;
        this.y = 0;
        this.width = config.map.core.width;
        this.height = config.map.core.height;
        this.type = 'tilelayer'
    }
}

export default saveMaps