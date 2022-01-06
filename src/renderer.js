


import React from 'react'
import ReactDOM from 'react-dom'
import Phaser from 'phaser'

import World from './js/World.js'
import Setup from './js/Setup.js'

import SelectionColumn from './js/components/SelectionColumn.js'

import './stylesheet.css'

window.loadImages = function(prop){
  let img = require(`D:/Programming_Stuff/Ongoing_Projects/TestProject/src/mapData/tilesets/${prop}.png`)
  return(img)
}

window.loadMaps = function(prop){
  let map = require(`D:/Programming_Stuff/Ongoing_Projects/TestProject/src/mapData/maps/${prop}.json`)
  return map
}



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


window.reactData = {
  mapList:[],
  tilesetList:[]
}

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


