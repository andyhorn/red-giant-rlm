import { sendDockerServicesResponse } from '../responses/response';

const FilePaths = require('../contracts/FilePaths');
const FileManager = require('../helpers/FileManager');
const ComposeManager = require('../helpers/ComposeManager').default;
const composeManager = new ComposeManager(FilePaths.dockerComposeDest);
const Response = require('../responses/response');
const DockerManager = require('../helpers/DockerManager');

/* HANDLER FUNCTIONS */
export async function handleRemoveServiceRequest(serviceName) {
    // Stop the desired service
    let stopped = await stopService(serviceName);

    // If successfully stopped, remove the service from the compose file,
    // remove the licenses and organization folder, and trigger the
    // response event
    if (stopped) {
        removeServiceFromCompose(serviceName);
        FileManager.RemoveLicenseFiles(serviceName);
        Response.sendRemoveServiceResponse();
    }
}

export async function handleServiceStatusRequest(name) {
    console.log(`Retrieving status for service "${name}"`);

    // Get the service data from the compose file
    let data = {
        composeData: composeManager.getService(name)
    };

    // Get the container data (if running)
    let container = await DockerManager.GetContainer(`rlm_${name}`);

    // If a running container was found, store the data in the
    // return object
    if (container) {
        data.dockerData = container;
    }

    // Send the response event with the data
    Response.sendServiceStatusResponse(data);
}

export async function handleStartDockerRequest(name) {
    console.log(`Starting service "${name}"`);

    // Start a service with the given name
    let started = await launchService(name);

    // If it started successfully, trigger the
    // "docker started" event
    if (started) {
        Response.sendStartDockerResponse();
    }
}

export async function handleStopDockerRequest(data) {
    let stopped;
    // Stop the desired container
    if (data.isName) {
        stopped = await stopService(data.name);
    } else {
        stopped = await stopContainer(data.id)
    }

    // If stopped successfully, update the running
    // container count and trigger the "docker stopped" event
    if (stopped) {
        sendDockerCount();
        Response.sendStopDockerResponse();
    }
}

export async function handleCreateServiceRequest(data) {
    console.log("Adding new service with name: " + data.orgName);

    // Add a new service to the compose file
    let service = composeManager.addService(data.orgName);

    // If successfully added, save the compose file data
    // and trigger the "update service names" event
    if (service) {
        console.log("Service added to Compose file");
        composeManager.saveFile();
        sendServiceNames();

        // Copy the license files to the organization folder
        console.log("Copying license files");
        FileManager.CopyLicenseFiles(data.orgName, data.files);

        let port = service.ports[2].split(":")[1];
        console.log(`Setting ISV port to ${port}`);
        let result = FileManager.UpdateIsv(data.orgName, port);
        console.log(result);

        // Launch the new service
        console.log("Launching new service...");
        let launched = await launchService(data.orgName);
        if (launched) {
            // If launched successfully, trigger the 
            // "docker count" event
            console.log("Successfully launched!");
            sendDockerCount();
        }
    }
}

// Retrieve the currently configured service names
// and send them with the "service names" event
export function handleServiceNamesRequest() {
    sendServiceNames();
    // let services = getServiceNames();
    // Response.sendServiceNamesResponse(services);
}

// Retrieve the count of running Docker containers
// and send them in the "docker count" event
export async function handleDockerCountRequest() {
    sendDockerCount();
}

// Retrieve a list of running Docker containers
export async function handleDockerServicesRequest() {
    let services = await DockerManager.GetRunningContainers();
    sendDockerServicesResponse(services);
}

/* HELPER FUNCTIONS */

// Use the DockerManager to launch a new service and 
// return the success/fail result
async function launchService(orgName) {
    let started = await DockerManager.StartService(orgName);
    return started;
}

async function sendServiceNames() {
    let names = getServiceNames();
    Response.sendServiceNamesResponse(names);
}

// Get the current number of running containers
// and send the value in the "docker count" event
async function sendDockerCount() {
    let num = await getDockerCount();
    Response.sendDockerCountResponse(num);
}

// Remove a service section from the compose file
// and save the file data
function removeServiceFromCompose(name) {
    composeManager.removeService(`rlm_${name}`);
    composeManager.saveFile();
}

// Stop a desired service and return the success/fail result
async function stopService(name) {
    let result = await DockerManager.StopService(name);
    return result;
}

async function stopContainer(id) {
    let result = await DockerManager.StopContainer(id);
    return result;
}

// Get the number of currently running containers
async function getDockerCount() {
    let num = await DockerManager.CountRunningContainers();
    return num;
}

// Get a list of service names in the compose file
function getServiceNames() {
    composeManager.refresh();
    let services = composeManager.serviceNames();
    return services;
}