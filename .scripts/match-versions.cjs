const fs = require('fs')
const path = require('path')

const workspaces = ['packages']

// Read the root package.json to get the desired version
const CWD = process.cwd()
const rootPackagePath = path.resolve(path.join(CWD, 'package.json'))
const rootPackageContent = fs.readFileSync(rootPackagePath, 'utf-8')
const rootPackage = JSON.parse(rootPackageContent)
const desiredVersion = rootPackage.version

if (!desiredVersion) {
  rootPackage.version = '0.0.1'
  fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2) + '\n')
}

function updateWorkspacePackages(workspaceDir) {
  // Get a list of package directories
  const packagesDir = path.resolve(path.join(CWD, workspaceDir))
  const packageDirs = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  // Update versions in each package's package.json
  packageDirs.forEach(packageName => {
    const packagePath = path.join(packagesDir, packageName, 'package.json')
    if (!fs.existsSync(packagePath)) {
      console.log(`No package.json found in ${packageName}`)
      return
    }

    const packageContent = fs.readFileSync(packagePath, 'utf-8')
    const packageData = JSON.parse(packageContent)

    if (packageData.version !== desiredVersion) {
      packageData.version = desiredVersion
      fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n')
      console.log(`Updated version in ${packageName}/package.json`)
    } else {
      console.log(`${packageName}/package.json is already up to date`)
    }
  })
}

function main() {
  workspaces.forEach(updateWorkspacePackages)
  console.log('Version update process complete.')
}

main()
