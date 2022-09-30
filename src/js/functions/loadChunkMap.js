//New Map Loader used for Chunk Based Maps

import Map from "../classes/ChunkMap";

// ***** Object Exporter *************************************************************************************************************************************************************

export default function loadChunkMap(key){
    console.log(files.maps[key].core)
    let map = new Map(files.maps[key].core)

    World.maps[key] = map
    World.map = map

    return map
}

