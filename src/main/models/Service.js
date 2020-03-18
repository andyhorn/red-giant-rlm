export default class Service {
    constructor (data) {
        this.data = data;
        this.container_name = '';
        this.ports = [];
        this.hostname = '';
        this.mac_address = '';
        this.build = {
            context: '',
            dockerfile: '',
            args: []
        };
        this.healthcheck = {
            test: [],
            interval: '',
            timeout: '',
            retries: null
        };
        this.restart = '';

        this.parse(data);
    }

    parse(data) {
        this.container_name = data.container_name;
        this.ports = data.ports;
        this.hostname = data.hostname;
        this.mac_address = data.mac_address;
        this.build.context = data.build.context;
        this.build.dockerfile = data.build.dockerfile;
        this.build.args = data.build.args;
        this.healthcheck.test = data.healthcheck.test;
        this.healthcheck.interval = data.healthcheck.interval;
        this.healthcheck.timeout = data.healthcheck.timeout;
        this.healthcheck.retries = data.healthcheck.retries;
    }

    print() {
        console.log(`Container name: ${this.container_name}`);
        console.log(`Ports:`);
        for (let port of this.ports) {
            console.log(`\t${port}`);
        }
        console.log(`Hostname: ${this.hostname}`);
        console.log(`MAC Address: ${this.mac_address}`);
        console.log("Build:");
        console.log(`\tContext: ${this.build.context}`);
        console.log(`\tDockerfile: ${this.build.dockerfile}`);
        console.log(`\tArgs: ${this.build.args}`);
        console.log("Healthcheck:");
        console.log(`\tTest: ${this.healthcheck.test}`);
        console.log(`\tInterval: ${this.healthcheck.interval}`);
        console.log(`\tTimeout: ${this.healthcheck.timeout}`);
        console.log(`\tRetries: ${this.healthcheck.retries}`);
    }
}