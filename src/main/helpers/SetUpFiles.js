const fs = require('fs');
const FilePaths = require('../contracts/FilePaths');
const download = require('download-file');
const path = require('path');

const ADD_ISV_SCRIPT_URL = "https://raw.githubusercontent.com/andyhorn/red-giant-add-isv/master/add-isv.py"

export default function(force = false) {
    makeDir(FilePaths.rlmDirPath);
    makeDir(FilePaths.licenseDirPath);
    makeDir(FilePaths.rlmAssetsDirPath);

    copyFile(FilePaths.dockerComposeAsset, FilePaths.dockerComposeDest, force);
    copyFile(FilePaths.dockerfileAsset, FilePaths.dockerfileDest, force);
    copyFile(FilePaths.entrypointAsset, FilePaths.entrypointDest, force);
    copyFile(FilePaths.rlmExecutableAsset, FilePaths.rlmExecutableDest, force);
    copyFile(FilePaths.redgiantSetAsset, FilePaths.redgiantSetDest, force);

    downloadFile(FilePaths.addIsvScriptDest, ADD_ISV_SCRIPT_URL);
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

function downloadFile(dest, uri) {
    dest = dest.split(path.sep);
    let dir = dest.slice(0, dest.length - 2);
    dir = dir.join(path.sep);
    let file = dest[dest.length - 1];

    console.log(dir);
    console.log(file);

    let options = {
        directory: dir,
        filename: file
    };

    download(uri, options);
}