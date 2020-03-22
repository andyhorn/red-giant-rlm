const IPC = require('../contracts/Ipc');

var webContents;

export function init(data) {
    webContents = data.mainWindow.webContents;
}

export function sendResponse(response, data = null) {
    console.log(`Sending response type: ${response}`);
    if (data !== null) {
        console.log(`Sending response with data: ${data}`);
        webContents.send(response, data);
    } else {
        webContents.send(response)
    }
}

export function sendServiceStatusResponse(data) {
    sendResponse(IPC.SERVICE_STATUS_RESPONSE, data);
}

export function sendStartDockerResponse() {
    sendResponse(IPC.START_DOCKER_RESPONSE);
}

export function sendStopDockerResponse() {
    sendResponse(IPC.STOP_DOCKER_RESPONSE);
}

export function sendRemoveServiceResponse() {
    sendResponse(IPC.REMOVE_SERVICE_RESPONSE);
}

export function sendServiceNamesResponse(names) {
    sendResponse(IPC.SERVICE_NAMES_RESPONSE, names);
}

export function sendDockerCountResponse(count) {
    console.log(`Sending Docker Count Response with number: ${count}`);
    sendResponse(IPC.DOCKER_COUNT_RESPONSE, count);
}

export function sendDockerServicesResponse(services) {
    console.log("Sending Docker services response with services:");
    console.log(services);
    sendResponse(IPC.DOCKER_SERVICES_RESPONSE, services);
}