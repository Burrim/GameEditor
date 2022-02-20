fs = require('fs');
const { ipcRenderer} = require('electron')

window.openWindow = (data) => ipcRenderer.send('openWindow', data)

