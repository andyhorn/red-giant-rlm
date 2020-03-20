const yaml = require('yaml');
const fs = require('fs');
const ServiceFactory = require('../models/ServiceFactory').default;
// const DockerManager = require('../helpers/DockerManager');
const factory = new ServiceFactory();

export default class {
    constructor (filePath) {
        this.data = "",
        this.services = [],
        this.filePath = filePath;

        this.parse(filePath);
    }

    parse(filePath) {
        // console.log(filePath);

        // Read the file data from the existing docker-compose.yaml file
        let fileData = fs.readFileSync(filePath, "utf-8");
        // console.log(fileData);

        // Parse the Yaml data into a JSON object
        let yamlData = yaml.parse(fileData);

        // Store the JSON data in this class
        this.data = yamlData;

        // Parse the Service objects in the JSON data
        this.services = this.parseServices();
    }

    parseServices() {
        // Create an empty array
        let serviceList = [];

        // If this class has a data object and it contains a "services" object
        if (this.data && this.data.services) {

            // Loop through each service object
            for (let service of Object.keys(this.data.services)) {
                // console.log("Parsing service:");
                // console.log(service);

                // Get the service data
                let serviceData = this.data.services[service];
                // console.log("Service data:");
                // console.log(serviceData);

                // Pass the data to the ServiceFactory
                let newService = factory.Parse(serviceData);

                // Store the service name
                newService.name = service;

                // Push the service to the array
                serviceList.push(newService);
            }
        }

        // Return the array of service objects
        return serviceList;
    }

    addService(orgName) {
        // Pass the organization name to the ServiceFactory
        // to create a brand new Service object
        try {
            // Attempt to create the new Service object
            let service = factory.Make(orgName);

            // Save the Service object to this class
            this.services.push(service);

            return true;
        }
        catch (e) {
            // console.log(e);
            return false;
        }
    }

    serviceNames() {
        let names = [];
        for (let service of this.services) {
            names.push(service.name);
        }

        return names;
    }

    getService(serviceName) {
        if (this.services.length) {
            let service = this.services.find(s => s.name == serviceName);
            return service;
        }
    }

    removeService(name) {
        if (this.services.length) {
            console.log(`searching for service: ${name}`);
            // console.log(this.services);
            let index = this.services.indexOf(s => s.container_name == name);
            // console.log("service index: " + index);
            if (index != null) {
                this.services.splice(index, 1);
            }
        }
    }

    refresh() {
        this.parse(this.filePath);
    }

    saveFile() {
        // Convert this class' data to a Yaml string
        let fileData = this.stringifySelf();

        // Write the Yaml data to the file
        fs.writeFileSync(this.filePath, fileData, "utf-8");
    }

    stringifySelf() {
        // Create a base object with the version and an empty
        // services object
        let yamlData = {
            "version": "3",
            "services": {}
        };

        // Loop through each Service object within this class
        for (let service of this.services) {
            // Convert the Service object to its string form
            let data = service.toString();

            // Save the string version into the Yaml object's "services" object
            yamlData.services[`${service.name}`] = data;
        }

        // Convert the data object to a Yaml string
        let rawData = yaml.stringify(yamlData);
        // console.log(rawData);

        // Return the Yaml string
        return rawData;
    }
}