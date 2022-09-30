fs = require('fs');
const { ipcRenderer} = require('electron')

window.openWindow = (data) => ipcRenderer.send('openWindow', data)

//Receives Data from external window and searches fitting Object to put it back inside
ipcRenderer.on('returnData', (event, data) => {
    World.map.objects.forEach(obj => {
        if(obj.id == data.id){
            obj.receiveData(data.values)
        }
    });
  })