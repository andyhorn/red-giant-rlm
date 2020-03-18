const fs = require('fs');
const path = require('path');

const PortListFile = path.join("C:", "RLM", "PortList.csv");

export default class {
    getPorts() {
        let fileData;
        if (fs.existsSync(PortListFile)) {
            fileData = fs.readFileSync(PortListFile, "utf-8");
        } else {
            fileData = "5053,5054,5055";
        }

        let portNumbers = fileData.split(",");
        portNumbers = portNumbers.map(n => Number(n));

        let lastPortNumber = portNumbers[portNumbers.length -1];
        let rlmPort = lastPortNumber + 1;
        let webPort = rlmPort + 1;
        let isvPort = webPort + 1;

        let ports = [
            `${rlmPort}:5053`,
            `${webPort}:5054`,
            `${isvPort}:${isvPort}`
        ];

        portNumbers.push(rlmPort);
        portNumbers.push(webPort);
        portNumbers.push(isvPort);

        portNumbers = portNumbers.join(",");

        fs.writeFileSync(PortListFile, portNumbers, "utf-8");

        return ports;
    }
}