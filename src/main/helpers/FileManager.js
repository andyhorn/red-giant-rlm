const fs = require('fs')
const path = require('path')
const FilePaths = require('../contracts/FilePaths')
const replace = require('replace')
const { dialog } = require('electron')

const ISV_FROM = 'ISV redgiant'

// Create a folder within the "licenses" directory for
// a new organization
export function CreateServiceFolder (orgName) {
  // Format the directory path
  let folderPath = path.join(FilePaths.licenseDirPath, orgName)

  // If the path doesn't exist, create it
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  }
}

// Copy the license files from the local system to the
// organization's license directory
export function CopyLicenseFiles (orgName, fileList) {
  // Make sure the organization's license directory exists
  CreateServiceFolder(orgName)

  // For each file in the list of files
  for (let file of fileList) {
    // Get the filename
    let filename = path.basename(file)

    // Format the destination filename
    let dest = path.join(FilePaths.licenseDirPath, orgName, filename)

    // Copy the file
    fs.copyFileSync(file, dest)
  }
}

// Remove any existing licenses for an organization
export function ClearLicensesFor (orgName) {
  // Delete the license directory
  RemoveLicenseDirectoryFor(orgName)

  // Create the license directory
  CreateServiceFolder(orgName)
}

// Open a dialog window to prompt the user to select
// a location to save a file
export function GetSaveLocation (defaultFileName) {
  // Set the default path to the local Desktop
  let defaultPath = path.join(require('os').homedir(), 'Desktop', defaultFileName)
  let options = {
    title: 'Save File',
    defaultPath: defaultPath
  }

  // Open the dialog window and get the save path
  let writePath = dialog.showSaveDialogSync(options)

  return writePath
}

export function RemoveLicenseDirectoryFor (name) {
  // Format the full path for the license directory
  let directory = path.join(FilePaths.licenseDirPath, name)

  // If the directory exists, remove it and all its contents
  if (fs.existsSync(directory)) {
    fs.rmdirSync(directory, { recursive: true })
  }
}

// Inject the desired ISV port value into all licenses for
// a given organization
export function UpdateIsv (orgName, isvPort) {
  // Format the license directory
  let directory = path.join(FilePaths.licenseDirPath, orgName)

  // Get the list of .lic files in the directory
  let files = fs.readdirSync(directory).filter(f => f.endsWith('.lic'))
  // Format each filename to the absolute path
  files = files.map(f => path.join(directory, f))

  // Construct the ISV line
  let newLine = `${ISV_FROM} port=${isvPort}`

  console.log(`Updating ISV for ${orgName} to port ${isvPort}`)
  console.log(newLine)
  console.log('Updating files:')
  console.log(files)

  // Set the options - Replace the 'regex' field with the 'replacement' field
  // in all files in the 'paths' variable
  let options = {
    regex: 'ISV redgiant',
    replacement: newLine,
    paths: files
  }

  // Execute the in-place modifications
  return replace(options)
}

// Save 'data' to a file
export function SaveFile (fileName, data) {
  // Use a dialog to get the save location
  let writePath = GetSaveLocation(fileName)

  // If the user didn't cancel, write the data to the file
  if (writePath) {
    fs.writeFileSync(writePath, data)
  }
}
