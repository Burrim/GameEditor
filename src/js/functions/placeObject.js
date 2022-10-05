import Phaser from "phaser"
export default function(cords, data, map, chunk){
    //Set coordinates
    let pos = cords
    World.input.activePointer.updateWorldPoint(World.cameras.main)
    //If no cords are given take the pointer cords are taken and rounded to tilegrid otherwise use saved cords
    if(!pos){
        pos = {
            x:World.pointer.worldX - (World.pointer.worldX % World.map.core.tileWidth), 
            y:World.pointer.worldY - (World.pointer.worldY % World.map.core.tileHeight)
        }
    }

    //Grabs the source object for completing missing informations in the object. Grabs it from different places depending on how this function was executed
    let sourceData 
    if(cords == undefined) sourceData = Object.values(files.objects.all)[ObjectList.state.selected]
    else sourceData = files.objects.all[data.name]

    
    
    //Creates Elements
    let container = new Container_Object(pos.x,pos.y, sourceData, data, chunk)
    World.map.objects.push(container)
    if(cords == undefined) container.chunk.changed = true //If the Object was placed by hand it gets set to changed
    
    return container
}

//--- Class -------------------------------------------------------------------------------------

class Container_Object extends Phaser.GameObjects.Container{
    constructor(x,y,src,data,chunk){
        super(World,x,y,)
        World.add.existing(this)

        this.id = assignId()
        this.name = src.name
        this.changed = false 
        this.previousCords = {x:this.x, y:this.y}

        this.chunk = chunk
        if(this.chunk == undefined) this.chunk = World.map.getChunkByPixelCord(x,y)
        this.chunk.objects.push(this)
        //this.setDepth(10)

        this.src = src //Original Data Source
        this.editorData = src.editorData
        if(data == undefined) this.data = {} //Fetches already modified data for the Object
        else this.data = data.data 

        //Always visible elements
        this.sprite = World.add.image(0,0,`${this.editorData.img}-Sprite`).setOrigin(0).setInteractive()
        this.text = World.add.text(this.editorData.width/2 ,0,this.editorData.text).setOrigin(0.5,1)
        this.selection = World.add.rectangle(0,0,this.editorData.width,this.editorData.height).setStrokeStyle(2, 0xffffff).setVisible(false).setOrigin(0)

        this.sprite.on('pointerdown', this.click)

        //expandable menu
        this.editBtn = World.add.image(0,-24,`settings-mapIcon`).setOrigin(0).setInteractive()
        this.delBtn = World.add.image(0,24,`delete-mapIcon`).setOrigin(0).setInteractive()
        this.menu = World.add.container(this.editorData.width+16,0,[this.editBtn,this.delBtn]).setVisible(false)

        //Menu Functionality
        this.editBtn.on('pointerdown', ()=> {
            if(World.pointer.leftButtonDown()){
                this.edit()
                this.menu.setVisible(false)
        }})

        this.delBtn.on('pointerdown', ()=> {
            if(World.pointer.leftButtonDown())
            this.delete()
        })

        this.add([this.sprite,this.selection,this.text,this.menu])
    }

//--- Methods ------------------------------------------------------------------------------------------

    click = () => {
        //Activates menu on rightclick
        if(World.pointer.rightButtonDown()){
            if(this.menu.visible)this.menu.setVisible(false)
            else this.menu.setVisible(true)
        }
        //Selects object on leftclick
        else if(World.pointer.leftButtonDown() && World.activeTool == 'object'){
            if(World.selected) World.selected.selection.setVisible(false)
            World.selected = this
            this.selection.setVisible(true)
        }
    }
    drag = () => {
        World.input.activePointer.updateWorldPoint(World.cameras.main)
        this.x = World.pointer.worldX - (World.pointer.worldX % World.map.core.tileWidth)
        this.y = World.pointer.worldY - (World.pointer.worldY % World.map.core.tileHeight)
        this.menu.setVisible(false)
    }
    delete = () => {
        this.setVisible(false)
        if(World.selected) World.selected = undefined

        //Removes Object from Map and Chunk
        World.map.objects.forEach((obj,index) => {
            if(obj.id == obj.id){
                World.map.objects.splice(index,1)
        }})
        this.chunk.removeObject(this.id)

        if(this.chunk) this.chunk.changed = true
        console.log(this.chunk)
    }
    edit = () => {
        let data = mergeDeep(cloneDeep(this.src).data,this.data)
        openWindow({
            id: this.id,
            values: data
        })
    }
    receiveData = (data) => {
        this.data = mergeDeep(this.data,data)
        this.changed = true
    }
    drop = (x,y) =>{
        if(this.chunk) this.chunk.changed = true //Flags the Chunk this was previously in for change

        //Removes Object from previous Chunk and inserts it into new
        this.chunk.removeObject(this.id)
        this.chunk = World.map.getChunkByPixelCord(this.x,this.y)
        this.chunk.objects.push(this)
        this.chunk.changed = true //Flags new Chunk for Change

        World.map.history.addEntry(this, cloneDeep(this.previousCords), {x:this.x,y:this.y},'moveObject')
        this.previousCords = {x:this.x, y:this.y}
    }
    return = () => {
        this.x = this.previousCords.x
        this.y = this.previousCords.y
    }
}

/*
    Explanation for dataflow between loading, placing, editing and saving an object again:
*/


