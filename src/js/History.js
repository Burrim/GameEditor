
export default class HistoryObject
{
    constructor()
    {
        this.timeline = [] //Array of all changes made on this map
        this.cursor = -1; //index of current change. Per default on the newest entry in the timeline but gets moved forward when undoing
        this.changed = false //Shows if there are any changes made to the map since the last save

    }

//***************************************************************************************************************************************************************************** */

addEntry(obj, prevVal, newVal, type)
{
    let historyEntry =
    {
        target: obj,
        prevVal : prevVal, 
        newVal : newVal,
        change : this[type]
    }
    if(this.timeline.length-1 > this.cursor) //When going back in the timeline and then adding a new action, all reversed action get removed
    this.timeline.splice(this.cursor+1, this.timeline.length)

    this.timeline.push(historyEntry)
    this.cursor++
    this.changed = true
}
undo()
{
    if(this.cursor <= -1)return;
    this.timeline[this.cursor].change()
    this.cursor--;
    this.changed = true;
}

redo()
{
    if(this.cursor < this.timeline.length-1)
    {
        this.cursor++;
        this.timeline[this.cursor].change(true);
        this.changed = true;
    }
}

//*** Types of Changes *********************************************************************************

tileChange(redo){
    if(!redo){
        this.target.index = this.prevVal
    }
    else{
        this.target.index = this.newVal
    }
    this.target.properties = World.map.getPropsFromTileset(this.target.id)
}
moveObject(redo){
    if(!redo){
        this.target.x = this.prevVal.x
        this.target.y = this.prevVal.y
    } 
    else {
        this.target.x = this.newVal.x 
        this.target.y = this.newVal.y
    }
    this.target.previousCords = {x:this.target.x, y:this.target.y}
}
deleteObject(){}

//***************************************************************************************************************************************************************************** */
}


    

