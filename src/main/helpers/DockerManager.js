const { exec } = require('child_process');
const Docker = require('dockerode');

const BASE = "docker-compose -f C:\\RLM\\docker-compose.yml";
const BUILD = BASE + " up -d --build";
const STOP = BASE + " stop";

export function StartService(orgName) {
    // var cmd = `docker-compose -f C:\\RLM\\docker-compose.yml up -d --build ${orgName}`;
    let cmd = `${BUILD} ${orgName}`;
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            if (stdout) {
                console.log("stderr:");
                console.log(stderr);
                console.log("stdout:");
                console.log(stdout);
                resolve(stdout);
            }
        });
    });
}

export function GetContainer(name) {
    let docker = new Docker();
    return new Promise((resolve, reject) => {
        docker.listContainers()
            .then(containers => {
                console.log("Containers:")
                console.log(containers);
                if (containers.length == 0) {
                    return reject("No containers found");
                }
                
                console.log(`Searching for Image "${name}"`);
                let container = containers.find(c => c.Image == name);
                console.log(container);

                if (container == null) {
                    return reject(`Container "${name}" not found`);
                }

                console.log("Returning container");
                return resolve(container);
            });
    });
}

export function StopService(name) {
    let cmd = `${STOP} ${name}`;
    console.log(`stopping service "${name}"`);
    console.log(cmd);
    
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            return resolve(stdout);
        });
    });
}