//New Map Loader used for Chunk Based Maps
import Phaser from "phaser";

export default function(data){
    let map = {
        core: World.make.tilemap({ tileWidth: data.tileWidth, tileHeight: data.tileHeight, width:data.width,height:data.height}),
        tilesets: [],
        layers: []
    }


    data.tilesets.forEach(key => {
        let tileset = 
        //map.tilesets.push(file.tilesets[key])
        new Phaser.TileMaps.Tileset(key,key,tileset.tileWidth,tileset.tileHeight,tileset.tileMargin,tileset.tileSpacing,0);
    });
    map.loadChunk = function(x,y){

    }
}