
const saveMaps = () => {

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
        //Saves Map
        fs.writeFileSync(`${window.path}/mapData/maps/${key}.json`, JSON.stringify(map, null, 5))
        World.maps[key].wip = false
        console.log(map)
    });
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