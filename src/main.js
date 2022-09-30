const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// *** Main Window ******************************************************************************************************************

//Creates the default window and sets it up
const createWindow = () => {
  global.mainWindow = new BrowserWindow({
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

  mainWindow.setMenuBarVisibility(false)
  mainWindow.setIcon(path.join(__dirname, '/assets/logo/logo.png'));

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
const createSettingsWindow = (data) => {
  global.settingsWindow = new BrowserWindow({
    width: 480,
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
  settingsWindow.webContents.openDevTools();
  settingsWindow.webContents.send('openWindow-init', data);
}


// *** IPC ************************************************************************************************************************
//Opens Additional Window for manipulating data
ipcMain.on('openWindow', (event, arg) => {
  console.log("sent Data",arg)
  createSettingsWindow(arg) 
})

//Forwards data from external window to main Window
ipcMain.on('returnData', (event, arg) => {
  console.log("returned Data",arg)
  settingsWindow.close()
  mainWindow.webContents.send('returnData', arg); 
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







