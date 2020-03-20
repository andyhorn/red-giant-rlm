const Service = require('./Service').default;
const PortManager = require('./PortManager').default;
const portManager = new PortManager();

export default class {
    constructor() {}

    Make(orgName) {
        let ports = getPorts();
        let webPort = ports[1].split(":")[0];
        let newService = new Service();

        newService.name = orgName;
        newService.container_name = `rlm_${orgName}`;
        newService.ports = ports;
        newService.hostname = orgName;
        newService.mac_address = "12:34:56:78:90:AB";
        newService.build = {
            context: ".",
            dockerfile: "./Dockerfile",
            args: [`ORG=${orgName}`]
        };
        newService.healthcheck = {
            test: `curl -f localhost:5054 || exit 1`,
            interval: "2m",
            timeout: "10s",
            retries: 3
        };
        newService.restart = "always";
        return newService;
    }

    Parse(data) {
        let newService = new Service();
        console.log(data);

        newService.name = data.name;
        newService.container_name = data.container_name;
        newService.ports = data.ports;
        newService.hostname = data.hostname;
        newService.mac_address = data.mac_address;
        newService.build = data.build;
        newService.healthcheck = data.healthcheck;

        console.log(typeof(data.healthcheck.test));
        if (typeof(data.healthcheck.test) != "string") {
            data.healthcheck.test = data.healthcheck.test.join(' ');
        }

        newService.healthcheck.test = data.healthcheck.test;
        newService.restart = data.restart;

        return newService;
    }
}

function getPorts() {
    let ports = portManager.getPorts();
    return ports;
}