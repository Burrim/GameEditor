const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// *** Main Window ******************************************************************************************************************

//Creates the default window and sets it up
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: true,
    webPreferences:
    {       
      nodeIntegration:true, 
      contextIsolation:false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  //load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

//The Almighty holy best codelines ever in all existence. Fixes some annoying problems with the webpack testserver
const { session } = require('electron')
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': '' //FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK THIIIIIIIIIIIIIIS
    }
  })
})

};

// *** Settings Window ******************************************************************************************************************

//Creates the default window and sets it up
const createSettingsWindow = () => {
  const settingsWindow = new BrowserWindow({
    width: 800,
    height: 640,
    frame: true,
    webPreferences:
    {       
      nodeIntegration:true, 
      contextIsolation:false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preloadSettings.js')
    }
  });
  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);
  settingsWindow.removeMenu()
}


// *** IPC ************************************************************************************************************************

ipcMain.on('openWindow', (event, arg) => {
  console.log(arg)
  createSettingsWindow() 
  //event.reply('startup-reply', filterData(filter))
})

// *** Events *********************************************************************************************************************

//Startup when App is loaded
app.on('ready', function(){
  createWindow()
  
});

//Shuts app down when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});







