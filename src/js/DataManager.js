export default class DataManager
{
    constructor()
    {}

//************************************************************************************************************************************************************************** */

save()
{
    World.mapList.forEach( key =>{
        
        if(!World.maps[key].history.changed) return;

        let map = JSON.parse(fs.readFileSync(`${Setup.path}src/mapData/maps/${key}.json`))
        let indexes = []
        let temp = []
    
        //Index des Ground Layers Speichern
         World.maps[key].core.getTilesWithin(0,0,  World.maps[key].ground.layer.width,  World.maps[key].ground.layer.height, null,   World.maps[key].ground).forEach(element => {temp.push(element.index)});
        indexes.push(temp);
        temp = [];
    
        //Index der normalen Layer Speichern
        for(let i = 0; i <  World.maps[key].normal.length; i++)
        {
             World.maps[key].core.getTilesWithin(0,0,  World.maps[key].normal[i].layer.width,  World.maps[key].normal[i].layer.height, null,   World.maps[key].normal[i]).forEach(element => {temp.push(element.index)});
            indexes.push(temp);
            temp = [];
        }
    
        //Index der above Layer Speichern
        for(let i = 0; i <  World.maps[key].above.length; i++)
        {
             World.maps[key].core.getTilesWithin(0,0,  World.maps[key].above[i].layer.width,  World.maps[key].above[i].layer.height, null,   World.maps[key].above[i]).forEach(element => {temp.push(element.index)});
            indexes.push(temp);
            temp = [];
        }
        
        //Gesammelte Daten in JSON übertragen
        for(let i = 0; i < map.layers.length; i++)
        {
            map.layers[i].data = indexes[i]
        }

        //Tileset einfügen
        map.tilesets[0] = JSON.parse(fs.readFileSync(`${Setup.path}src/mapData/tilesets/${ World.maps[key].tilesetKey}.json`)) 

        //Daten schreiben
        fs.writeFileSync(`${Setup.path}src/mapData/maps/${key}.json`, JSON.stringify(map, null, 5))

        World.maps[key].history.changed = false //Setzt Flag, das Map editiert wurde zurück
    })
        
    
}

createMap() //config: mapName, width, height, tilewidth, tileheight, tileset
{
    //Daten aus HTML lesen
    let config = 
    {
        mapName: document.getElementById("createMap_name").value,
        tileset: document.getElementById("createMap_tileset").value,
        width: parseInt(document.getElementById("createMap_mapWidth").value),
        height: parseInt(document.getElementById("createMap_mapHeight").value),
        tilewidth: parseInt(document.getElementById("createMap_tileWidth").value),
        tileheight: parseInt(document.getElementById("createMap_tileHeight").value),
    }

    //Testet, ob alle Daten eingegeben wurden
   if(  config.mapName == "" || 
        config.tileset == "" ||
        config.width == "" ||
        config.height == "" ||
        config.tilewidth == "" ||
        config.tileheight == ""  )
    {  alert('Alle Felder müssen ausgefüllt sein')
       return }

    document.getElementById('createMap').style.display = 'none'

    //Objekte vorbereiten
    let map =
    {
        width : config.width,
        height : config.height,
        tilewidth : config.tilewidth,
        tileheight : config.tileheight,
        orientation: 'orthogonal',
        renderorder: 'right-down',
        tilesets: [],
        tilesetKey: config.tileset,
        layers: []
    }
    let layerdata = []

    //Daten enfügen
    map.tilesets.push(TM[config.tileset])
    for(let i = 0; i < map.width*map.height; i++)
    {
        layerdata.push(1)
    }
    for(let i = 0; i < 5; i++)
    {
        map.layers.push
        ({
            width: config.width,
            height : config.height,
            opacity: 1,
            type: 'tilelayer',
            visible: true,
            x : 0,
            y : 0,
            data : layerdata,
            name : ""
        })
    }
    map.layers[0].name = 'Ground';
    map.layers[1].name = 'Structure1';
    map.layers[2].name = 'Structure2';
    map.layers[3].name = 'Above1';
    map.layers[4].name = 'Above2';
 
    //Daten Schreiben

    fs.writeFileSync(`${Setup.path}src/mapData/maps/${config.mapName}.json`, JSON.stringify(map, null, 5))

    //Map Objekt erstellen
    World.loadMap(config.mapName)
    World.mapList.push(config.mapName)




}


} // Class Ends ******************************************************************************************


