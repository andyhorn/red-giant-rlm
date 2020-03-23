const Handlers = require('./handlers');
const IPC = require('../contracts/Ipc');
const { ipcMain } = require('electron');

export default function init () {
    console.log("Initializing request handlers");
    // Handle the Docker count request
    ipcMain.on(IPC.DOCKER_COUNT_REQUEST, () => Handlers.handleDockerCountRequest());

    // Handle the Compose services request
    ipcMain.on(IPC.SERVICE_NAMES_REQUEST, () => Handlers.handleServiceNamesRequest());

    // Handle the service status request
    ipcMain.on(IPC.SERVICE_STATUS_REQUEST, (e, name) => Handlers.handleServiceStatusRequest(name));

    // Handle the Start Docker Image request
    ipcMain.on(IPC.START_DOCKER_REQUEST, (e, name) => Handlers.handleStartDockerRequest(name));

    // Handle the Stop Docker Image request
    ipcMain.on(IPC.STOP_DOCKER_REQUEST, (e, name) => Handlers.handleStopDockerRequest(name));

    // Handle the Remove Docker Image request
    ipcMain.on(IPC.REMOVE_SERVICE_REQUEST, (e, name) => Handlers.handleRemoveServiceRequest(name));

    // Handle the "Create Service" event
    ipcMain.on(IPC.CREATE_SERVICE_REQUEST, (e, data) => Handlers.handleCreateServiceRequest(data));

    // Handle the "Docker Services" request
    ipcMain.on(IPC.DOCKER_SERVICES_REQUEST, () => Handlers.handleDockerServicesRequest());

    // Handle the client license file request
    ipcMain.on(IPC.CLIENT_LICENSE_REQUEST, (e, port) => Handlers.handleClientLicenseRequest(port));
}