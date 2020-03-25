const IPC = require('../contracts/Ipc');

var webContents;

export function init(data) {
    webContents = data.mainWindow.webContents;
}

export function sendResponse(response, data = null) {
    console.log(`Sending response type: ${response}`);
    if (data !== null) {
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
    sendResponse(IPC.DOCKER_COUNT_RESPONSE, count);
}

export function sendDockerServicesResponse(services) {
    sendResponse(IPC.DOCKER_SERVICES_RESPONSE, services);
}

export function sendShowModalEvent() {
    sendResponse(IPC.SHOW_MODAL_EVENT);
}

export function sendHideModalEvent() {
    sendResponse(IPC.HIDE_MODAL_EVENT);
}

export function sendRlmLogError(content) {
    sendResponse(IPC.RLM_LOGS_RESPONSE, content);
}