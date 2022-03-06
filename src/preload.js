fs = require('fs');
const { ipcRenderer} = require('electron')

window.openWindow = (data) => ipcRenderer.send('openWindow', data)

//Receives Data from external window and searches fitting Object to put it back inside
ipcRenderer.on('returnData', (event, data) => {
    World.maps[data.id.map].objects.forEach(obj => {
        if(obj.data.id.num == data.id.num){
            obj.receiveData(data)
        }
    });
  })