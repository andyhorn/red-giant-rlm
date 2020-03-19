'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
const FilePaths = require('./contracts/FilePaths');
const CountDockerInstances = require('./helpers/CountDockerInstances').default;
const SetUpFiles = require('./helpers/SetUpFiles').default;
const ComposeManager = require('./helpers/ComposeManager').default;
const composeManager = new ComposeManager(FilePaths.dockerComposeDest);

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

 ipcMain.on("createService", (e, data) => {
  console.log("Adding new service with name: " + data.orgName);
  console.log(data);

  if (composeManager.addService(data.orgName)) {
    composeManager.saveFile();
    updateServiceNames();
  }
 });

 ipcMain.on("dockerCountRequest", async (e) => {
   var num = await CountDockerInstances();
   console.log(`request received, sending ${num}`);
   e.reply("dockerCountResponse", num);
 });

 ipcMain.on("serviceNamesRequest", (e) => {
   updateServiceNames();
 });

 function updateServiceNames() {
  composeManager.refresh();
  let services = composeManager.serviceNames();
  mainWindow.webContents.send("serviceNamesResponse", services);
 }

SetUpFiles();