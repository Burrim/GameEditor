


import React from 'react'
import ReactDOM from 'react-dom'
import Phaser from 'phaser'

import World from './js/World.js'
import Setup from './js/Setup.js'

import SelectionColumn from './js/components/SelectionColumn.js'
import Tileset from './js/components/TilesetCover.js'

import './stylesheet.css'

let path = 'D:/Programming_Stuff/Ongoing_Projects/TestProject/src'

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
  sprites:{all:{}},
  maps:{}, 
  particles : {},
  graphics : {}
}

window.reactData = {
  mapList:[],
  tilesetList:[]
}

window.tileset = {} //Placeholder to prevent crashes until tileset is booted up

// *** Tilesets ***

//Loads all tileset graphics
let tilesetGraphics = importAll(require.context(`D:/Programming_Stuff/Ongoing_Projects/TestProject/src/mapData/tilesets`, false, /.(png|jpe?g|svg)$/));
Object.keys(tilesetGraphics).forEach(key =>{
  files.tilesetGraphics[key.replace(/.(png|json)/,'')] = tilesetGraphics[key]
})

//Loads all tileset data 
let tilesetData = importAll(require.context(`D:/Programming_Stuff/Ongoing_Projects/TestProject/src/mapData/tilesets`, false, /.(json)$/));
Object.keys(tilesetData).forEach(key =>{
  files.tilesetData[key.replace(/.(png|json)/,'')] = tilesetData[key]
})

//Merges Tileset Data with Tileset Graphics
Object.keys(files.tilesetData).forEach(key =>{
  files.tilesets[key] = {
    data : files.tilesetData[key],
    graphic : files.tilesetGraphics[key]
  }
  reactData.tilesetList.push(key) //Prepares data for use in React
})

// *** Maps ***
//Loads Map Files
let maps = importAll(require.context(`D:/Programming_Stuff/Ongoing_Projects/TestProject/src/mapData/maps`, false, /.(json)$/));
Object.keys(maps).forEach(key =>{
  files.maps[key.replace(/.(png|json)/,'')] = maps[key]
  reactData.mapList.push(key.replace(/.(png|json)/,'')) //Prepares data for use in React
})

// *********************************************************************************************************************************************************

//Old loader functions. Need to be removed in due time
window.loadImages = function(prop){
  let img = require(`D:/Programming_Stuff/Ongoing_Projects/TestProject/src/mapData/tilesets/${prop}.png`)
  return(img)
}

window.loadMaps = function(prop){
  let map = require(`D:/Programming_Stuff/Ongoing_Projects/TestProject/src/mapData/maps/${prop}.json`)
  return map
}

//*** Event Listeners ************************************************************************************************************************************************************ */

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

//Renderfunctions

  window.renderTileset = function(tileset){
    window.currentTileset = tileset
    ReactDOM.render(
      <div>
        <Tileset input={tileset}/>
      </div> 
      ,document.getElementById("tilesetWindow"));
  }

  //Startup  
  ReactDOM.render(
    <div>
      <SelectionColumn id='MapList' title='Maps' dataReader='mapList'/>
    </div> 
    ,document.getElementById("mapSelector"));
  
    ReactDOM.render(
      <div>
        <SelectionColumn id='TilesetList' title='Tilesets' dataReader='tilesetList'/>
      </div> 
      ,document.getElementById("tilesetSelector"));