import Phaser from 'phaser'
import randomString from './utils/randomString';
import loadData from './functions/loadData';
import Structure_Container from './classes/Structure_Container';

export default class Structures extends Phaser.Scene{

    constructor() {
        super({ key: 'Structures' });
        window.Structures = this
        
      }

//***** Init/Preload ********************************************************************************************************************************************************* */

init()
{
    this.config = {
        entryWidth: 200,
        entryHeight: 200,
        totalWidth: 1000,
    }
    this.elements = []
    this.keys = fs.readdirSync(`${window.path}/mapData/structures`)
    this.mapConfig = { tileWidth: 32, tileHeight: 32, width:0, height:0}
}
create(){
    files.structures = {}
    loadData({target:"structures",dir:'mapData/structures'})
    this.map = this.make.tilemap(this.mapConfig)

     //Loads Tilesets
     this.tilesets = []
     this.tilesetTilecount = 0
     files.maps[World.selectedMap].core.tilesets.forEach(key => {
         let tilesetData = files.tilesets[key].data
         let tileset = new Phaser.Tilemaps.Tileset(key,this.tilesetTilecount, tilesetData.tileWidth,tilesetData.tileHeight,tilesetData.tileMargin,tilesetData.tileSpacing,null,tilesetData.tiles);
         this.tilesetTilecount += tileset.tileData.length //Increases Starting Index for the next Tileset
         tileset.setImage(World.textures.get(tilesetData.image))
         this.tilesets.push(tileset)
     });
    
    Object.values(files.structures).forEach((data,index) =>{
        let x = ( (index+1) % (this.config.totalWidth / this.config.entryWidth) )-1
        let y = Math.floor(this.config.entryWidth/ this.config.totalWidth * index )
        let structure = new Structure_Container(x,y,data)
        this.elements.push( structure )
        structure.data.id = Object.keys(files.structures)[index]
    })

    document.getElementById('Topbar-structure').parentNode.style.backgroundColor = 'transparent'
    this.scene.sleep() 
}
  
//***** Functions********************************************************************************************************************************************************* */
save(){
    let key
    do{
        key = randomString(4)
    }while(this.keys.includes(key+".json"))
    fs.writeFileSync(`${window.path}/mapData/structures/${key}.json`, JSON.stringify(World.customCache, null, 3))
    alert("Structure Saved")
    World.ctrl = false
    this.scene.restart("Structures")
}

}