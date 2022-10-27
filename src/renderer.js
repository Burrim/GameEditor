
// *** Imports ***************************************************************************************************

import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import Phaser from 'phaser'

import World from './js/World.js'
import Setup from './js/Setup.js'
import Structures from './js/Structures.js';

import utilsInit from './js/utils/utils-init.js'

import SelectionColumn from './js/components/SelectionColumn.js'
import ObjectList from './js/components/ObjectList.js'
import Tileset from './js/components/TilesetCover.js'
import Topbar from './js/components/Topbar.js'
import HitboxTesterInterface from './js/components/HitboxTesterInterface.js'

import './stylesheet.css'

import loadData from './js/functions/loadData.js'

utilsInit()
localStorage.setItem('GameEditorProject','D:/Programming_Stuff/Ongoing_Projects/Primal Complex');
window.path = localStorage.getItem('GameEditorProject')

// *** Asset Loader *************************************************************************************************

//General dynamic import function
function importAll(r) { 
  let images = {};
  r.keys().map( item => { images[item.replace(/.\//, '')] = r(item); });
  return images;
}

//Container for all loaded Files
window.files = { 
  tilesetGraphics:{},
  tilesetData: {},
  tilesets: {},
  maps:{}, 
  graphics: {},
  editorGraphics: {}
}

//Global storage for data that can be used in react components. Old but for now still used in some components. 
//nbot sure if it is still used now
window.reactData = {
  mapList:[],
  tilesetList:[],
  objects:[],
  particles:[]
}

window.tileset = {} //Placeholder to prevent crashes until tileset is booted up

// *** Tilesets **********************************************************************************************************

//Reads every Entry in the target directory. Since Tilesets are stored in pairs of images and jsons a single key without file ending is generated for every pair to itterate over
let tilesets = fs.readdirSync(path + '/mapData/tilesets')
let tilesetKeys = []
tilesets.forEach(key => {
  let cleanedKey = key.replace(/.(png|json)/,'')
  if(!tilesetKeys.includes(cleanedKey)) tilesetKeys.push(cleanedKey)
})

//Itterates over every key and prepares the necessary data
tilesetKeys.forEach(key => {
  files.tilesets[key] = {
    data : JSON.parse( fs.readFileSync(path+"/mapData/tilesets/"+ key + '.json')),
    graphic : "data:image/png;base64, " + fs.readFileSync(path + "/mapData/tilesets/" + key + '.png', 'base64'),
    proxy: new Image()
  }
  reactData.tilesetList.push(key)
  files.tilesets[key].proxy.src = files.tilesets[key].graphic
});

// *** Maps ***************************************************************************************************************

//Checks Directory for Files
let maps = fs.readdirSync(path+"/mapData/maps")
maps.forEach(key =>{
  let map = {
    core: JSON.parse(fs.readFileSync(path+"/mapData/maps/"+key+"/core.json")),
    chunks: [],
    paralax: []
  }

  //Chunks
  let chunks = fs.readdirSync(path+"/mapData/maps/"+key+"/chunks")
  chunks.forEach(chunkKey => {
    map.chunks.push( JSON.parse(fs.readFileSync(path+"/mapData/maps/"+key+"/chunks/"+chunkKey)))
  })


  //Paralaxes
  let paralaxes = fs.readdirSync(path+"/mapData/maps/"+key+"/paralax")
  paralaxes.forEach(paralaxKey =>{
    let paralax = {
      core: JSON.parse(fs.readFileSync(path+"/mapData/maps/"+key+"/paralax/"+paralaxKey + "/core.json")),
      chunks: []
    }

    let paralaxChunks = fs.readdirSync(path+"/mapData/maps/"+key+"/paralax/"+paralaxKey+"/chunks")
    paralaxChunks.forEach(paralaxChunkKey =>{
      paralax.chunks.push( JSON.parse(fs.readFileSync(path+"/mapData/maps/"+key+"/paralax/"+paralaxKey+"/chunks/"+paralaxChunkKey)))
    })

    map.paralax.push(paralax)
  })
  
  files.maps[key] = map
  reactData.mapList.push(key)



})



//*** Object Templates ****************************************************************************************************

files.objects = {all:{}}
//Reads all subdirectories of the objects.
let objectDirs = fs.readdirSync(path+"/mapData/objects") 
objectDirs.forEach(dir =>{
  files.objects[dir] = {}
  //Reads all Objects in a subdirectory
  let objectFiles = fs.readdirSync(path+"/mapData/objects/"+dir)
  objectFiles.forEach(fileKey =>{
    //Loops aver all Object in a single Object file and assigns parent/child relation
    let objects = JSON.parse(fs.readFileSync(path+"/mapData/objects/"+dir+"/"+fileKey))
    for(let i = 0; i < objects.length; i++ ){
      if(i == 0 && objects.length > 1 ) {
        if(objects[0].relation == undefined) objects[0].relation = {}
        objects[0].relation.children = [] //Inits Child property if there are any
        objects[0].editorData.expanded = false
      }
      files.objects[dir][objects[i].name] = objects[i]
      files.objects.all[objects[i].name] = objects[i]
      if(i > 0){
        objects[i].editorData.invisible = true //Sets Flag for objectList
        //objects[i].relation.parent = objects[0] Can't be used right now as it would cause an endless loop in the merging process later
        objects[0].relation.children.push(objects[i].name) //Sets Parent and child dynamic in stringform (connection would get severed if it is already referenced )
      } 
    }
  })
})
//Completes incomplete objects that take referenced data from their source
Object.keys(files.objects.all).forEach(key => {
  if(files.objects.all[key].src){
    //Creates a clone of the object to reference and then removes the attributes that should not be cloned
    let src = cloneDeep(files.objects.all[files.objects.all[key].src])
    //Deletes properties that we don't want from the cloned object
    delete src.editorData.expanded
    delete src.relation

    files.objects.all[key] = mergeDeep(src,files.objects.all[key])
  }
})


//Establishes relationship between objects (Related to lists, not src data)
Object.keys(files.objects.all).forEach(key => {
  if(files.objects.all[key].relation){
    if(files.objects.all[key].relation.children)
    for(let i = 0; i < files.objects.all[key].relation.children.length; i++){
      files.objects.all[key].relation.children[i] = files.objects.all[files.objects.all[key].relation.children[i]]
    }
  }
})

// *** Sprites ******************************************************************************************************

loadData({target:"editorSprites",dir:'src/assets/editorSprites'}) //EditorSprites
fs.readdirSync(path+"/src/assets/sprites").forEach(key => { //GameSprites
  loadData({target:"sprites",dir:'src/assets/sprites/'+ key,nested:key}) 
})


// *** Editor internal Graphics *******************************************************************************************************

//Loads all graphics from the internal editor assets
let editorGraphics = importAll(require.context(`./assets/ui`, false, /.(png|jpe?g|svg)$/));
Object.keys(editorGraphics).forEach(key =>{
  files.editorGraphics[key.replace(/.(png|json)/,'')] = editorGraphics[key]
})

//Loads Particles
loadData({target:'particles',dir:'src/assets/particles'})
reactData.particles = Object.keys(files.particles)

//Loads Hitboxes
loadData({target:'hitboxes', dir:'src/assets/hitboxInstructions'})

//Loads config
loadData({target:"config", dir: "/mapData/config"})


//*** Global Functions *********************************************************************************************************************************************************** */
global.frame = 1000/60 

global.id = 0 
global.assignId = function(){
  global.id++;
  return global.id
}

//*** Event Listeners ************************************************************************************************************************************************************ */
//Not sure if they are even used at the moment since the pointer object from phaser is just more handy
window.addEventListener("mousedown", (event) => {
  if (event.button === 0) window.leftClick = true;
  if (event.button === 1) window.middleClick = true;
  if (event.button === 2) window.rightClick = true;
});

window.addEventListener("mouseup", (event) => {
  if (event.button === 0) window.leftClick = false;
  if (event.button === 1) window.middleClick = false;
  if (event.button === 2) window.rightClick = false;
});

//*** Phaser Instance ************************************************************************************************************************************************************ */

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: 
    {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#222222",
    parent: 'parent',
    dom: {
      createContainer: true
  },
    scene: [Setup, World, Structures],
    pixelArt: true,
    physics: {
      default: 'matter',
      arcade: {
        gravity: { y: 0 }, 
        debug: false
      },
      matter:{
        debug: true
      }
    }
  };

class Game extends Phaser.Game {
    constructor() {
      super(config);
    }
  }
  
window.Game = new Game(); 

//*** Rendering React Menu Elements *********************************************************************************************************************************************************************** */

const leftUI = createRoot(document.getElementById('leftUI'));
const rightUI = createRoot(document.getElementById('rightUI'));
const topbar = createRoot(document.getElementById('header'));



leftUI.render(
  <div style={{display: "flex", flexDirection: "column"}}>
    <SelectionColumn id='MapList' title='Maps' elements={Object.keys(files.maps)} active={true}/>
    <SelectionColumn id='MapPartList' title='Map-Parts' elements={[]} active={false}/>
    <SelectionColumn id='TilesetList' title='Tilesets' elements={Object.keys(files.tilesets)} active={true}/>
  </div>
)
rightUI.render(
  <div id='rightUIContainer'>
    <div id='rightTop'>
      <HitboxTesterInterface/>
      <SelectionColumn id='ParticlesList' title='Particles' elements={Object.keys(files.particles)} active={false}/>
      <SelectionColumn id='MeasurementsList' title='Measurements' elements={Object.keys(files.config.measurements)} active={false}/>
      <ObjectList id='ObjectList' title='Objects' elements={Object.values(files.objects.all)} active={false}/>
      
    </div>
    <div id='rightBottom'>
      <Tileset input={tileset}/>
    </div>
  </div>

)

topbar.render(
  <div className='Topbar-Container'>
  
        <Topbar type={'menu'} elements = {[
          {texture:'map',key:"MapList"},
          {texture:'tilesetEditor',key:"TilesetList"}
        ]}/>

        <Topbar type={'special'} elements = {[
          {texture:'structure',key:"structure"}
        ]}/>
        
        <Topbar type={'tools'} elements = {[
          {texture:'brush',key:"brush"},
          {texture:'eraser',key:"eraser"},
          {texture:'bucket',key:"bucket"},
          {texture:'settings',key:"object"},
          {texture:'particleBrush',key:'particleBrush'},
          {texture:'tilesetSelector',key:'selection'}
          
        ]}/>

        <Topbar type={'menu'} elements = {[
          {texture:'particles',key:'ParticlesList'},
          {texture:'object',key:'ObjectList'},
          {texture:'tilesetSelector',key:'HitboxTester'},
          {texture:'ruler',key:'MeasurementsList'}
        ]}/>
      </div>
)


  


  
    


      