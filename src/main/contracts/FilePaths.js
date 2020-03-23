const path = require('path');

const DOCKER_COMPOSE_FILENAME = "docker-compose.yml";
const DOCKERFILE_FILENAME = "Dockerfile";
const ENTRYPOINT_FILENAME = "entrypoint.sh";
const RLM_EXECUTABLE_FILENAME = "rlm";
const REDGIANT_SET_FILENAME = "redgiant.set";
const ADD_ISV_FILENAME = "add-isv.py";

var rlmDirPath = path.join("C:", "RLM");
var rlmAssetsDirPath = path.join(rlmDirPath, "rlmAssets");
var licenseDirPath = path.join(rlmDirPath, "licenses");

var assetPath = path.resolve(__dirname, "..", "assets", "rlm");

var dockerComposeAsset = path.join(assetPath, DOCKER_COMPOSE_FILENAME);
var dockerfileAsset = path.join(assetPath, DOCKERFILE_FILENAME);
var entrypointAsset = path.join(assetPath, ENTRYPOINT_FILENAME);
var rlmExecutableAsset = path.join(assetPath, RLM_EXECUTABLE_FILENAME);
var redgiantSetAsset = path.join(assetPath, REDGIANT_SET_FILENAME);

var dockerComposeDest = path.join(rlmDirPath, DOCKER_COMPOSE_FILENAME);
var dockerfileDest = path.join(rlmDirPath, DOCKERFILE_FILENAME);
var entrypointDest = path.join(rlmAssetsDirPath, ENTRYPOINT_FILENAME);
var rlmExecutableDest = path.join(rlmAssetsDirPath, RLM_EXECUTABLE_FILENAME);
var redgiantSetDest = path.join(rlmAssetsDirPath, REDGIANT_SET_FILENAME);
var addIsvScriptDest = path.join(rlmAssetsDirPath, ADD_ISV_FILENAME);

module.exports.licenseDirPath = licenseDirPath;
module.exports.rlmDirPath = rlmDirPath;
module.exports.rlmAssetsDirPath = rlmAssetsDirPath;

module.exports.dockerComposeAsset = dockerComposeAsset;
module.exports.dockerfileAsset = dockerfileAsset;
module.exports.entrypointAsset = entrypointAsset;
module.exports.rlmExecutableAsset = rlmExecutableAsset;
module.exports.redgiantSetAsset = redgiantSetAsset;

module.exports.dockerComposeDest = dockerComposeDest;
module.exports.dockerfileDest = dockerfileDest;
module.exports.entrypointDest = entrypointDest;
module.exports.rlmExecutableDest = rlmExecutableDest;
module.exports.redgiantSetDest = redgiantSetDest;
module.exports.addIsvScriptDest = addIsvScriptDest;
