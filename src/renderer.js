
// *** Imports ***************************************************************************************************

import React from 'react'
import ReactDOM from 'react-dom'
import Phaser from 'phaser'

import World from './js/World.js'
import Setup from './js/Setup.js'

import SelectionColumn from './js/components/SelectionColumn.js'
import Tileset from './js/components/TilesetCover.js'
import Topbar from './js/components/Topbar.js'

import './stylesheet.css'

import loadData from './js/functions/loadData.js'

//localStorage.setItem('GameEditorProject','D:/Programming_Stuff/Ongoing_Projects/Project_Mars_V2');
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
  sprites:{},
  maps:{}, 
  particles: {},
  graphics: {},
  editorGraphics: {}
}

window.reactData = {
  mapList:[],
  tilesetList:[],
  objects:[],
  particles:[]
}

window.tileset = {} //Placeholder to prevent crashes until tileset is booted up

// *** Tilesets ***
//Reads every Entry in the target directory. Since Tilesets are stored in pairs of images and jsons a single key without file ending is generated for every pair
//to itterate over
let tilesets = fs.readdirSync(path + '/src/mapData/tilesets')
let tilesetKeys = []
tilesets.forEach(key => {
  let cleanedKey = key.replace(/.(png|json)/,'')
  if(!tilesetKeys.includes(cleanedKey)) tilesetKeys.push(cleanedKey)
})

//Itterates over every key and prepares the necessary data
tilesetKeys.forEach(key => {
  files.tilesets[key] = {
    data : JSON.parse( fs.readFileSync(path+"/src/mapData/tilesets/"+ key + '.json')),
    graphic : "data:image/png;base64, " + fs.readFileSync(path + "/src/mapData/tilesets/" + key + '.png', 'base64'),
    proxy: new Image()
  }
  reactData.tilesetList.push(key)
  files.tilesets[key].proxy.src = files.tilesets[key].graphic
});

// *** Maps ***
//Checks Directory for Files
let maps = fs.readdirSync(path+"/src/mapData/maps")
maps.forEach(key => {
  //Load individual Files
  let map = JSON.parse( fs.readFileSync(path+"/src/mapData/maps/"+key)) 
  files.maps[key.replace(/.(json)/,'')] = map
  reactData.mapList.push(key.replace(/.(json)/,''))
})

// *** Sprites ***
//Loads all sprites
let sprites = fs.readdirSync(path + "/src/assets/editorSprites")
sprites.forEach(key => {
  let sprite = fs.readFileSync(path + "/src/assets/editorSprites/" + key, 'base64')
  sprite = "data:image/png;base64, " + sprite 
  files.sprites[key.replace(/.(png|jpg|jpeg)/,'')] = sprite
})

// *** Editor Graphics ***
//Loads all graphics from the internal editor assets
let editorGraphics = importAll(require.context(`./assets/ui`, false, /.(png|jpe?g|svg)$/));
Object.keys(editorGraphics).forEach(key =>{
  files.editorGraphics[key.replace(/.(png|json)/,'')] = editorGraphics[key]
})

//Loads Particles
loadData({target:'particles',dir:'assets/particles'})
reactData.particles = Object.keys(files.particles)


//*** Global Functions *********************************************************************************************************************************************************** */
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
    scene: [Setup, World],
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }, 
        debug: false
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

//--- Renderfunctions ------------
//Dynamic Renderfunctions that can be called to render elements after data is loaded or refreshed

  //Topbar
  window.renderTopbar = function(){
    ReactDOM.render(
    
      <div className='Topbar-Container'>
  
        <Topbar type={'menu'} elements = {[
          {texture:'map',key:"mapSelector"}
        ]}/>
        
        <Topbar type={'tools'} elements = {[
          {texture:'brush',key:"brush"},
          {texture:'eraser',key:"eraser"},
          {texture:'settings',key:"object"},
          {texture:'particelBrush',key:'particelBrush'}
        ]}/>

        <Topbar type={'menu'} elements = {[
          {texture:'particles',key:'particleSelector'},
          {texture:'object',key:'objectSelector'},
          {texture:'tilesetEditor',key:"tilesetSelector"}
        ]}/>
          
      </div>
    ,document.getElementById("header"))
  }

  //Tilesetwindow
  window.renderTileset = function(tileset){
    window.currentTileset = tileset
    ReactDOM.render(
      <div>
        <Tileset input={tileset}/>
      </div> 
      ,document.getElementById("tilesetWindow"));
  }

  //ObjectList
  window.renderObjectList = function(){
    ReactDOM.render(
      <div >
        <SelectionColumn id='ObjectList' title='Objects' dataReader='objects'/>
      </div> 
      ,document.getElementById("objectSelector"));
  }

  //Maplist
  window.renderMapList = function(){
    ReactDOM.render(
      <div>
        <SelectionColumn id='MapList' title='Maps' dataReader='mapList'/>
      </div> 
      ,document.getElementById("mapSelector"));
  }

  //Particleslist
  window.renderParticlesList = function(){
    ReactDOM.render(
      <div>
        <SelectionColumn id='ParticlesList' title='Particles' dataReader='particles'/>
      </div> 
      ,document.getElementById("particleSelector"));
  }

  //Tilesetlist
  window.renderTilesetList = function(){
    ReactDOM.render(
      <div>
        <SelectionColumn id='TilesetList' title='Tilesets' dataReader='tilesetList'/>
      </div> 
      ,document.getElementById("tilesetSelector"));
  }

//--- Startup ---------------- 
  renderTopbar()
  renderMapList()
  renderParticlesList()
  renderTilesetList()
  

    
  
    


      