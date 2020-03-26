export default async function () {
  const Docker = require('dockerode')
  var docker = new Docker()

  var containers = await docker.listContainers()
  return containers.length
}
