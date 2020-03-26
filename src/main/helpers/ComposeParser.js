export default function (composeFile) {
  const Service = require('../models/Service').default
  const yaml = require('yaml')
  const data = yaml.parse(composeFile)
  var services = []

  if (!data.services) {
    return services
  }

  for (let i of Object.keys(data.services)) {
    let data = composeFile.services[i]
    let service = new Service(data)

    services.push(service)
  }

  return services
}
