import Phaser from 'phaser'
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
    //Loads Sprites in to Phaser
    Object.keys(files.sprites).forEach(dir=>{
        Object.keys(files.sprites[dir]).forEach(key =>{
            if(key == 'config') return;

            if(files.sprites[dir].config[key] == undefined){ //Checks if a config for this file is present in which case it is processed as a spritesheet
                //Add Image
                this.textures.addBase64(`${dir}-${key}`, files.sprites[dir][key]);
            }
            
            else {
                //Add Sprite
                this.textures.addBase64(`${dir}-${key}-base`, files.sprites[dir][key]) 
                let sprite  = new Image(); //Creates an empty image that then gets the spritesheet assigned as source. This is apparently necessary ¯\_(ツ)_/¯
                sprite.onload = () => {
                this.textures.addSpriteSheet(`${dir}-${key}`, sprite, {
                    frameWidth: files.sprites[dir].config[key].load.frameWidth,
                    frameHeight: files.sprites[dir].config[key].load.frameHeight,
                })};
                sprite.src = files.sprites[dir][key];
           
            }
        })
      })

    
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
                //TM.loadTileset()

                //Loads Sprites in to Phaser
                Object.keys(files.sprites).forEach(dir=>{
                Object.keys(files.sprites[dir]).forEach(key =>{
                if(key == 'config') return;
                if(files.sprites[dir].config[key] == undefined)
                this.load.image(`${dir}-${key}`, files.sprites[dir][key])
                else {
                this.load.spritesheet(`${dir}-${key}`, files.sprites[dir][key], files.sprites[dir].config[key].load)
                }
            })
          })

                this.scene.launch('World')
                
            }
            else this.project = undefined
    }
//***** Startup ********************************************************************************************************************************************************* */
    //Initialisiert Inputs
    this.loadProject(this.config.lastProject)
}

}