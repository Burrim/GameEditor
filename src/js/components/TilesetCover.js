import React, { useState } from "react";
import DragMove from "./DragMove.jsx";
import TilesetBase from "./TilesetBase.js";
import './Tileset.css'

export default class Tileset extends React.Component{
  constructor(props){
    super(props)
    this.active = false
    this.data;
    window.Tileset = this
    this.state = {
      translate : {x:0,y:0}
    }
  }
  //Function for Moving the Tileset
  handleDragMove = (e) => {
    if (!window.rightClick) return;
    let x = e.movementX;
    let y = e.movementY;
    if (this.state.translate.x + x > 0 || this.state.translate.x + x < - (this.data.tilesX * this.data.tilewidth-400)) x = 0;
    if (this.state.translate.y + y > 0 || this.state.translate.y + y < - (this.data.tilesY * this.data.tileheight-400)) y = 0;

    this.setState({
      translate : {
        x: this.state.translate.x + x,
        y: this.state.translate.y + y
      }
      
    });
  };

  setActive(input){
    this.active = input
    this.forceUpdate()
}

  render(){
    if(!this.active)return(<div></div>)
    return (
      <div id="Tileset">
      <div id='TilesetLimiter'>
      <DragMove onDragMove={this.handleDragMove}>
          <div
            style={{
              transform: `translateX(${this.state.translate.x}px) translateY(${this.state.translate.y}px)`
            }}
          >
            <TilesetBase input={this.data} />
          </div>
        </DragMove>
      </div>
      </div>
    );
  }
}



