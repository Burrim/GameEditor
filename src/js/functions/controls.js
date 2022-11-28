import menuControl from './menuControl.js';
import loadData from './loadData.js';
import selectTiles from './selectTiles.js';
import deleteArea from './deleteArea.js';

import placeTile from './placeTile.js';
import removeTile from './removeTile.js';
import changeTool from './changeTool.js';
import saveMaps from './saveMaps.js'

import createParticle from './createParticle.js';


export default function initListener(){
    console.log(this)
    document.addEventListener('MapListSelect', () => {
        this.openMap(Object.keys(files.maps)[MapList.state.selected])
    })

    document.addEventListener('MapPartListSelect', () => {
        let key = MapPartList.elements[MapPartList.state.selected]
        if(key == 'Main Map') key = this.selectedMap
        this.openSubMap(key,true)
    })
    
    //Opens Selected Tilesets
    document.addEventListener('TilesetListSelect', () => {
        window.currentTileset = files.tilesets[reactData.tilesetList[TilesetList.state.selected]]
        Tileset.data = files.tilesets[reactData.tilesetList[TilesetList.state.selected]]
        Tileset.setActive(true)
      })

      document.addEventListener('MeasurementsListSelect', () => {
       changeTool('measure')
       let config = Object.values(files.config.measurements)[MeasurementsList.state.selected]
            this.measurement.width = config.width
            this.measurement.height = config.height
            this.measurement.setOrigin(0.5) //For some reason this does not work when creating the shape and needs to be done here
      })
    
    //Tile in Tileset selected
    document.addEventListener('tileSelected', () => {
        this.previewTile.setTexture(`${reactData.tilesetList[TilesetList.state.selected]}-Ghost`, tileset.selected)
        ObjectList.select()
        if(this.activeTool != 'brush' && this.activeTool != 'grandBrush' && this.activeTool != 'bucket')
        changeTool('brush')
    })
    
    //Object in list selected
    document.addEventListener('ObjectListSelect', () => {
        if(ObjectList.state.selected)this.previewTile.setTexture(`${Object.values(files.objects.all)[ObjectList.state.selected].editorData.img}-Sprite`)
        if(tileset.event)tileset.select()
        changeTool('brush')
      })
    
    //Left mouse button down somewhere on canvas 
    document.addEventListener("pointerdown", (event) => {
        if(event.path[0].tagName == 'CANVAS' && event.button === 0)
        this.activeAction()
        if(event.path[0].tagName == 'CANVAS' && event.button === 2)
        this.secondaryAction()
    });
        
    //Left mouse up
    document.addEventListener("pointerup", (event) => {
        if (event.button === 0){
            if(this.placing){
                this.placing = false
                if(debug.tileCreation) console.log('placing stopped')
            }
            if(this.erasing){
                this.erasing = false
                if(debug.tileCreation) console.log('Erasing stopped')
            }
            if(this.isDraggingObj){
                if(event.path[0].tagName == 'CANVAS' && this.selected)
                this.selected.drop()
                else if(this.selected) this.selected.return()  
                this.isDraggingObj = false
            }
            if(this.selecting){
                this.selecting = false
            }
        }
    });
    
    //Move mouse
    document.addEventListener('pointermove', (event) => {
        
        //Placing Tiles
        if(this.placing) placeTile(null,null,currentTileset.data.tiles[tileset.selected].id + currentTileset.data.firstgid)
        //Erasing Tiles
        else if(this.erasing) removeTile()
        //Dragging objects
        else if(this.isDraggingObj && this.selected){
            this.selected.drag()
        }
        //Dragging Selection Rectangle
        else if(this.selecting){
            this.input.activePointer.updateWorldPoint(this.cameras.main)
            let x = Math.ceil(this.pointer.worldX/this.map.config.tilewidth)*this.map.config.tilewidth
            let y = Math.ceil(this.pointer.worldY/this.map.config.tileheight)*this.map.config.tileheight
            this.selectingRec.setSize(x-this.selectingRec.x,y- this.selectingRec.y)
        }
        //Paralax Preview
        else if(this.activeTool == 'preview'){
            this.input.activePointer.updateWorldPoint(this.cameras.main)
            Object.values(this.map.paralaxMaps).forEach(map =>{
                map.chunks.forEach(chunk => {
                    let x = ((this.pointer.worldX - map.config.paralaxConfig.x)*map.config.paralaxConfig.offsetX)
                    //console.log(x)
                    chunk.setPosition(x,0)
                })
            })
        }
    });
        
    
    //--- Key Listener
    this.keyListener = addEventListener("keydown", (event) => {
        //console.log(event.key)
        switch(event.key){
            case 'w': if(tileset.props) tileset.keySelect(0,-1); break;
            case 'a': if(tileset.props) tileset.keySelect(-1,0); break;
            case 's': 
                if(window.ctrl) saveMaps()
                else if(tileset.props) tileset.keySelect(0,1); 
            break;
            case 'd': if(tileset.props) tileset.keySelect(1,0); break;
            case 'b':
                if(window.ctrl && this.customCache)
                Structures.save()
                else changeTool('brush')
            
            break;
            case 'c': 
                if(ctrl){
                    this.customCache = selectTiles()
                } 
            break
            case 'v': if(ctrl) changeTool('paste'); break;
            case 'x': 
                if(ctrl){
                    this.customCache = selectTiles()
                    deleteArea(this.selectingRec.x,this.selectingRec.y,this.selectingRec.width,this.selectingRec.height)
                    World.selectingRec.width = 0; World.selectingRec.height = 0
                } 
            break;
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
                    loadData({target:'particles',dir:'src/assets/particles'})
                    reactData.particles = Object.keys(files.particles)
                    createParticle()
                }
            break;
            case 'F5': location.reload(); break;
            case 'z': if(window.ctrl) this.map.history.undo(); break;
            case 'y': if(window.ctrl) this.map.history.redo(); break;
            case 'Control': window.ctrl = true; break;
            case 'Shift': window.shift = true; break;
            case 'Delete': 
                if(this.selected) this.selected.delete();
                if(this.activeTool == "selection"){
                    deleteArea(this.selectingRec.x,this.selectingRec.y,this.selectingRec.width,this.selectingRec.height)
                    this.selectingRec.width = 0; this.selectingRec.height = 0
                } 
            break;
            case 'Escape':
                //Checks if the current tool is escapable and switches to the previous tool if yes
                let escapableTools = ['paste',"preview",'measure']
                if(escapableTools.includes(World.activeTool)){
                    changeTool(World.previousTool)
                }
            break;
            case ' ':
                //Alternative Dragging function, mostly for stylus
                if(this.Space) return
                this.isDragging = true
                this.Space = true
                this.input.activePointer.updateWorldPoint(this.cameras.main)
                this.positionX = this.input.activePointer.x
                this.positionY = this.input.activePointer.y    
            break;
        }
    })
    
    this.keyListener = addEventListener("keyup", (event) => {
        switch(event.key){
            case 'Control': global.ctrl = false; break;
            case 'Shift': global.shift = false; break;
            case ' ': this.isDragging = false; this.Space = false; break;
        }
    })


    this.isDragging = false;


this.input.on('pointerdown', () =>{
    if(this.input.activePointer.middleButtonDown() || this.Space){
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
    this.isDragging = false
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

}