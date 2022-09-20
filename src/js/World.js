import Phaser, { Input } from 'phaser'
import HistoryObject from './History.js'
import placeTile from './functions/placeTile.js';
import placeObject from './functions/placeObject.js';
import removeTile from './functions/removeTile.js';
import changeTool from './functions/changeTool.js';
import saveMaps from './functions/saveMaps.js'
import menuControl from './functions/menuControl.js';
import createParticle from './functions/createParticle.js';
import loadData from './functions/loadData.js';
import loadChunkMap from './functions/loadChunkMap.js';

import eraserTile from '../assets/ui/eraserTile.png'
import emptyTile from '../assets/ui/emptyTile.png'

export default class World extends Phaser.Scene{
    constructor() {
        super({ key: 'World' });
        window.World = this

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
            this.openMap('testmap')
        } 
        };
        sprite.src = files.tilesets[key].graphic;
    })

    createParticle()

    

//General Data
this.pointer = this.input.activePointer; //Pointer Object
this.activeTool = 'none'

this.saveMaps = saveMaps

this.tileSelection = [] //List of Tile coordinates that were already interacted with in the current step

// *** Events ********************************************************************************************************************************************

//Map Selected
document.addEventListener('MapListSelect', () => {
    this.openMap(window.reactData.mapList[window.MapList.state.selected])
})

//Opens Selected Tilesets
document.addEventListener('TilesetListSelect', () => {
    renderTileset(files.tilesets[reactData.tilesetList[TilesetList.state.selected]])
  })

//Tile in Tileset selected
document.addEventListener('tileSelected', () => {
    this.previewTile.setTexture(`${reactData.tilesetList[TilesetList.state.selected]}-Ghost`, tileset.selected)
    ObjectList.select()
    if(this.activeTool != 'brush' && this.activeTool != 'grandBrush')
    changeTool('brush')
})

//Object in list selected
document.addEventListener('ObjectListSelect', () => {
    this.previewTile.setTexture(`${files.objects.all[ObjectList.state.selected].editorData.img}-Sprite`)
    if(tileset.event)tileset.select()
    changeTool('brush')
  })

  document.addEventListener("mousedown", (event) => {
      if(event.path[0].tagName == 'CANVAS' && event.button === 0)
      this.activeAction()
    });
    //Leftclick
    document.addEventListener("mouseup", (event) => {
    if (event.button === 0){
        if(this.placing){
            this.placing = false
            if(debug.tileCreation) console.log('placing stopped')
        }
        if(this.erasing){
            this.erasing = false
            if(debug.tileCreation) console.log('Erasing stopped')
        } 
        //if(this.activeMap)
        //this.activeMap.objects.forEach(obj=>{ obj.place()})
      }   
  });
  addEventListener('mousemove', (event) => {
    if(this.placing) placeTile(null,null,currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid)
    else if(this.erasing) removeTile()
  });
    
this.input.on('pointerdown', () =>{
    if(this.input.activePointer.leftButtonDown()){
        if(this.activeTool == 'particleBrush' && ParticlesList.state.selected != null)
        particles[reactData.particles[ParticlesList.state.selected]].emit(this.pointer.worldX, this.pointer.worldY)
    }
})


//--- Key Listener
this.keyListener = addEventListener("keydown", (event) => {
    switch(event.key){
        case 'w': if(tileset.props) tileset.keySelect(0,-1); break;
        case 'a': if(tileset.props) tileset.keySelect(-1,0); break;
        case 's': 
            if(window.ctrl) saveMaps()
            else if(tileset.props) tileset.keySelect(0,1); 
        break;
        case 'd': if(tileset.props) tileset.keySelect(1,0); break;
        case 'b': changeTool('brush'); break;
        case 'e': changeTool('eraser'); break;
        case 'o': case 'O':
            if(window.shift) menuControl('objectSelector')
            else changeTool('object');

        break;
        case 'g': changeTool('grandBrush'); break
        case 'm': case 'M':
         if(window.shift) menuControl('mapSelector');
        break
        case 'p': case 'P':
            if(window.shift) menuControl('particleSelector');
            else changeTool('particleBrush') 
        break
        case 't': case 'T':
            if(window.shift) menuControl('tilesetSelector'); 
        break
        case 'r': case 'R':
            //Reloads Particle Config
            if(this.activeTool == 'particleBrush'){
                loadData({target:'particles',dir:'assets/particles'})
                reactData.particles = Object.keys(files.particles)
                createParticle()
            }
        break;
        case 'F5': location.reload(); break;
        case 'z': if(window.ctrl) this.activeMap.history.undo(); break;
        case 'y': if(window.ctrl) this.activeMap.history.redo(); break;
        case 'Control': window.ctrl = true; break;
        case 'Shift': window.shift = true; break;
    }
})

this.keyListener = addEventListener("keyup", (event) => {
    switch(event.key){
        case 'Control': global.ctrl = false; break;
        case 'Shift': global.shift = false; break;
    }
})

// ***** Special Sprites ****************************************************************************************************************************************
//Tile Preview
this.previewTile = this.add.sprite(-200,-200, `emptyTile`).setAlpha(0.5).setOrigin(0).setDepth(5)

//Particle Effects **************************************************************

this.whiteParticle = this.add.particles('whiteParticle');
this.whiteParticle.createEmitter({
    lifespan: 500,
    speed: { min: 40, max: 100 },
    scale: { start: 2, end: 0 },
    alpha: {start:1, end: 0 },
    quantity: 10,
    on: false,
    emitZone:({source:new Phaser.Geom.Rectangle(0,0,TM.config.tilewidth,TM.config.tileheight), type:"random"})
});
this.whiteParticle.setDepth(5)

this.redParticle = this.add.particles('redParticle');
this.redParticle.createEmitter({
        lifespan: 500,
        speed: { min: 40, max: 100 },
        scale: { start: 3, end: 0 },
        alpha: {start:1, end: 0 },
        quantity: 20,
        on: false,
        emitZone:({source:new Phaser.Geom.Rectangle(0,0,TM.config.tilewidth,TM.config.tileheight), type:"random"})
});
this.redParticle.setDepth(5)
    
//***** Map *****************************************************************************************************************************/

this.maps = {}; //Alle Mapobjekte
this.activeMap = undefined


//***** Camera *************************************************************************************************************************/

//Kamera Einstellungen
this.cameraCursor = this.add.sprite(window.innerWidth/2,window.innerWidth/2, 'playerR').setVisible(false)
this.cameras.main.startFollow(this.cameraCursor);


//Drag
this.isDragging = false;


this.input.on('pointerdown', () =>{
    if(this.input.activePointer.middleButtonDown()){
        this.isDragging = true
        this.input.activePointer.updateWorldPoint(this.cameras.main)
        this.positionX = this.input.activePointer.x
        this.positionY = this.input.activePointer.y   
    }
})

this.input.on('pointerup', () =>{
    if(!this.input.activePointer.middleButtonDown()){
        this.isDragging = false
    }
})

window.addEventListener('blur', () => {
    World.isDragging = false
   });

this.input.on('pointermove', ()=>{
    if(!this.isDragging) return
    this.cameraCursor.x -= (this.input.activePointer.x - this.positionX)/this.cameras.main.zoom
    this.cameraCursor.y -= (this.input.activePointer.y - this.positionY)/this.cameras.main.zoom
    
    this.positionX = this.input.activePointer.x
    this.positionY = this.input.activePointer.y   
})

//Zoom
this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {

    if((this.cameras.main.zoom > 0.3 && deltaY > 0) || (this.cameras.main.zoom < 3 && deltaY < 0))
    this.cameras.main.zoom -= deltaY/1000
});

    //Set Tool on startup
    changeTool('brush')

    
}

// Functions --------------------------------------------------------------

activeAction(){
    switch(this.activeTool){
        case 'brush':
        this.placing = true
        if(debug.tileCreation) console.log('Placement started')
        placeTile(null,null,currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid)
        break;

        case 'eraser':
        if(debug.tileCreation) console.log('Erasing started')
        this.erasing = true
        removeTile()
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

openMap(key)
{
    if(this.maps[key] == undefined) loadChunkMap(key)
    else this.maps.open()

    this.cameraCursor.setPosition(this.map.core.widthInPixels/2,this.map.core.heightInPixels/2) //Centers Camera on new map 
}

update(){
    if(!this.map) return

    this.pointer.updateWorldPoint(this.cameras.main)
    let pos = {
        x:this.pointer.worldX - (this.pointer.worldX % this.map.core.tileWidth), 
        y:this.pointer.worldY - (this.pointer.worldY % this.map.core.tileHeight)
    }

    this.previewTile.setPosition(pos.x,pos.y)
    return
}

} //End of Class

//************************************************************************************************************************************* */
