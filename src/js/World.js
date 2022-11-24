import Phaser, { Input } from 'phaser'

import placeTile from './functions/placeTile.js';
import placeObject from './functions/placeObject.js';
import removeTile from './functions/removeTile.js';
import changeTool from './functions/changeTool.js';
import saveMaps from './functions/saveMaps.js'

import createParticle from './functions/createParticle.js';

import loadChunkMap from './functions/loadChunkMap.js';
import createChunkCover from './functions/chunkCover.js';

import multiplace from './functions/multiplace.js';

import { bucketFill, bucketSelect } from './functions/bucket.js';
import initListener from './functions/controls.js';

import HitboxController from './classes/HitboxController.js';

import AnimDoll from './classes/AnimDoll.js';

import eraserTile from '../assets/ui/eraserTile.png'
import emptyTile from '../assets/ui/emptyTile.png'

export default class World extends Phaser.Scene{
    constructor() {
        super({ key: 'World' });
        window.World = this

      }
init(){
    this.updateEvents = []
}

preload()
{

    //Loads all editor graphics
    //Editor Graphics are inserted in an ES6 import
    Object.keys(files.editorGraphics).forEach(key => {
        this.load.image(`${key}`, files.editorGraphics[key])
    })

    this.load.image('eraserTile', eraserTile)
    this.load.image('emptyTile', emptyTile)
    
}

//****************************************************************************************************************************************************** */

create()
{
    window.HC = new HitboxController()
    createParticle()
    //Loads Base64 Graphics in to Phaser to use

    let loadedData = 0
    let loadedDataGoal = Object.keys(files.tilesets).length

    //Loads all editor sprites
    Object.keys(files.editorSprites).forEach(key => {
        this.textures.addBase64(`${key}-Sprite`, files.editorSprites[key]);
    })

    //Loads Tileset graphics as well as sprites for tilepreview
    Object.keys(files.tilesets).forEach(key => {
        this.textures.addBase64( key, files.tilesets[key].graphic);
        let sprite  = new Image();
        sprite.onload = () => {
        this.textures.addSpriteSheet(`${key}-Ghost`, sprite, {
            frameWidth: files.tilesets[key].data.tilewidth,
            frameHeight: files.tilesets[key].data.tileheight,
            spacing: files.tilesets[key].data.spacing,
            margin: files.tilesets[key].data.margin
        });
        //Loads Maps if the last Tileset has been loaded
        loadedData++
        if(loadedData >= loadedDataGoal){
            this.time.delayedCall(1000,()=>{ 
                MapList.select(null,0)
                this.scene.launch('Structures')
                Setup.scene.bringToTop();
            })
            
        } 
        };
        sprite.src = files.tilesets[key].graphic;
    })

          //--- Creates Animations -------------
    
            this.animations = {}
            Object.keys(files.sprites).forEach(dir =>{
              Object.keys(files.sprites[dir].config).forEach(key =>{
                let config = Object.assign(files.sprites[dir].config[key])
                if(config.animation == undefined || config.animation == {}) return;
    
                //Creates object to insert out of config data and handles edge cases
                let anim =  Object.assign(config.animation) 

                //Stops animation from repeating, even if set up to
                if(anim.repeat != undefined) anim.repeat = 0
    
                //Generates Frames
                if(anim.frames == undefined) anim.frames = `${dir}-${key}` //Single Graphic
                else anim.frames = this.anims.generateFrameNames(`${dir}-${key}`, { frames: anim.frames }) //Multiple Frame Spritesheet
    
                anim.duration = config.animation.duration * frame
                anim.key = `${dir}-${key}`
    
                this.animations[`${dir}-${key}`] = this.anims.create(anim)
              })
            })


    

//General Data
this.pointer = this.input.activePointer; //Pointer Object
this.activeTool = 'none'

this.saveMaps = saveMaps

this.tileSelection = [] //List of Tile coordinates that were already interacted with in the current step

// *** Events ********************************************************************************************************************************************
this.initListener = initListener
this.initListener()

// ***** Special Sprites ****************************************************************************************************************************************
//Tile Preview
this.previewTile = this.add.sprite(-200,-200, `emptyTile`).setAlpha(0.5).setOrigin(0).setDepth(5)


    
//***** Map *****************************************************************************************************************************/

this.maps = {}; //Alle Mapobjekte
this.activeMap = undefined


//***** Camera and Drag *************************************************************************************************************************/

//Kamera Einstellungen
this.cameraCursor = this.add.sprite(window.innerWidth/2,window.innerWidth/2, 'playerR').setVisible(false)
this.cameras.main.startFollow(this.cameraCursor);



    //Set Tool on startup
    changeTool('brush')
}

// Functions --------------------------------------------------------------

activeAction(){

    this.input.activePointer.updateWorldPoint(this.cameras.main)
    let x 
    let y 

    switch(this.activeTool){
        case 'brush':
            //Places Tiles with active Tileset
            if(tileset.selected != undefined){
                this.placing = true
                if(debug.tileCreation) console.log('Placement started')
                placeTile(null,null,currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid)
            }
            //Places Objects whit active Objectlist 
            else if(ObjectList.state.selected != undefined){
                placeObject()
            }
        break;

        case 'bucket':
            bucketSelect(Math.floor(this.pointer.worldX / this.map.config.tilewidth),Math.floor(this.pointer.worldY / this.map.config.tileheight))
        break;

        case 'eraser':
        if(debug.tileCreation) console.log('Erasing started')
        this.erasing = true
        removeTile()
        break;

        case 'particleBrush':
            if(ParticlesList.state.selected != null)
            particles[reactData.particles[ParticlesList.state.selected]].emit(this.pointer.worldX, this.pointer.worldY)
        break;

        case 'object':
            this.isDraggingObj = true
        break

        case 'placeDummy':
            if(this.animDoll == undefined){
                this.animDoll = new AnimDoll(this.pointer.worldX, this.pointer.worldY)
            } 
            else{
                this.animDoll.setPosition(this.pointer.worldX, this.pointer.worldY)
            } 
        break;

        case 'selection':
            x = Math.floor(this.pointer.worldX/this.map.config.tilewidth)*this.map.config.tilewidth
            y = Math.floor(this.pointer.worldY/this.map.config.tileheight)*this.map.config.tileheight
            this.selectingRec.setPosition(x,y)
            this.selectingRec.setSize(0,0)
            this.selecting = true
        break;

        case 'paste':
            if(this.customCache != undefined) multiplace(this.customCache)
        break;

        case 'measure': break;

        case 'crosshair':
            //Logs all tiles on the targeted location
            x = Math.floor(this.pointer.worldX/this.map.config.tilewidth)
            y = Math.floor(this.pointer.worldY/this.map.config.tileheight)
            let chunk = this.map.getChunkByTileCord(x,y,true)
            console.log('%c Checking Tiles ', 'color: #ff1111');
            x = x-(chunk.x-1)*chunk.chunkSize
            y = y-(chunk.y-1)*chunk.chunkSize
            chunk.layers.forEach((layer,index) => {
                console.log(`Layer ${index}`,this.map.core.getTileAt(x, y,false, layer ))
            })
        break;


    }
}

secondaryAction(){
    this.input.activePointer.updateWorldPoint(this.cameras.main)
    switch(this.activeTool){
        case 'brush':
            let chunk = this.map.getChunkByPixelCord(this.pointer.worldX, this.pointer.worldY)
            let id
            //Determines the highest layer with a tile placed on it
            for(let i = chunk.layers.length-1; i >= 0; i--){
                id = this.map.core.getTileAtWorldXY(this.pointer.worldX, this.pointer.worldY,true,this.cameras.main,chunk.layers[i]).index
                if(id != -1){
    
                    //Searches for the correct tileset and selects tile within
                    for(let j = 0; j < this.map.tilesets.length; j++){
                        if(id > this.map.tilesets[j].firstgid && id < this.map.tilesets[j].firstgid + this.map.tilesets[j].total){

                            //Triggers the select methods of these components with processed data
                            TilesetList.select({target:{id:`TilesetList${j}`}})

                            //Creates a temporary event listener, that waits until the tileset has updated and selects the desired tile
                            let funct = ()=>{
                                tileset.select(null,id - this.map.tilesets[j].firstgid)
                                document.removeEventListener("TilesetUpdated",funct)
                            }
                            document.addEventListener('TilesetUpdated',funct)
                        }
                    }
                    break;
                } 
            }

        break;
    }

}

addTimer(config){
    let timer = {
        key : config.key,
        interruptable: config.interruptable, //Clears Timer on statechange when true
        recycle: false, //Marks the object so it can be overwritten
        main : World.time.delayedCall(
            config.duration*frame, 
            function(){ 
                config.callback(); 
                timer.deactivate()
            },
            null, this),
        deactivate : function(){ World.time.removeEvent(this.main); this.recycle = true},
    }
    this.timers.push(timer)
}

openMap(key,noSwitch)
{  
    if(this.maps[key] == undefined){
        loadChunkMap(key).loadAllChunks()
        Object.values(this.map.paralaxMaps).forEach(paralax =>{
            paralax.loadAllChunks()
        })
    } else this.maps[key].open()

    //Creates Chunkcover on first mapload
    if(!this.chunkCover){
        this.chunkCover = createChunkCover(50,30)
        document.getElementById('saveCover').style.display = 'none'
    } 

    //Resets Map Plan ui on switch
    document.getElementById('Topbar-plan').parentNode.style.backgroundColor = 'transparent'

    
    this.map.setHighlighted(true)
    Object.values(this.map.paralaxMaps).forEach(entry =>{console.log(entry); entry.setHighlighted(false)})
    this.selectedMap = key
    
    let list = Object.keys(this.maps[key].paralaxMaps)
    list.unshift("Main Map")
    MapPartList.elements = list
    MapPartList.setActive(true,0)
    
    

    if(!noSwitch)
    this.cameraCursor.setPosition(this.map.core.widthInPixels/2,this.map.core.heightInPixels/2) //Centers Camera on new map 
}
openSubMap(key){
    if(key == this.selectedMap){
        this.openMap(key,true)
        return;
    }
    this.maps[this.selectedMap].setHighlighted(false)
    Object.values(this.maps[this.selectedMap].paralaxMaps).forEach(map =>{map.setHighlighted(false)}) 
    this.maps[this.selectedMap].paralaxMaps[key].open()
    this.map.setHighlighted(true)

}

update(){
    if(!this.map) return

    this.updateEvents.forEach(event =>{
        event()
      })
      
      //Set Position of preview Tile
      this.pointer.updateWorldPoint(this.cameras.main)
      let pos = {
          x:this.pointer.worldX - (this.pointer.worldX % this.map.core.tileWidth), 
          y:this.pointer.worldY - (this.pointer.worldY % this.map.core.tileHeight)
        }
        //Offset for when the pointer oes over the 0 point. It's ugly but it works
        if(this.pointer.worldX < 0) pos.x -= this.map.core.tileHeight
        if(this.pointer.worldY < 0) pos.y -= this.map.core.tileWidth
        
        this.previewTile.setPosition(pos.x,pos.y)
    
        if(this.activeTool == 'measure'){
            this.measurement.setPosition(this.pointer.worldX,this.pointer.worldY)
        }

    return
}

} //End of Class

//************************************************************************************************************************************* */
