//New Map Loader used for Chunk Based Maps

import Map from "../classes/ChunkMap";

// ***** Object Exporter *************************************************************************************************************************************************************

export default function loadChunkMap(key){
    let map = new Map(files.maps[key])

    World.maps[key] = map
    World.map = map

    return map
}

