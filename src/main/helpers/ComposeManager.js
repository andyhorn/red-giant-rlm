const yaml = require('yaml');
const fs = require('fs');
const Service = require('../models/Service').default;
const ServiceFactory = require('../models/ServiceFactory').default;
const factory = new ServiceFactory();

export default class {
    constructor (filePath) {
        this.data = "",
        this.services = [],
        this.filePath = filePath;

        this.parse(filePath);
    }

    parse(filePath) {
        console.log(filePath);
        let fileData = fs.readFileSync(filePath, "utf-8");
        console.log(fileData);
        let yamlData = yaml.parse(fileData);
        this.data = yamlData;

        this.services = this.parseServices();
    }

    parseServices() {
        let serviceList = [];
        if (this.data && this.data.services) {
            for (let service of Object.keys(this.data.services)) {
                console.log("Parsing service:");
                console.log(service);
                let serviceData = this.data.services[service];
                console.log("Service data:");
                console.log(serviceData);
                // let newService = new Service(serviceData);
                let newService = factory.Parse(serviceData);
                newService.name = service;
                serviceList.push(newService);
            }
        }

        return serviceList;
    }

    addService(orgName) {
        // let service = ServiceFactory(orgName);
        let service = factory.Make(orgName);
        this.services.push(service);
    }

    saveFile() {
        let fileData = this.stringifySelf();
        fs.writeFileSync(this.filePath, fileData, "utf-8");
    }

    stringifySelf() {
        let yamlData = {
            "version": "3",
            "services": {}
        };

        for (let service of this.services) {
            let data = service.toString();
            yamlData.services[`${service.name}`] = data;
        }

        let rawData = yaml.stringify(yamlData);
        console.log(rawData);
        return rawData;
    }
}