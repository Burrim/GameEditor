import Phaser from 'phaser'
import randomString from './utils/randomString';
import loadData from './functions/loadData';
import Structure from './classes/structure';

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
    loadData({target:"structures",dir:'mapData/structures'})
    this.map = this.make.tilemap(this.mapConfig)
    
    Object.values(files.structures).forEach((data,index) =>{
        let x = ( (index+1) % (this.config.totalWidth / this.config.entryWidth) )-1
        let y = Math.floor(this.config.entryWidth/ this.config.totalWidth * index )
        this.elements.push( new Structure(x,y,data) )
    })
}
  
//***** Functions********************************************************************************************************************************************************* */
save(){
    let key
    do{
        key = randomString(4)
    }while(this.keys.includes(key+".json"))
    fs.writeFileSync(`${window.path}/mapData/structures/${key}.json`, JSON.stringify(World.customCache, null, 3))
    alert("Structure Saved")
}

}