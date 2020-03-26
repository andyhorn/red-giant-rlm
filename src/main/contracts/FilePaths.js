const path = require('path')
const appDataPath = require('appdata-path')
const rootPath = require('electron-root-path').rootPath;

const DOCKER_COMPOSE_FILENAME = 'docker-compose.yml'
const DOCKERFILE_FILENAME = 'Dockerfile'
const ENTRYPOINT_FILENAME = 'entrypoint.sh'
const RLM_EXECUTABLE_FILENAME = 'rlm'
const REDGIANT_SET_FILENAME = 'redgiant.set'

const rlmDirPath = path.join(appDataPath('Red Giant RLM Manager'))
const rlmAssetsDirPath = path.join(rlmDirPath, 'rlmAssets')
const licenseDirPath = path.join(rlmDirPath, 'licenses')


const assetPath = path.join(rootPath, 'resources')

const dockerComposeAsset = path.join(assetPath, DOCKER_COMPOSE_FILENAME)
const dockerfileAsset = path.join(assetPath, DOCKERFILE_FILENAME)
const entrypointAsset = path.join(assetPath, ENTRYPOINT_FILENAME)
const rlmExecutableAsset = path.join(assetPath, RLM_EXECUTABLE_FILENAME)
const redgiantSetAsset = path.join(assetPath, REDGIANT_SET_FILENAME)

const dockerComposeDest = path.join(rlmDirPath, DOCKER_COMPOSE_FILENAME)
const dockerfileDest = path.join(rlmDirPath, DOCKERFILE_FILENAME)
const entrypointDest = path.join(rlmAssetsDirPath, ENTRYPOINT_FILENAME)
const rlmExecutableDest = path.join(rlmAssetsDirPath, RLM_EXECUTABLE_FILENAME)
const redgiantSetDest = path.join(rlmAssetsDirPath, REDGIANT_SET_FILENAME)

module.exports.licenseDirPath = licenseDirPath
module.exports.rlmDirPath = rlmDirPath
module.exports.rlmAssetsDirPath = rlmAssetsDirPath

module.exports.dockerComposeAsset = dockerComposeAsset
module.exports.dockerfileAsset = dockerfileAsset
module.exports.entrypointAsset = entrypointAsset
module.exports.rlmExecutableAsset = rlmExecutableAsset
module.exports.redgiantSetAsset = redgiantSetAsset

module.exports.dockerComposeDest = dockerComposeDest
module.exports.dockerfileDest = dockerfileDest
module.exports.entrypointDest = entrypointDest
module.exports.rlmExecutableDest = rlmExecutableDest
module.exports.redgiantSetDest = redgiantSetDest
