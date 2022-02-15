
const getActiveTileset = () => {
    return World.activeMap.tilesets[files.tilesets[reactData.tilesetList[TilesetList.state.selected]].data.image]
}

export default getActiveTileset