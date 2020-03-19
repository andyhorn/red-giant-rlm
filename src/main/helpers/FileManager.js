const fs = require('fs');
const path = require('path');
const FilePaths = require('../contracts/FilePaths');

export function CreateServiceFolder(orgName) {
    let folderPath = path.join(FilePaths.licenseDirPath, orgName);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}

export function CopyLicenseFiles(orgName, fileList) {
    CreateServiceFolder(orgName);
    for (let file of fileList) {
        let filename = path.basename(file);
        let dest = path.join(FilePaths.licenseDirPath, orgName, filename);
        fs.copyFileSync(file, dest);
    }
}