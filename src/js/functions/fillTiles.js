


// ************************************
// ************** WIP *****************
// ************************************

export default function fillTiles(){

    //Run Checks
    if(!tileset.selected) return //Returns if no tile is selected
    if( document.querySelectorAll( ":hover" )[2].id != 'parent') return //Checks if there is no element above the phaser canvas

    let tileType = getTileProps(currentTileset.data.tiles[tileset.selected].properties, "type")
    let tileSet = false //Flag for when the tile wa succesfully placed
    let selectedTile;
    let placedTile; //For Debug reasons
}

function tryFill(x,y,id){
    if(!World.activeMap.layers[tileType])



    //Check if Layer exists
    if(!World.activeMap.layers[tileType][0]){ 
        let layer = World.activeMap.core.createBlankLayer(tileType+`${i}`, World.activeMap.tilesets ,0 ,0 ,World.activeMap.core.width, World.activeMap.core.height ,World.activeMap.core.tileWidth ,World.activeMap.core.tileHeight)
        World.activeMap.layers[tileType][i] = layer
        tileSet = true
    }
    //Check if tile is empty and places tile if this is the case
    selectedTile = World.activeMap.core.getTileAtWorldXY(World.pointer.worldX, World.pointer.worldY,false, World.cameras.main, World.activeMap.layers[tileType][i])
    if(!selectedTile){
        let id = currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid
        //Places Tile and sets properties according to tileset Data (Props aren't updatet automatically)
        placedTile = World.activeMap.core.putTileAtWorldXY(id, World.pointer.worldX, World.pointer.worldY ,false, World.cameras.main, World.activeMap.layers[tileType][i] )
        World.activeMap.history.addEntry(placedTile, 0, id)
        currentTileset.data.tiles[tileset.selected].properties.forEach(prop => {
            placedTile.properties[prop.name] = prop.value
        });
        

        tileSet = true
    }

}