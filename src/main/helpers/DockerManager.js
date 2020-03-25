const { exec } = require('child_process');
const Docker = require('dockerode');

const BASE = "docker-compose -f C:\\RLM\\docker-compose.yml";
const BUILD = BASE + " up -d --build";
const STOP = BASE + " stop";

export function StartService(orgName) {
    // Build the Docker Compose command for this service
    let cmd = `${BUILD} ${orgName}`;

    console.log(`Starting container "${orgName}" with command: ${cmd}`);
    return new Promise((resolve, reject) => {
        // Execute the Docker Compose command
        exec(cmd, (err) => {
            if (err) {
                // If there was an error, reject the Promise
                console.log("Error starting container");
                console.log(err);
                return reject(err);
            }

            // Resolve the Promise
            console.log("Container started successfully");
            return resolve(true);
        });
    });
}

export async function CountRunningContainers() {
    console.log("Counting containers...");

    // Get the list of running containers
    let containers = await getAll();

    // Count and return the length of the list
    let numContainers = containers.length;
    console.log(`Found ${numContainers} running containers`);
    return numContainers;
}

export async function FindByName(name) {
    console.log(`Finding container with Image ${name}`);

    // Attempt to get a running container by name
    let container = getByName(name);

    if (container != null) {
        console.log("Container found!");
    }

    // Return the container or null
    return container;
}

export function StopService(name) {
    let cmd = `${STOP} ${name}`;
    console.log(`Stopping service "${name}"`);

    return new Promise((resolve, reject) => {
        // Execute a subprocess calling Docker Compose
        // to stop the service
        exec(cmd, (err) => {
            if (err) {
                // If there was a system error, reject the Promise
                console.log("System error stopping container");
                console.log(err);
                return reject(err);
            }

            // Resolve the Promise
            console.log("Container stopped");
            return resolve(true);
        });
    });
}

export async function GetRunningContainers() {
    console.log("Finding all running containers");

    // Get and return the full list of running containers
    let containers = await getAll();
    return containers;
}

export function StopContainer(id) {
    console.log(`Stopping container with id ${id}`);

    return new Promise((resolve, reject) => {
        // Try getting the container by its ID
        let container = getById(id);

        // If no container was found, reject the Promise
        if (container == null) {
            console.log("No container found");
            return reject("Invalid ID");
        }

        console.log("Container found - Stopping...");

        // If a container was found, try stopping it
        try {
            container.stop(() => {
                // If the container was stopped, resolve the Promise
                console.log("Stopped!");
                return resolve(true);
            });
        }
        catch (e) {
            // If there was an error stopping the container,
            // reject the Promise
            console.log("Error stopping container:");
            console.log(e);
            return reject(e);
        }
    });
}

export function GetLogDataFor(id, path) {
    console.log(`Executing copy command to retrieve log file from container ${id}`);
    let command = `docker cp ${id}:/usr/bin/rlm/rlmdiag.txt ${path}`;

    return new Promise((resolve, reject) => {
        exec(command, (err) => {
            if (err) {
                console.log("Error copying log file");
                return reject();
            }

            console.log("Log file copied!");
            return resolve();
        });
    });
}

function getById(id) {
    let docker = new Docker();

    console.log(`Finding container with id ${id}`);
    try {
        // Get the container by its ID
        let container = docker.getContainer(id);
        console.log("Container found!");

        // Return the container
        return container;
    }
    catch (e) {
        // Catch any errors, return null
        console.log("Error locating container:");
        console.log(e);
        return null;
    }
}

function getAll() {
    let docker = new Docker();

    return new Promise((resolve, reject) => {
        // Get the list of containers
        docker.listContainers()
            .then(containers => {
                // Resolve the Promise with the list of containers
                console.log(`Found ${containers.length} running containers`);
                resolve(containers);
            })
            .catch(e => {
                // If there was an error, reject the Promise with the error message
                console.log("Fatal error:");
                console.log(e);
                resolve(null);
            });
    })
}

async function getByName(name) {
    // Get the list of running containers
    let containerList = await getAll();

    // Find the container with the given name
    let container = containerList.find(x => x.Image == name);

    // If no container exists, return null
    if (container == undefined) {
        return null;
    }

    // Return the container
    return container;
}