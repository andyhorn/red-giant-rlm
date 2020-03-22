const { exec } = require('child_process');
const Docker = require('dockerode');

const BASE = "docker-compose -f C:\\RLM\\docker-compose.yml";
const BUILD = BASE + " up -d --build";
const STOP = BASE + " stop";

export function StartService(orgName) {
    let cmd = `${BUILD} ${orgName}`;
    console.log(`Starting container "${orgName}" with command: ${cmd}`);
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.log("Error starting container");
                console.log(err);
                resolve(false);
            }
            if (stdout) {
                console.log("Container started successfully");
                resolve(true);
            }
        });
    });
}

export function CountRunningContainers() {
    console.log("Counting containers...")
    let docker = new Docker();
    return new Promise((resolve, reject) => {
        docker.listContainers()
            .then(containers => {
                let num = containers.length;
                console.log(`Found ${num} running containers`);
                resolve(num);
            })
            .catch(() => {
                console.log("No containers running");
                resolve(0);
            });
    });
}

export function GetContainer(name) {
    let docker = new Docker();
    return new Promise((resolve, reject) => {
        docker.listContainers()
            .then(containers => {
                if (containers.length == 0) {
                    console.log("Error: No containers running");
                    return resolve(false);
                }
                
                console.log(`Searching for Image "${name}"`);
                let container = containers.find(c => c.Image == name);

                if (container == null) {
                    console.log("Container not found");
                    return resolve(false);
                }

                console.log("Container found - returning");
                return resolve(container);
            });
    });
}

export function StopService(name) {
    let cmd = `${STOP} ${name}`;
    console.log(`Stopping service "${name}"`);
    
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.log("Error stopping container");
                console.log(err);
                return resolve(false);
            }

            console.log("Container stopped");
            return resolve(true);
        });
    });
}

export function GetRunningContainers() {
    let docker = new Docker();
    return new Promise((resolve, reject) => {
        docker.listContainers()
            .then(containers => {
                resolve(containers);
            })
            .catch(e => {
                reject(e);
            });
    })
}

export function StopContainer(id) {
    let docker = new Docker();
    return new Promise((resolve, reject) => {
        let container = docker.getContainer(id);
        if (container) {
            container.stop(() => {
                resolve(true);
            });
        } else {
            reject(false);
        }
    })
}