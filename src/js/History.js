
export default class HistoryObject
{
    constructor()
    {
        this.list = [] //Array aller durchgeführten Aktionen
        this.cursor = -1; //Array Cursor/index
        this.changed = false //Zeigt ob seit dem letzten Speichern Änderungen gemacht wurden

    }

//***************************************************************************************************************************************************************************** */

addEntry(obj, prevVal, newVal)
{
    let historyEntry =
    {
        tile: obj,
        prevVal : prevVal, 
        newVal : newVal,
        undo()
        {
            this.tile.index = prevVal
        },
        redo()
        {
            this.tile.index = newVal
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


    

