import Phaser, { Input } from 'phaser'
import HistoryObject from './History.js'
import placeTile from './functions/placeTile.js';
import placeObject from './functions/placeObject.js';
import removeTile from './functions/removeTile.js';
import changeTool from './functions/changeTool.js';
import saveMaps from './functions/saveMaps.js'
import menuControl from './functions/menuControl.js';

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
    Object.keys(files.sprites).forEach(key => {
        this.textures.addBase64(`${key}-Sprite`, files.sprites[key]);
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
        if(loadedData >= loadedDataGoal)
        this.loadMaps()
        };
        sprite.src = files.tilesets[key].graphic;
    })

    

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
    console.log(tileset.selected)
    this.previewTile.setTexture(`${reactData.tilesetList[TilesetList.state.selected]}-Ghost`, tileset.selected)
    ObjectList.select()
    if(this.activeTool != 'brush' && this.activeTool != 'grandBrush')
    changeTool('brush')
})

//Object in list selected
document.addEventListener('ObjectListSelect', () => {
    this.previewTile.setTexture(`${reactData.objects[ObjectList.state.selected].editorData.img}-Sprite`)
    if(tileset.event)tileset.select()
    changeTool('brush')
  })

document.addEventListener("mouseup", (event) => {
//Leftclick
    if (event.button === 0){
        if(this.activeMap)
        this.activeMap.objects.forEach(obj=>{ obj.place()})
    }   
});


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
        break
        case 't': case 'T':
            if(window.shift) menuControl('tilesetSelector'); 
        break
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

loadMaps()
{
    window.reactData.mapList.forEach(key =>
    {
        this.loadMap(key);
    })
}

loadMap(key) {
    if(this.maps[key] == undefined) //Falls Die Map nicht bereits geladen wurde wird sie jetzt geladen.
    {
    
        this.load.tilemapTiledJSON(key, files.maps[key]); //Bereitet das laden der mapdaten vor
        this.load.once('complete', () => //Setzt eine Callback Funktion auf für sobald die Mapdaten geladen wurden
        {
            //Creates Tilemap and other related objects
            this.maps[key] = {
                name : key,
                core : this.make.tilemap({key: key}), //Tilemap Object
                tilesetKeys: files.maps[key].tilesetKeys,
                tilesets : [],
                wip: true, //Flag that shows when the map had changes made to it. For debugreasons always true
                history : new HistoryObject(),
                objects: [],
                layers: {
                    ground: [],
                    below: [],
                    above: []
                },
                shortMemory: []
            }

            //Creates Tileset Objects
            this.maps[key].tilesetKeys.forEach(setKey =>{
                this.maps[key].tilesets.push(this.maps[key].core.addTilesetImage(setKey, setKey))
            })

            //Creates Layers
            files.maps[key].layers.forEach(layerData =>{
                let layer = this.maps[key].core.createLayer(layerData.name, this.maps[key].tilesets, 0, 0).setVisible(false)
                switch(layerData.name[0]){ //Reads first letter of layername to determine the layertype
                    case 'g': this.maps[key].layers.ground[0] = layer; break;
                    case 'b': this.maps[key].layers.below.push(layer); break;
                    case 'a': this.maps[key].layers.above.push(layer); break;
                }
            })

            //Loads Objects
            files.maps[key].objects.forEach(obj => {
                let object = placeObject(obj.position,obj,this.maps[key])
                object.setVisible(false)
            })

            //Sets Area to interact with
            this.maps[key].border = this.add.rectangle(0, 0, this.maps[key].core.widthInPixels, this.maps[key].core.heightInPixels).setOrigin(0).setFillStyle(0x323232, 1).setVisible(false).setDepth(-1);
            
            //Event for Placing or removing Tiles. Fires every ms
            this.maps[key].border.setInteractive().on('pointerdown', ()=>{
                this.tilePlacement = this.time.addEvent({
                    delay: 1,  
                    repeat: -1,             
                    callback: ()=> {
                        //The Event gets triggered with every mouse button but only left MB can proceed past here
                        if(this.pointer.leftButtonDown()){ 
                            
                            //Updates Mousepointer for following interactions
                            this.pointer.updateWorldPoint(this.cameras.main)

                            //Checks if the targeted tile was already manipulated in this cycle
                            let allow = true
                            for(let i = 0; i < this.activeMap.shortMemory.length; i++){
                                if(this.pointer.worldX == this.activeMap.shortMemory[i].x && this.pointer.worldY == this.activeMap.shortMemory[i].y){
                                    allow = false; break; 
                            }} 
                            if(!allow) {return}

                            //Ads Tile to list of tiles that should not be interacted with until the end of that cycle
                            this.activeMap.shortMemory.push({x:this.pointer.worldX, y:this.pointer.worldY})

                            //Executes Function according to currently selected tool
                            switch(this.activeTool){
                                case 'brush': 
                                if(tileset.selected != undefined) placeTile(); 
                                if(ObjectList.state.selected != undefined) placeObject();
                                break;
                                case 'grandBrush':
                                    if(tileset.selected != undefined){
                                        placeTile(this.pointer.worldX, this.pointer.worldY);
                                        placeTile(this.pointer.worldX + 32, this.pointer.worldY);
                                        placeTile(this.pointer.worldX, this.pointer.worldY + 32 );
                                        placeTile(this.pointer.worldX -32, this.pointer.worldY);
                                        placeTile(this.pointer.worldX, this.pointer.worldY -32);    
                                    }
                                break; 
                                case 'eraser': removeTile(); break;
                            }
                        }
                        else {
                            //Removes Event and resets some values
                            this.tilePlacement.remove()
                            this.time.removeEvent( this.tilePlacement)
                            this.maps[key].shortMemory = []
                        }  
                    },
    })})})} // Fun with brackets \o/ I hope this never needs to be entangled

    this.load.start(); //Startet den ladevorgang
    window.MapList.update()
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
    let mapKey = key  
    if(mapKey == this.activeMap) return;

    if(this.activeMap != undefined)
    {
        this.activeMap.core.layers.forEach( layer =>{layer.tilemapLayer.setVisible(false)})
        this.activeMap.border.setVisible(false);
        this.activeMap.objects.forEach(obj => {
            obj.setVisible(false)
        })
    }
    this.activeMap = this.maps[key]
    this.activeMap.core.layers.forEach( layer =>{layer.tilemapLayer.setVisible(true)})
    this.activeMap.border.setVisible(true);
    this.activeMap.objects.forEach(obj => {
        obj.setVisible(true)
    })
    this.cameraCursor.setPosition(this.activeMap.core.widthInPixels/2,this.activeMap.core.heightInPixels/2) //Zentriert Kamera auf neue Map

}

update(){
    if(!this.activeMap) return
    if(!document.querySelectorAll( ":hover" )[2]) return

    this.pointer.updateWorldPoint(this.cameras.main)

    //Pointer is not on the map anymore
    if( this.pointer.worldX < 0 || this.pointer.worldX > this.activeMap.core.widthInPixels ||
        this.pointer.worldY < 0 || this.pointer.worldY > this.activeMap.core.heightInPixels ||
        document.querySelectorAll( ":hover" )[2].id != 'parent'
    ){
        this.previewTile.setVisible(false)
        this.activeMap.objects.forEach(obj => {obj.return()})
        return;
    }
    //Pointer is on the Map
    else {
        this.activeMap.objects.forEach(obj => {obj.move()})
        if(this.activeTool == 'brush' || this.activeTool == 'eraser' || this.activeTool == 'grandBrush') this.previewTile.setVisible(true)
        else this.previewTile.setVisible(false)
    }
    //Rounds coordinates so the preview aligns with he tilemap
    let pos = {
        x:this.pointer.worldX - (this.pointer.worldX % this.activeMap.core.tileWidth), 
        y:this.pointer.worldY - (this.pointer.worldY % this.activeMap.core.tileHeight)
    }
    
    this.previewTile.setPosition(pos.x,pos.y)


}

} //End of Class

//************************************************************************************************************************************* */
