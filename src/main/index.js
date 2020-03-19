'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { stat } from 'fs';
const FilePaths = require('./contracts/FilePaths');
const CountDockerInstances = require('./helpers/CountDockerInstances').default;
const SetUpFiles = require('./helpers/SetUpFiles').default;
const DockerManager = require('./helpers/DockerManager');
const FileManager = require('./helpers/FileManager');
const ComposeManager = require('./helpers/ComposeManager').default;
const IPC = require('./contracts/Ipc');

SetUpFiles();
const composeManager = new ComposeManager(FilePaths.dockerComposeDest);

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let statusWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const statusURL = `file://${__dirname}/status.html`

function createWindow() {
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

ipcMain.on("createService", async (e, data) => {
  console.log("Adding new service with name: " + data.orgName);
  console.log(data);

  if (composeManager.addService(data.orgName)) {
    composeManager.saveFile();
    updateServiceNames();
    FileManager.CopyLicenseFiles(data.orgName, data.files);
    launchService(data.orgName);
  }
});

function launchService(orgName) {
  DockerManager.launchService(orgName)
    .then(data => {
      console.log(`${orgName} launched!`);
      console.log(data);
      updateDockerCount();
    })
    .catch(err => {
      console.log(`${orgName} failed to launch...`);
      console.log(err);
    })
}

ipcMain.on(IPC.DOCKER_COUNT_REQUEST, async (e) => {
  updateDockerCount();
});

ipcMain.on(IPC.SERVICE_NAMES_REQUEST, (e) => {
  updateServiceNames();
});

ipcMain.on(IPC.SERVICE_STATUS_REQUEST, (e, data) => {
  let serviceName = data;
  console.log(`getting service stats for ${data}`);
  let composeData = composeManager.getService(serviceName);
  let dockerData = null;
  DockerManager.GetStats(serviceName)
    .then(service => {
      console.log(service);
      dockerData = service;
    })
    .catch(err => {
      console.log("Service stats error:");
      console.log(err);
    })
    .finally(() => {
      console.log("compose data:");
      console.log(composeData);
      console.log("docker data:");
      console.log(dockerData);
      e.reply(IPC.SERVICE_STATUS_RESPONSE, {composeData, dockerData});
    });
});

function updateServiceNames() {
  composeManager.refresh();
  let services = composeManager.serviceNames();
  mainWindow.webContents.send(IPC.SERVICE_NAMES_RESPONSE, services);
}

async function updateDockerCount() {
  var num = await CountDockerInstances();
  mainWindow.webContents.send(IPC.DOCKER_COUNT_RESPONSE, num);
}