
export default class HistoryObject
{
    constructor()
    {
        this.list = [] //Array aller durchgeführten Aktionen
        this.cursor = -1; //Array Cursor/index
        this.changed = false //Zeigt ob seit dem letzten Speichern Änderungen gemacht wurden

    }

//***************************************************************************************************************************************************************************** */

addTileAction(obj, val)
{
    let historyEntry =
    {
        tile: obj,
        layer: obj.tilemapLayer,
        oldValue: obj.index,
        newValue: val,
        undo()
        {
            World.activeMap.core.putTileAt(this.oldValue, this.tile.x, this.tile.y, null, this.layer) //Es ist wichtig dies so zu machen und nicht nur den Index zu verändern, da sosnt etwaige tile eigenschaften falsch übernommen werden
        },
        redo()
        {
            World.activeMap.core.putTileAt(this.newValue, this.tile.x, this.tile.y, null, this.layer)
        }
    }

    if(this.list.length-1 > this.cursor) //Wenn man sich mit Undo weiter hinten ins Array bewegt und danach wieder eine neue Aktion vollführt werden alle gespeicherten Werte, die danach kommen würden gelöscht.
    this.list.splice(this.cursor+1, this.list.length)

    this.list.push(historyEntry)
    this.cursor++
    this.changed = true
}
undo()
{
    if(this.cursor <= -1)return;
    this.list[this.cursor].undo()
    this.cursor--;
    this.changed = true;
}

redo()
{
    if(this.cursor < this.list.length-1)
    {
        this.cursor++;
        this.list[this.cursor].redo();
        this.changed = true;
    }
}

//***************************************************************************************************************************************************************************** */
}


    

