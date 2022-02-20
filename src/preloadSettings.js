window.fs = require('fs');
const { ipcRenderer, contextBridge } = require('electron')
/*
contextBridge.exposeInMainWorld('electron',{
    dataConfirm: (data) => ipcRenderer.send('dataConfirm', data),
    cancel: () => ipcRenderer.send('cancel', data),
    handle: ( channel, callable, event, data ) => ipcRenderer.on( channel, callable( event, data ) )
  }
)
*/