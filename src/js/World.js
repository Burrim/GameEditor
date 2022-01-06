import Phaser from 'phaser'
import HistoryObject from './History.js'

export default class World extends Phaser.Scene{
    constructor() {
        super({ key: 'World' });
        window.World = this

      }

preload()
{
    //Loads all tilesets
    TM.tilesets.forEach(set => {
        let img = loadImages(set.name)
        console.log('sad')
        this.load.image(set.name, img)
    }) 
    
    //Wird in Zukunft wohl unnötig, da direkt die TilesetBilder verwendet werden können.
    this.load.spritesheet ('ghost', loadImages('inverted'),
    {
            frameWidth: TM.config.tilewidth, 
            frameHeight: TM.config.tileheight,
            spacing: TM.config.spacing,
            margin: TM.config.margin
    });
}

//****************************************************************************************************************************************************** */

create()
{
this.maps = []

document.addEventListener('MapListSelect', () => {
    this.openMap(window.reactData.mapList[window.MapList.state.selected])
})

// ***** Ghosts ****************************************************************************************************************************************
/*
this.ghostTile = this.add.sprite(-200,-200, 'ghost', Tileset.selectedTile).setAlpha(0.5).setOrigin(0).setDepth(5)
this.ghostEraser = this.add.rectangle(-200, -200, TM.config.tilewidth, TM.config.tileheight, '0xd73434').setAlpha(0.5).setOrigin(0).setDepth(5).setVisible(false)
this.ghost = this.ghostTile; //Referenzwert für alle Ghosts

this.setGhosts = function()
{
        switch(selectedTool){
        case 'brush':
        World.ghostTile.setVisible(true)
        World.ghostEraser.setVisible(false)
        World.ghostTile.setFrame(Tileset.selectedTile-1)
        World.ghost = World.ghostTile; //Aktualisiert Referenz
        break;

        case 'eraser':
        World.ghostTile.setVisible(false)
        World.ghostEraser.setVisible(true)
        World.ghostEraser; //Aktualisiert Referenz
        break;
}}
*/

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

this.loadMaps()

//***** Tile Placement *****************************************************************************************************************/

this.placeTile = function()
{
    //Überprüft ob die Linke Maustaste gedrückt wird, ob eine Map aktiv ist und ob der cursor sich nicht über einem menuelement befindet
    if(!IM.pointer.leftButtonDown())  return; 

    let tile = World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.ground)
    
    //Floor
    if(TM.hasTileProp((Tileset.selectedTile-1),"Floor"))
    {
        if(Tileset.selectedTile == tile.index) return; //Verhindert das jeden Frame ein neues Tile platziert wird
        World.activeMap.history.addTileAction(tile, Tileset.selectedTile)
        World.activeMap.core.putTileAtWorldXY(Tileset.selectedTile, IM.pointer.worldX, IM.pointer.worldY,null,null, World.ground)
        World.whiteParticle.emitParticleAt(tile.x*tile.width, tile.y*tile.height);
        
    }

    //Above
    else if((TM.hasTileProp((Tileset.selectedTile-1),"Above")))
    {
       for(let i = 0; i < World.activeMap.above.length; i++)
       {
        if(Tileset.selectedTile == World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.above[i]).index) return; //Bricht Vorgang ab, wenn versucht wird das gleiche tile zu platzieren, das bereits gelegt wurde.
        if(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.above[i]).index == 1 || i+1 == World.activeMap.above.length)
        { 
            World.activeMap.history.addTileAction(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.above[i]), Tileset.selectedTile)
            World.activeMap.core.putTileAtWorldXY(Tileset.selectedTile, IM.pointer.worldX, IM.pointer.worldY,null,null, World.activeMap.above[i])
            World.whiteParticle.emitParticleAt(tile.x*tile.width, tile.y*tile.height);
            return;
    }}}

    //Structure
    else
    {
        for(let i = 0; i < World.activeMap.normal.length; i++)
        {
        if(Tileset.selectedTile == World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.normal[i]).index) return; //Bricht Vorgang ab, wenn versucht wird das gleiche tile zu platzieren, das bereits gelegt wurde.
        if(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.normal[i]).index == 1 || i+1 == World.activeMap.normal.length)
        { 
            World.activeMap.history.addTileAction(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.normal[i]), Tileset.selectedTile)
            World.activeMap.core.putTileAtWorldXY(Tileset.selectedTile, IM.pointer.worldX, IM.pointer.worldY,null,null, World.activeMap.normal[i])
            World.whiteParticle.emitParticleAt(tile.x*tile.width, tile.y*tile.height);
            return;
    }}}

}
//--------------------------------------------------------------------------------------------------------------

this.removeTile = function()
{
    //Überprüft ob die Linke Maustaste gedrückt wird, ob eine Map aktiv ist und ob der cursor sich nicht über einem menuelement befindet
    if(!IM.pointer.leftButtonDown())
    {
        eraserConfig.temp = [] //Leert temp Array wenn Linke Muastaste losgelassen wird.
        return;
    } 

    IM.pointer.updateWorldPoint(World.cameras.main)

    let tile = World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.ground)

    let cord = `${tile.x}${tile.y}`

    if(eraserConfig.temp.includes(cord)) return; //Wenn die exakten Koordinaten bereits in Temp gespeichert wurden dann wird der Vorgang übersprungen.
    else eraserConfig.temp.push(cord);

    //Above
    for(let i = World.activeMap.above.length; i >= 0; i--)
    {
        if(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.above[i]).index != 1)
        {
            World.activeMap.history.addTileAction(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.above[i]), 1)
            World.activeMap.core.putTileAtWorldXY(1, IM.pointer.worldX, IM.pointer.worldY,null,null, World.activeMap.above[i])
            World.redParticle.emitParticleAt(tile.x*tile.width, tile.y*tile.height);
            return;
    }}
    
    //Normal
    for(let i = World.activeMap.normal.length; i >= 0; i--)
    {
        if(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.normal[i]).index != 1)
        {
            World.activeMap.history.addTileAction(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.activeMap.normal[i]), 1)
            World.activeMap.core.putTileAtWorldXY(1, IM.pointer.worldX, IM.pointer.worldY,null,null, World.activeMap.normal[i])
            World.redParticle.emitParticleAt(tile.x*tile.width, tile.y*tile.height);
            return;
    }}
    
    //Ground
    if(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.ground).index != 1)
    {
        World.activeMap.history.addTileAction(World.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, World.cameras.main, World.ground), 1)
        World.activeMap.core.putTileAtWorldXY(1, IM.pointer.worldX, IM.pointer.worldY,null,null, World.ground)
        World.redParticle.emitParticleAt(tile.x*tile.width, tile.y*tile.height);
    }
    
}

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

//***** Update **************************************************************************************************************************************************************

this.loop = function()
{
    if(this.activeMap == undefined)return; //Bricht ab, wenn keine Map aktiv ist
    IM.pointer.updateWorldPoint(this.cameras.main) //Aktualisiert WorldCursor

    if( document.querySelectorAll( ":hover" )[document.querySelectorAll( ":hover" ).length-2] == document.getElementById('parent') && //Überprüft ob Maus nicht auf einem UI Element liegt
        IM.pointer.worldX < this.activeMap.core.widthInPixels && IM.pointer.worldY < this.activeMap.core.heightInPixels && //Überprüft ob eine Welt geladen ist und falls ja, ob die Maus sich innerhalb dieser befindet
        IM.pointer.worldX > 0 && IM.pointer.worldY > 0 &&
        IM.pointer.x < window.innerWidth-602) 
        {
            
        this.drag()
            this.ghost.setVisible(true);
            this.ghost.setPosition(this.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, this.cameras.main, World.ground).x*32, this.activeMap.core.getTileAtWorldXY(IM.pointer.worldX, IM.pointer.worldY, false, this.cameras.main, this.ground).y*32,) 
            switch(selectedTool){
                case 'brush': this.placeTile(); break;
                case 'eraser':this.removeTile(); break;
    }}
    else
    {
        this.ghost.setVisible(false)
    }
}

level2Proc.World = this.loop

}
// Functions --------------------------------------------------------------

loadMaps()
{
    //Funktion muss wahrscheinlich ausgelagert werden und als Class Method definiert werden, statt als Funktion in Create
    window.reactData.mapList = fs.readdirSync(Setup.path+'src/mapData/maps') //Sammelt Alle Maps im Entsprechenden Ordner
    for(let i = 0; i < window.reactData.mapList.length; i++) {window.reactData.mapList[i] = window.reactData.mapList[i].slice(0,window.reactData.mapList[i].length-5)} //Schneidet die .json endung aus dem String

    window.reactData.mapList.forEach(key =>
    {
        this.loadMap(key);
    })
}

loadMap(key) {
    if(this.maps[key] == undefined) //Falls Die Map nicht bereits geladen wurde wird sie jetzt geladen.
    {
    
        this.load.tilemapTiledJSON(key, loadMaps(key)); //Bereitet das laden der mapdaten vor
        this.load.once('complete', function() //Setzt eine Callback Funktion auf für sobald die Mapdaten geladen wurden
        {
            //Erstellt Map, Tileset, die einzelnen layer und Extras
            this.maps[key] = {}
            this.maps[key].core = this.make.tilemap({key: key}); //Tilemap Datei
            this.maps[key].tilesetKey = JSON.parse(fs.readFileSync(Setup.path+'src/mapData/maps/'+key+'.json')).tilesetKey //Tilesetkey für Tilesetinteraktionen       
            this.maps[key].tileset = this.maps[key].core.addTilesetImage(this.maps[key].tilesetKey, this.maps[key].tilesetKey) //Tatsächliches Tileset
            
            this.maps[key].history = new HistoryObject() //Objekt zum Verfolgen von Änderungen

            this.maps[key].ground = this.maps[key].core.createLayer('Ground', this.maps[key].tileset, 0, 0).setVisible(false);

            this.maps[key].normal = []       
            this.maps[key].normal[0] = this.maps[key].core.createLayer('Structure1', this.maps[key].tileset, 0, 0).setVisible(false); 
            this.maps[key].normal[1] = this.maps[key].core.createLayer('Structure2', this.maps[key].tileset, 0, 0).setVisible(false);

            this.maps[key].above = []
            this.maps[key].above[0] = this.maps[key].core.createLayer('Above1', this.maps[key].tileset, 0, 0).setVisible(false);   
            this.maps[key].above[1] = this.maps[key].core.createLayer('Above2',  this.maps[key].tileset, 0, 0).setVisible(false);       

            this.maps[key].border = this.add.rectangle(0, 0, this.maps[key].core.widthInPixels, this.maps[key].core.heightInPixels).setOrigin(0).setFillStyle(0x323232, 1).setVisible(false).setDepth(-1);
        },this);  
            
    }
    this.load.start(); //Startet den ladevorgang
    window.MapList.update()


    /* Nicht mehr nötig wegen React Implementation
    //Fügt ein HTML Eintrag in der Mapliste hinzu
    let div = document.createElement('DIV') 
    div.classList.add('mapEntry')
    div.addEventListener('click', World.openMap)
    div.innerHTML = `${key}`
    document.getElementById('mapList').appendChild(div) 
    */
}

openMap(key)
{
    
    let mapKey = key  
    if(mapKey == this.activeMap) return;

    if(this.activeMap != undefined)
    {
        this.activeMap.core.layers.forEach( layer =>{layer.tilemapLayer.setVisible(false)})
        this.activeMap.border.setVisible(false);
    }
    this.activeMap = this.maps[mapKey]
    this.activeMap.core.layers.forEach( layer =>{layer.tilemapLayer.setVisible(true)})
    this.activeMap.border.setVisible(true);
    this.cameraCursor.setPosition(this.activeMap.core.widthInPixels/2,this.activeMap.core.heightInPixels/2) //Zentriert Kamera auf neue Map
    //Tileset.renderTileset()
}

} //End of Class

//************************************************************************************************************************************* */
