const yaml = require('yaml')
const fs = require('fs')
const ServiceFactory = require('../models/ServiceFactory').default
const factory = new ServiceFactory()
const MINIMUM_PORT_NUMBER = 5000

export default class {
  constructor (filePath) {
    this.filePath = filePath

    this.parse(filePath)
  }

  parse (filePath) {
    // Read the file data from the existing docker-compose.yaml file
    let fileData = fs.readFileSync(filePath, 'utf-8')

    // Parse the Yaml data into a JSON object
    let yamlData = yaml.parse(fileData)

    // Store the JSON data in this class
    this.data = yamlData

    // Parse the Service objects in the JSON data
    this.services = this.parseServices()
  }

  parseServices () {
    // Create an empty array
    let serviceList = []

    // If this class has a data object and it contains a "services" object
    if (this.data && this.data.services) {
      // Loop through each service object
      for (let service of Object.keys(this.data.services)) {
        // Get the service data
        let serviceData = this.data.services[service]

        // Pass the data to the ServiceFactory
        let newService = factory.Parse(serviceData)

        // Store the service name
        newService.name = service

        // Push the service to the array
        serviceList.push(newService)
      }
    }

    // Return the array of service objects
    return serviceList
  }

  addService (orgName) {
    // Pass the organization name to the ServiceFactory
    // to create a brand new Service object
    try {
      // Attempt to create the new Service object
      let service = factory.Make(orgName)
      let ports = this.getPorts()
      service.ports = ports

      // Save the Service object to this class
      this.services.push(service)

      return service
    } catch (e) {
      return false
    }
  }

  getPorts () {
    console.log('Assigning ports')
    let currentPorts = []
    this.services.forEach(s => {
      let servicePorts = s.ports.map(p => p.split(':')[0])
      console.log(servicePorts)
      currentPorts.push(...servicePorts)
    })
    console.log('Currently used ports:')
    console.log(currentPorts)
    let ports = []
    let port = MINIMUM_PORT_NUMBER
    for (let i = 0; i < 3; i++) {
      while (currentPorts.some(p => p === port)) {
        console.log(`Port ${port} already taken`)
        port += 1
      };

      ports.push(port)
      port += 1
    }

    console.log('Ports chosen:')
    console.log(ports)
    return [
      `${ports[0]}:5053`,
      `${ports[1]}:5054`,
      `${ports[2]}:${ports[2]}`
    ]
  }

  serviceNames () {
    let names = []
    for (let service of this.services) {
      names.push(service.name)
    }

    return names
  }

  getService (serviceName) {
    if (this.services.length) {
      let service = this.services.find(s => s.name === serviceName)
      return service
    }

    return null
  }

  removeService (name) {
    if (this.services.length) {
      console.log(`searching for service: ${name}`)
      let index = this.services.indexOf(s => s.container_name === name)
      if (index != null) {
        this.services.splice(index, 1)
      }
    }
  }

  refresh () {
    this.parse(this.filePath)
  }

  saveFile () {
    // Convert this class' data to a Yaml string
    let fileData = this.stringifySelf()

    // Write the Yaml data to the file
    fs.writeFileSync(this.filePath, fileData, 'utf-8')
  }

  stringifySelf () {
    // Create a base object with the version and an empty
    // services object
    let yamlData = {
      'version': '3',
      'services': {}
    }

    // Loop through each Service object within this class
    for (let service of this.services) {
      // Convert the Service object to its string form
      let data = service.toString()

      // Save the string version into the Yaml object's "services" object
      yamlData.services[`${service.name}`] = data
    }

    // Convert the data object to a Yaml string
    let rawData = yaml.stringify(yamlData)
    // console.log(rawData);

    // Return the Yaml string
    return rawData
  }
}
