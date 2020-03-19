const { exec, execSync } = require('child_process');

export function launchService(orgName) {
    // var cmd = ["docker-compose", "C:\\RLM\\docker-compose.yml", "up", orgName];
    var cmd = `docker-compose -f C:\\RLM\\docker-compose.yml up -d --build ${orgName}`;
    // execSync(cmd);
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                // console.log(err);
                reject(err);
            }
            // if (stderr) {
            //     console.log(stderr);
            //     // reject(stderr);
            // }
            if (stdout) {
                console.log(stdout);
                resolve(stdout);
            }
        });
    });
}