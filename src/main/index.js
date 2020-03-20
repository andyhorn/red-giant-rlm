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
    launchService(data.orgName, () => {
      updateDockerCount();
    });
  }
});

function launchService(orgName, cb) {
  DockerManager.StartService(orgName)
    .then(data => {
      console.log(`${orgName} launched!`);
      console.log(data);
      cb();
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

ipcMain.on(IPC.SERVICE_STATUS_REQUEST, async (e, name) => {
  console.log(`getting service stats for ${name}`);
  let composeData = composeManager.getService(name);
  DockerManager.GetContainer("rlm_" + name)
    .then(container => {
      console.log("returning docker and compose data");
      mainWindow.webContents.send(IPC.SERVICE_STATUS_RESPONSE, { composeData, dockerData: container });
    })
    .catch(() => {
      console.log("returning only compose data");
      mainWindow.webContents.send(IPC.SERVICE_STATUS_RESPONSE, { composeData });
    });
});

ipcMain.on(IPC.START_DOCKER_REQUEST, (e, name) => {
  console.log(`starting service: ${name}`);
  launchService(name, () => {
    e.reply(IPC.START_DOCKER_RESPONSE);
  });
});

ipcMain.on(IPC.STOP_DOCKER_REQUEST, (e, name) => {
  stopService(name);
});

ipcMain.on(IPC.REMOVE_SERVICE_REQUEST, async (e, name) => {
  await stopService(name);
  composeManager.removeService("rlm_" + name);
  composeManager.saveFile();
  updateServiceNames();
});

async function stopService(name) {
  try {
    await DockerManager.StopService(name);
    updateDockerCount();
    mainWindow.webContents.send(IPC.STOP_DOCKER_RESPONSE);
  }
  catch (e) {

  }
  // let result = DockerManager.StopService(name);
  //   .then(() => {
  //     updateDockerCount();
  //     mainWindow.webContents.send(IPC.STOP_DOCKER_RESPONSE);
  //     return true;
  //   })
  //   .catch(() => {
  //     return false;
  //   });
}

function updateServiceNames() {
  composeManager.refresh();
  let services = composeManager.serviceNames();
  mainWindow.webContents.send(IPC.SERVICE_NAMES_RESPONSE, services);
}

async function updateDockerCount() {
  var num = await CountDockerInstances();
  mainWindow.webContents.send(IPC.DOCKER_COUNT_RESPONSE, num);
}