const yaml = require('yaml');

export default class Service {
    constructor(data) {
        // this.data = data;
        this.name = '';
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

        // if (data) {
        //     this.parse(data);
        // }
    }

    // parse(data) {
    //     console.log(data);
    //     // data = yaml.parse(data);
    //     this.name = data.name;
    //     this.data = data;
    //     console.log(data);
    //     this.container_name = data.container_name;
    //     this.ports = data.ports;
    //     this.hostname = data.hostname;
    //     this.mac_address = data.mac_address;
    //     this.build = data.build;
    //     this.healthcheck = data.healthcheck;
    //     this.restart = data.restart;
    // }

    toString() {
        let rawData = {
            container_name: this.container_name,
            ports: this.ports,
            hostname: this.hostname,
            mac_address: this.mac_address,
            build: {
                context: this.build.context,
                dockerfile: this.build.dockerfile,
                args: this.build.args
            },
            healthcheck: {
                test: this.healthcheck.test,
                interval: this.healthcheck.interval,
                timeout: this.healthcheck.timeout,
                retries: this.healthcheck.retries
            },
            restart: this.restart
        };

        return rawData;

        // let yamlData = yaml.stringify(rawData);
        // return yamlData;
    }
}