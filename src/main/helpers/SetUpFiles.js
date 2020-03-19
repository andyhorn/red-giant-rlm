const fs = require('fs');
const FilePaths = require('../contracts/FilePaths');

export default function(force = false) {
    makeDir(FilePaths.rlmDirPath);
    makeDir(FilePaths.licenseDirPath);
    makeDir(FilePaths.rlmAssetsDirPath);

    copyFile(FilePaths.dockerComposeAsset, FilePaths.dockerComposeDest, force);
    copyFile(FilePaths.dockerfileAsset, FilePaths.dockerfileDest, force);
    copyFile(FilePaths.entrypointAsset, FilePaths.entrypointDest, force);
    copyFile(FilePaths.rlmExecutableAsset, FilePaths.rlmExecutableDest, force);
}

function makeDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

function copyFile(from, to, force) {
    if (force || !fs.existsSync(to)) {
        fs.copyFileSync(from, to);
    }
}