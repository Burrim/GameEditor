window.fs = require('fs');

window.ipcRenderer = require('electron').ipcRenderer

ipcRenderer.on('openWindow-init', (event, arg) => {
  window.data = arg
})