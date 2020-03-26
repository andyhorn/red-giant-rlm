const FilePaths = require('../contracts/FilePaths');
const FileManager = require('../helpers/FileManager');
const ComposeManager = require('../helpers/ComposeManager').default;
const composeManager = new ComposeManager(FilePaths.dockerComposeDest);
const Response = require('../responses/response');
const DockerManager = require('../helpers/DockerManager');
const publicIp = require('public-ip');

/* HANDLER FUNCTIONS */
export async function handleRemoveServiceRequest(serviceName) {
    console.log(`Removing service ${serviceName}`);

    showModal();
    // Stop the desired service
    let stopped = await stopService(serviceName);

    // If successfully stopped, remove the service from the compose file,
    // remove the licenses and organization folder, and trigger the
    // response event
    if (stopped) {
        console.log("Service stopped - removing from Compose file");
        removeServiceFromCompose(serviceName);
        FileManager.RemoveLicenseDirectoryFor(serviceName);
        Response.sendRemoveServiceResponse();
    }

    hideModal();
}

export async function handleServiceStatusRequest(name) {
    console.log(`Retrieving status for service "${name}"`);

    // Get the service data from the compose file
    let data = {
        composeData: composeManager.getService(name)
    };

    // Get the container data (if running)
    let container = await DockerManager.FindByName(`${name}`);

    // If a running container was found, store the data in the
    // return object
    if (container) {
        data.dockerData = container;
    }

    // Send the response event with the data
    Response.sendServiceStatusResponse(data);
}

export async function handleStartDockerRequest(name) {
    console.log(`Starting service ${name}`);
    showModal();

    // Start a service with the given name
    let started = await launchService(name);

    // If it started successfully, trigger the
    // "docker started" event
    if (started) {
        console.log("Started!");
        Response.sendStartDockerResponse();
    }

    hideModal();
}

export async function handleStopDockerRequest(data) {
    showModal();

    let stopped;
    // Stop the desired container
    if (data.isName) {
        console.log(`Stopping service ${data.name}`);
        stopped = await stopService(data.name);
    } else {
        console.log(`Stopping container ${id}`);
        stopped = await stopContainer(data.id)
    }

    // If stopped successfully, update the running
    // container count and trigger the "docker stopped" event
    if (stopped) {
        console.log("Stopped!");
        sendDockerCount();
        Response.sendStopDockerResponse();
    }

    hideModal();
}

export async function handleCreateServiceRequest(data) {
    // Show the "Working" modal
    showModal();

    console.log(`Creating service for ${data.orgName}`);

    // Check if service already exists
    let service = composeManager.getService(data.orgName);

    // If service does not exist, create a new service
    if (service == null) {
        console.log("Creating new service...");
        // Add the service
        service = composeManager.addService(data.orgName);

        // Save the file
        composeManager.saveFile();

        // Trigger the service names event
        sendServiceNames();
        console.log("Created!");
    }

    console.log("Copying license files...");
    // Remove the existing license files
    FileManager.ClearLicensesFor(data.orgName);

    // Copy in the new license files
    FileManager.CopyLicenseFiles(data.orgName, data.files);
    console.log("Copied! Updating ISV port...");

    // Update the license files with the ISV port
    let isvPort = service.getIsvPort();
    FileManager.UpdateIsv(data.orgName, isvPort);
    console.log("Updated! Launching service...");

    // (Re)Build and launch the service
    let launched = await launchService(data.orgName);

    if (launched) {
        console.log("Launched!");
    } else {
        console.log("Something happened - Unable to launch service");
    }

    // Trigger the appropriate events
    Response.sendStartDockerResponse();
    hideModal();
}

export async function handleRlmLogRequest(serviceName) {
    console.log(`Retrieving log file for container rlm_${serviceName}`);

    // Get the desired container by name
    let container = await DockerManager.FindByName(`${serviceName}`);

    // Check if the container is null (does not exist or is not running)
    if (container == null) {
        console.log("Container not found")
    }

    // If a container was found, get its ID
    let id = container.Id;
    console.log(`Container ID: ${id}`);

    // Prompt the user for a save location for the file
    let savePath = FileManager.GetSaveLocation("rlmdiag.txt");

    // If the user canceled, return early
    if (savePath == null) {
        console.log("User canceled retrieval");
        return;
    }

    // Copy the log file data to the local machine at 'savePath'
    try {
        await DockerManager.GetLogDataFor(id, savePath);
        console.log("Log file retreived");
    }
    catch (e) {
        // If there was an error, display an error popup to the user
        // This error is likely due to the log file not existing in the specified container
        console.log("Log file not retrieved");
        Response.sendRlmLogError("Error retrieving log file - Run diagnostics in the web portal, then try again.");
    }
}

// Retrieve the currently configured service names
// and send them with the "service names" event
export function handleServiceNamesRequest() {
    console.log("Sending configured service names");
    sendServiceNames();
}

// Retrieve the count of running Docker containers
// and send them in the "docker count" event
export async function handleDockerCountRequest() {
    console.log("Sending the number of Docker containers");
    sendDockerCount();
}

// Retrieve a list of running Docker containers
export async function handleDockerServicesRequest() {
    console.log("Sending the Docker services list");
    let services = await DockerManager.GetRunningContainers();
    Response.sendDockerServicesResponse(services);
}

export async function handleClientLicenseRequest(port) {
    console.log("Generating client license file");
    let ip = await publicIp.v4();
    let fileData = `HOST ${ip} ANY ${port}`;
    FileManager.SaveFile('redgiant-client.primary.lic', fileData);
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
    console.log("Sending service names:");
    console.log(names);

    Response.sendServiceNamesResponse(names);
}

// Get the current number of running containers
// and send the value in the "docker count" event
async function sendDockerCount() {
    let num = await getDockerCount();
    console.log(`Sending "${num}" Docker containers`)
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

function showModal() {
    Response.sendShowModalEvent();
}

function hideModal() {
    Response.sendHideModalEvent();
}