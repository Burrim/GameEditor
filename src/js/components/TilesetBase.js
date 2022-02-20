import React from "react";


class TilesetBase extends React.Component {
  constructor() {
    super();

    window.tileset = this // Global reference
    
    this.selected; // Currently selected tile
    this.selectedCords; //Coordinates of currently selected tile

    this.event = new Event(`tileSelected`)
  }
 
  //Selecting Tile
  select = (cords) => {
    let id
    if(cords){
      id = cords.x + (cords.y) * this.props.input.data.tilesX
      this.selectedCords = cords
    } 
    else id = -69 //id gets filles with abitrary data if no tile should be selected

    //Searches for tile with the generated id and marks it. Also removes marks of tiles not selected anymore
    this.props.input.data.tiles.forEach(tile => {
      if(tile.id == id){
        this.selected = id
        document.getElementById(`tile${tile.id}Selector`).style.border = '2px solid black'
        document.getElementById(`tile${tile.id}Selector`).style.backgroundColor =  "rgba(246, 246, 246, 0.2)"
      } else {
        //Edgecase for preventing crashes on first render where tiles aren't yet generated
        if(document.getElementById(`tile${tile.id}Selector`)){
          document.getElementById(`tile${tile.id}Selector`).style.border = '2px solid transparent'
          document.getElementById(`tile${tile.id}Selector`).style.backgroundColor = "transparent"
        } 
      }
    });
    //Fires Event only if there is usable data
    if(id != -69) document.dispatchEvent(this.event)
    else this.selected = undefined
  }

  keySelect = (x,y) => {
    if(!this.selected) return
    let cords = this.selectedCords
    cords.x += x; cords.y += y
    console.log(this.props.input)
    if(cords.x < 0 || cords.y < 0 || cords.x > this.props.input.data.tilesX-1 || cords.y > this.props.input.data.tilesY-1) return
    this.select(cords)
  }

  render() {
    //Resets Everything in the case the Tileset gets rerendered
    this.selected = undefined
    this.select()

    return (
      <div id="TilesetBase" //Container Element
        style={{
          minWidth: this.props.input.data.tilesX * this.props.input.data.tilewidth,
          maxWidth: this.props.input.data.tilesX * this.props.input.data.tilewidth,
          maxHeight: this.props.input.data.tilesY * this.props.input.data.tileheight,
          margin: this.props.input.data.margin
        }}
      >
        
        {this.props.input.data.tiles.map((element, index) => {
          return ( //Creates individual Tiles
            <Tile
              select = {this.select}
              index={index}
              input={this.props.input}
              key={index}
              setStart={this.setStartCords}
              setEnd={this.setEndCords}
            />
          );
        })}

      </div>
    );
    
  }
}

/********************************************************************/

function Tile(props) {

    const x = props.input.data.margin + props.index % props.input.data.tilesX * (props.input.data.tilewidth + props.input.data.spacing)
    const y = props.input.data.margin + Math.floor(props.index / props.input.data.tilesX) * (props.input.data.tilewidth + props.input.data.spacing )


  const click = function () {
    props.select({
      x: (x - props.input.data.margin) / (props.input.data.tilewidth + props.input.data.spacing) ,
      y: (y - props.input.data.margin) / (props.input.data.tileheight + props.input.data.spacing)
    });
  };

  //Unfinished method used for multiselect
  const hover = function () {
    props.setEnd({
      x: x / props.input.data.tilewidth,
      y: y / props.input.data.tileheight
    });
  };
  
  return (
    
    <div
      className="Tile"
      onClick={click}
      id={`tile${props.index}`}
      style={{
        width: `${props.input.data.tilewidth}px`,
        height: `${props.input.data.tileheight}px`,
        backgroundImage: `url(${props.input.graphic})`,
        backgroundPosition: `${-x}px ${-y}px`,
      }}
    >
      <div
        className="tileSelector"
        id={`tile${props.index}Selector`}
        //onMouseEnter={hover}
        style={{
          width: `${props.input.data.tilewidth-4}px`,
          height: `${props.input.data.tileheight-4}px`
        }}
      />
    </div>
  );
}

export default TilesetBase;