const { exec } = require('child_process');
const Docker = require('dockerode');

export function launchService(orgName) {
    var cmd = `docker-compose -f C:\\RLM\\docker-compose.yml up -d --build ${orgName}`;
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

export function GetStats(name) {
    return new Promise((resolve, reject) => {
        let docker = new Docker();
        docker.listContainers()
            .then(containers => {
                if (containers.length == 0) {
                    return reject("No containers found");
                }

                let service = containers.find(c => c.name == name);
                if (service == null) {
                    return reject(`Container ${name} not found`);
                }

                return resolve(service);
            });
    });
}