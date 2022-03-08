
const placeObject = (cords, data, map) => {

//---Set coordinates -------------------------------------------------------------------------------------
    let pos = cords
    //If no cords are given take the pointer cords are taken and rounded to tilegrid otherwise use saved cords
    if(!pos){
        pos = {
            x:World.pointer.worldX - (World.pointer.worldX % World.activeMap.core.tileWidth), 
            y:World.pointer.worldY - (World.pointer.worldY % World.activeMap.core.tileHeight)
        }
    }
    
//--- Fetches Data -------------------------------------------------------------------------------------
    let obj = data
    //Pulls Data from Project Data if not given directly
    if(!obj)
    obj = JSON.parse(JSON.stringify(Setup.project.objects[ObjectList.state.selected]))
    

    let targetMap = map
    if(!targetMap) targetMap = World.activeMap

//---Creates Elements -------------------------------------------------------------------------------------
    let sprite = World.add.image(0,0,`${obj.editorData.img}-Sprite`).setOrigin(0)
    let text = World.add.text(obj.editorData.width/2 ,0,obj.editorData.text).setOrigin(0.5,1)

    let edit = World.add.image(0,-24,`settings-mapIcon`).setOrigin(0)
    let del = World.add.image(0,24,`delete-mapIcon`).setOrigin(0)
    let menu = World.add.container(obj.editorData.width+16,0,[edit,del]).setVisible(false)

    let container = World.add.container(pos.x,pos.y,[sprite,text,menu])

    targetMap.objects.push(container)

    //Setup Menu 
    edit.setInteractive()
    del.setInteractive()
    sprite.setInteractive()

//--- Container Events and functions -------------------------------------------------------------------------------------
    sprite.on('pointerdown', () => {
        if(World.pointer.rightButtonDown()){
            if(menu.visible)menu.setVisible(false)
            else menu.setVisible(true)
        }
        else if(World.pointer.leftButtonDown() && World.activeTool == 'object'){
            container.dragActive = true
        }
    })

    edit.on('pointerdown', ()=> {
        if(World.pointer.leftButtonDown()){
            container.edit()
            menu.setVisible(false)
        }
    })

    del.on('pointerdown', ()=> {
        if(World.pointer.leftButtonDown())
        container.delete()
    })

    container.move = function(){
        if(!this.dragActive) return
        this.x = World.pointer.worldX - (World.pointer.worldX % World.activeMap.core.tileWidth)
        this.y = World.pointer.worldY - (World.pointer.worldY % World.activeMap.core.tileHeight)
        menu.setVisible(false)
    }

    container.place = function(){
        this.dragActive = false
        this.previousCords = {x:this.x, y:this.y}
    }

    container.return = function(){
        this.dragActive = false
        this.x = this.previousCords.x
        this.y = this.previousCords.y
    }

    //Opens external Window to edit data
    container.edit = function(){
        openWindow(container.data)
    }

    //Receives Data from external window and inserts it back in
    container.receiveData = function(data){
        Object.keys(data.customData).forEach(key => {
            container.data.customData[key] = data.customData[key]
            container.data.data[key] = data.customData[key]
        })
    }

    container.getSource = function(){
        let value
        for(let i = 0; i < Setup.project.objects.length; i++){
            if(Setup.project.objects[i].name == this.data.name){
                value = Setup.project.objects[i].data
                break;
            } 
        }
        return value
    }

    container.delete = function(){
        this.setVisible(false)
        World.activeMap.objects.forEach((obj, index) => {
            if(obj.data.id.num == this.data.id.num){
                World.activeMap.objects.splice(index,1)
                console.log('splice')
            }
        });
    }

//--- Setup Data -------------------------------------------------------------------------------------
    
    container.data = obj
    container.data.id = {
        num: assignId(),
        map: targetMap.name
    }

    if(!container.data.customData)
    container.data.customData = {}

    //When The object is loaded from mapfile the data from the object source gets inserted and then overwritten with any custom data if avaiable
    if(data){
        container.data.data = JSON.parse(JSON.stringify(container.getSource()))
        if(container.data.customData != {})
        Object.assign(container.data.data, JSON.parse(JSON.stringify(container.data.customData)))
    }
    
    container.dragActive = false
    container.previousCords = {x:container.x, y:container.y}
}

export default placeObject