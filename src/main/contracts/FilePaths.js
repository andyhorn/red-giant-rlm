const path = require('path');

const DOCKER_COMPOSE_FILENAME = "docker-compose.yml";
const DOCKERFILE_FILENAME = "Dockerfile";
const ENTRYPOINT_FILENAME = "entrypoint.sh";

var rlmDirPath = path.join("C:", "RLM");
var licenseDirPath = path.join(rlmDirPath, "Licenses");

var assetPath = path.resolve(__dirname, "..", "assets", "rlm");

var dockerComposeAsset = path.join(assetPath, DOCKER_COMPOSE_FILENAME);
var dockerfileAsset = path.join(assetPath, DOCKERFILE_FILENAME);
var entrypointAsset = path.join(assetPath, ENTRYPOINT_FILENAME);

var dockerComposeDest = path.join(rlmDirPath, DOCKER_COMPOSE_FILENAME);
var dockerfileDest = path.join(rlmDirPath, DOCKERFILE_FILENAME);
var entrypointDest = path.join(rlmDirPath, ENTRYPOINT_FILENAME);

module.exports.licenseDirPath = licenseDirPath;
module.exports.rlmDirPath = rlmDirPath;
module.exports.dockerComposeAsset = dockerComposeAsset;
module.exports.dockerfileAsset = dockerfileAsset;
module.exports.entrypointAsset = entrypointAsset;
module.exports.dockerComposeDest = dockerComposeDest;
module.exports.dockerfileDest = dockerfileDest;
module.exports.entrypointDest = entrypointDest;