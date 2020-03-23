const fs = require('fs');
const path = require('path');
const FilePaths = require('../contracts/FilePaths');
const replace = require('replace');

const ISV_FROM = "ISV redgiant";

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

export function RemoveLicenseFiles(name) {
    let directory = path.join(FilePaths.licenseDirPath, name);

    if (fs.existsSync(directory)) {
        fs.rmdirSync(directory, { recursive: true });
    }
}

export function UpdateIsv(orgName, isvPort) {
    let directory = path.join(FilePaths.licenseDirPath, orgName);
    let files = fs.readdirSync(directory).filter(f => f.endsWith('.lic'));
    files = files.map(f => f = path.join(directory, f));

    let newLine = `${ISV_FROM} port=${isvPort}`;

    console.log(`Updating ISV for ${orgName} to port ${isvPort}`);
    console.log(newLine);
    console.log("Updating files:");
    console.log(files);

    let options = {
        regex: "ISV redgiant",
        replacement: newLine,
        paths: files
    };

    return replace(options);
}