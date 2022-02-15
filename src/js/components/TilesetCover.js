import React, { useState } from "react";
import DragMove from "./DragMove.jsx";
import TilesetBase from "./TilesetBase.js";
import './Tileset.css'


function Tileset(props) {
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });


  //Function for Moving the Tileset
  const handleDragMove = (e) => {
    if (!window.rightClick) return;
    let x = e.movementX;
    let y = e.movementY;
    if (translate.x + x > 0 || translate.x + x < - (props.input.data.tilesX * props.input.data.tilewidth-600)) x = 0;
    if (translate.y + y > 0 || translate.y + y < - (props.input.data.tilesY * props.input.data.tileheight-600)) y = 0;
    setTranslate({
      x: translate.x + x,
      y: translate.y + y
    });
  };

  return (
    <div id="Tileset">
    <div id='TilesetLimiter'>
    <DragMove onDragMove={handleDragMove}>
        <div
          style={{
            transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
          }}
        >
          <TilesetBase input={props.input} />
        </div>
      </DragMove>
    </div>
    </div>
  );
}

export default Tileset;
