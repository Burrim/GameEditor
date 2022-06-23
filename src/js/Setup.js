import Phaser from 'phaser'

import redParticle from '../assets/ui/redParticle.png'
import whiteParticle from '../assets/ui/whiteParticle.png'

import TilesetManager from './TilesetManager.js'
import menuControl from './functions/menuControl'
import changeTool from './functions/changeTool'


export default class Setup extends Phaser.Scene{

    constructor() {
        super({ key: 'Setup' });
        window.Setup = this
      }

      



//***** Init/Preload ********************************************************************************************************************************************************* */

init()
{
    this.config //Config später per ipc einfügen  = JSON.parse(fs.readFileSync("src/config.json")) //Interne Config des Editors$
    this.config = {
        lastProject:`${window.path}/ProjectMars.json`,
    }
    this.project; //ProjektDaten
    this.path; //Projektpfad
}


preload()
{
    //Lädt Grafiken, die von Phaser benutzt werden. 
    this.load.image('redParticle', redParticle )
    this.load.image('whiteParticle', whiteParticle)
}

//***** Functins********************************************************************************************************************************************************* */
create()
{
    this.loadProject = function(projectUrl)
    {
        try{ //Versucht letztes bearbeitetes Projekt zu öffnen
            this.project = JSON.parse(fs.readFileSync(projectUrl));
            }catch{alert('Projekt konnte nicht gefunden werden'); return;}
        
            if(this.project.isSofits) //Frägt eine Variable ab, die sich in legitimen Projektfiles befindet. startet zusätzliche Szenen, wenn das Projekt legitim ist.
            {
                this.path = this.config.lastProject.slice(0,this.config.lastProject.length - (this.project.name.length+5))
                TM.loadTileset()

                reactData.objects = this.project.objects
                renderObjectList()

                this.scene.launch('World')



            }
            else this.project = undefined
    }
//***** Startup ********************************************************************************************************************************************************* */
    //Startet System Funktionen
    window.TM = new TilesetManager()
    //Initialisiert Inputs
    this.loadProject(this.config.lastProject)
    
    
    menuControl('tilesetSelector')
    menuControl('mapSelector')
    
}

}