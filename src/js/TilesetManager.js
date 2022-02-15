

export default class TilesetManager
{
    constructor()
    {
        this.config;        //Veraltete eigenschaft
        this.activeSet;     //Gerade Aktives Tileset
        this.tilesets = []  //Liste aller Tilesets

        //Editor Attributes
        this.edit = {
            init: false,
            selectedSet:undefined,
            selectedTile:undefined,
            previousTile:undefined
        }

        this.create = {
            source:undefined
        }
    }

//*** Load Tileset *********************************************************************************************************************************************************************** */

loadTileset()
{
    let temp = fs.readdirSync(Setup.path+'src/mapData/tilesets') //Sammelt Einträge im entsprechenden Ordner

    temp.forEach(set =>
    {
        if(set.slice(set.length-5, set.length) == '.json')
        {
            this[set.slice(0,set.length-5)] = JSON.parse(fs.readFileSync(`${Setup.path}src/mapData/tilesets/${set}`));
            this.tilesets.push(this[set.slice(0,set.length-5)])
        }
    })
    this.config = JSON.parse(fs.readFileSync(`${Setup.path}src/mapData/tileset.json`))
    TilesetList.update()
}

//*** Save Tileset *********************************************************************************************************************************************************************** */
saveTileset()
{
    this.tilesets.forEach(tileset =>{
        //Speichert Tileset Daten
        fs.writeFileSync(`${Setup.path}src/mapData/tilesets/${tileset.name}.json`, JSON.stringify(tileset, null, 5))

        World.mapList.forEach(key=>{
            if(World.maps[key].tilesetKey == tileset.name){
                World.maps[key].tileset[0] = tileset
                World.maps[key].history.changed = true;
            }
        })

    })
    DAM.save()
}

//*** Create Tileset *********************************************************************************************************************************************************************** */
selectTilesetSource()
{
    //Wählt Bild für Tileset aus
    dialog.showOpenDialog({ properties: ['openFile'] }).then(result => { 
        console.log(result.filePaths[0])
        if(result.filePaths[0].slice(-4) == '.png'){
            this.create.source = result.filePaths[0]
            document.getElementById('createTileset_Quelle').value = this.create.source;
        }
        else alert('Ausgewählte Datei Muss im PNG Format sein')
    })
    
}

createTileset()
{
    //Überprüft ob alle Felder ausgefüllt sind.
    if( document.getElementById('createTileset_name').value == '' || document.getElementById('createTileset_Quelle').value == '' ) 
    {alert('Alle Felder müssen ausgefüllt sein'); return; }

    //Erstellt eine Kopie des gewählten Bildes
    fs.copyFileSync(this.create.source, `${Setup.path}src/mapData/tilesets/${document.getElementById('createTileset_name').value}.png`)

    let img = sizeOf(`${Setup.path}src/mapData/tilesets/${document.getElementById('createTileset_name').value}.png`)
    console.log(img)

    //Erstellt Tileset Objekt
    let tileset = { 
        firstgid:1, 
        image: document.getElementById('createTileset_name').value,
        name: document.getElementById('createTileset_name').value,
        imageheight: img.height, 
        imagewidth: img.width, 
        margin: parseInt(document.getElementById('createTileset_Margin').value),
        spacing: parseInt(document.getElementById('createTileset_Spacing').value),
        tileheight: parseInt(document.getElementById('createTileset_tileHeight').value),
        tilewidth: parseInt(document.getElementById('createTileset_tileWidth').value),
        tiles:[]
    }
    tileset.tilesX = Math.floor(img.width / ((tileset.tilewidth + tileset.spacing) + 2 * tileset.margin - tileset.spacing))
    tileset.tilesY = Math.floor(img.height / ((tileset.tileheight + tileset.spacing) + 2 * tileset.margin - tileset.spacing))
    tileset.tilecount = tileset.tilesX * tileset.tilesY;
    
    for(let i = 0; i < tileset.tilecount; i++){
        tileset.tiles.push(
            {
                id:i,
                properties:[]
            }
    )}
    
    //Schreibt File auf System und schliesst Fenster
    fs.writeFileSync(`${Setup.path}src/mapData/tilesets/${tileset.name}.json`, JSON.stringify(tileset, null, 5))
    closeWindow('createTileset')

    //Tileset in Manager anhängen und HTML Eintrag erstellen
    this[tileset.name] = tileset
    this.initTileset(this[tileset.name])
    this.openTileset(tileset.name)
}


//***** Search for property *********************************************************************************************************************************************** */

hasTileProp = function(id,property)
{
    //Dursucht Tileset Config nach Eigenschaften und gibt den Wert davon zurück
    let temp
    try{
    TM.config.tiles[id].properties.forEach(element => 
    {
        if(element.name == property)
        {
            temp = element.value
            return;
        }
    })
    return temp;}catch{}
}

//***** Open Editor *********************************************************************************************************************************************** */

initEditor() //Initialisiert einmalig alle Tileset Bilder
{
    if(this.edit.init) return;
    this.edit.init = true;

    this.tilesets.forEach(tileset =>{ TM.initTileset(tileset)})//Erstellt Anzeigedaten für jedes Tileset
        

}

initTileset(tileset)
{
    //Generelle Tileset Container Einstellungen
    tileset.atlas = document.createElement('DIV')
    tileset.atlas.id = "tileset_" + tileset.name
    tileset.atlas.classList.add('TSEdit-Atlas')
    tileset.atlas.style.width = `${tileset.tilesX * tileset.tilewidth}px`;
    document.getElementById("TSEdit-Image").append(tileset.atlas)

    for(let i = 1; i < tileset.tilecount+1; i++){ //Fügt einzelne Tiles hinzu
        let img = document.createElement('div')
        img.style.width = `${tileset.tilewidth}px`;
        img.style.height = `${tileset.tileheight}px`;
        img.style.backgroundImage = `url("${Setup.path}src/mapData/tilesets/${tileset.image}.png")`;
        img.id = tileset.name + i;

        img.onclick = function(){TM.showTileProp(i,img);};

        let x = tileset.margin +  (i-1)%tileset.tilesX * (tileset.tilewidth + tileset.spacing)
        let y = tileset.margin + Math.floor((i-1)/tileset.tilesX) *(tileset.tileheight + tileset.spacing)
        img.style.backgroundPosition = `${-x}px ${-y}px`

        tileset.atlas.append(img)
    }

    //Fügt HTML Listeneintrag hinzu
    let div = document.createElement('DIV') 
    div.classList.add('mapEntry', 'hover')
    div.id = `tilesetList_${tileset.name}`
    div.onclick = function(){'click', TM.openTileset(tileset.name)}
    div.innerHTML = `${tileset.name}`
    document.getElementById('TSEdit-Tilesetlist').appendChild(div)
}

openTileset(set) //Zeigt Tileset im Editor
{
    if(this.edit.selectedSet != undefined){
        document.getElementById(`tileset_${this.edit.selectedSet.name}`).style.display = 'none';
        document.getElementById(`tilesetList_${this.edit.selectedSet.name}`).style.backgroundColor = 'transparent';
    }

    document.getElementById(`tileset_${set}`).style.display = 'flex';
    document.getElementById(`tilesetList_${set}`).style.backgroundColor = '#c13333';
    this.edit.selectedSet = this[set]
}

showTileProp(id,element) //Zeigt Properties, wenn man ein Tile anwählt
{
    //Entfernt Highlighter bei vorherig ausgwähltem Tile
    if(this.edit.selectedTile != undefined) {
        this.edit.selectedTile.style.outline = '0px solid white'
        this.edit.selectedTile.style.zIndex = '0'
    }

    //Setzt Highlighter bei angewähltem Tile
    element.style.outline = '2px solid white'
    element.style.zIndex = '2'
    this.edit.selectedTile = element

    //Leert momentaner Container
    document.getElementById('TSEdit-Tileconfig').innerHTML = ''

    //Erstellt Elemente für Eigenschaften  [[Label Value] Delete ]
    this.edit.selectedSet.tiles[id-1].properties.forEach(prop =>{
        let container = document.createElement('DIV')
        container.classList.add('TSEdit-Tileconfig', 'hover')

        let div = document.createElement('DIV')
        div.classList.add('TSEdit-Tileconfig')

        //Name
        let label = document.createElement('LABEL')
        label.innerHTML = prop.name
        label.style.marginLeft = '10px'
        div.appendChild(label)

        //Value
        let value;
        switch(prop.type){
            case 'bool':
            value = document.createElement('INPUT')
            value.setAttribute("type", "checkbox");
            if(prop.value) value.checked = true
            break;

            case 'int': case 'string':
            value = document.createElement('LABEL')
            value.innerHTML = prop.value
            break;
        }
        value.style.marginRight = '10px'
        div.appendChild(value)
        container.appendChild(div)

        //Trash
        let del = document.createElement('IMG')
        del.src = 'assets/ui/delete.png'
        del.onclick = function(){TM.deleteTileProp(del)}
        del.style.width = '24px'
        del.style.margin = '0px 10px 0px 10px'
        container.appendChild(del)
        
        document.getElementById('TSEdit-Tileconfig').appendChild(container)
        
    })

    //Fügt Button für neue Einträge hinzu
    let btn = document.createElement('BUTTON');
    btn.innerHTML = 'New Property'
    btn.id = 'TSEdit-Newproperty'
    btn.onclick = function(){openWindow('createTSA')}
    document.getElementById('TSEdit-Tileconfig').appendChild(btn)
}

createTileProp() //Erstellt Eigenschaft für das angewählte Tile
{
        //Ermittelt Value und Type
        let value; let type;
        switch(document.getElementById('createTSA-Valuetype').value){
            case 'Boolean': value = document.getElementById('createTSA-Valuebool').value; type = 'bool'; break;
            case 'String': value = document.getElementById('createTSA-Valuestring').value; type = 'string'; break;
        }
        //Erstellt Objekt
        let prop = {
            name: document.getElementById('createTSA-Name').value,
            type: type,
            value: value
        }        

        let id = parseInt(this.edit.selectedTile.id.slice(-(this.edit.selectedTile.id.length-this.edit.selectedSet.name.length)))
        
        this.edit.selectedSet.tiles[id-1].properties.push(prop)
        this.showTileProp(id,document.getElementById(`${this.edit.selectedSet.name}${id}`))
        closeWindow('createTSA')
    
}

deleteTileProp(element)
{
    //Berechnet Daten
   let attribute = element.parentNode.childNodes[0].childNodes[0].innerHTML
   let id = parseInt(this.edit.selectedTile.id.slice(-(this.edit.selectedTile.id.length-this.edit.selectedSet.name.length)))   

    //Entfernt Daten in Tileset Daten
   for(let i = 0; i < this.edit.selectedSet.tiles[id-1].properties.length; i++ ){
        if(this.edit.selectedSet.tiles[id-1].properties[i].name == attribute)
        this.edit.selectedSet.tiles[id-1].properties.splice(i,1);
   }
  
   element.parentNode.remove()
}



setTilePropValueType(){ // Setzt den Value Input, bei der Type einstellung in der Attributerstellung
    
    let select = document.getElementById('createTSA-Valuetype')
    console.log(select)

    switch(select.value){
        case 'String':
            document.getElementById('createTSA-Valuestring').style.display = 'block'
            document.getElementById('createTSA-Valuebool').style.display = 'none'
        break;

        case 'Boolean':
            document.getElementById('createTSA-Valuestring').style.display = 'none'
            document.getElementById('createTSA-Valuebool').style.display = 'block'
        break;
    }
}

    
} // Class Ends ******************************************************************************************



